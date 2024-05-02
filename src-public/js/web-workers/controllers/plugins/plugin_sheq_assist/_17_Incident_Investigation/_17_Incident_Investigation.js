(() => {
	
	const RISK_RATING_CONSTANTS = {
		LOW: "Low",
		MEDIUM: "Medium",
		HIGH: "High",
		VERY_HIGH: "Very High",
	};
	
	const RISK_RATING_FUNS = {
		[RISK_RATING_CONSTANTS.LOW]: val => val >= 0 && val <= 4,
		[RISK_RATING_CONSTANTS.MEDIUM]: val => val >= 5 && val <= 8,
		[RISK_RATING_CONSTANTS.HIGH]: val => val >= 9 && val <= 15,
		[RISK_RATING_CONSTANTS.VERY_HIGH]: val => val >= 16 && val <= 25,
	};
	
	class Controller extends AControllerAid {
		// <editor-fold defaultstate="collapsed" desc="constructor">
		/*incident, incident_type, incident_whats_involved,
		 injury_type, health_or_diseases, indicate,
		 witness, person_injured, person_injured_contact_num,
		 incident_date, incident_time, report_date, report_time,
		 human_cause, natural_cause, occupational_stressor_classification,
		 desc, who_or_what_caused, whats_damaged,
		 suggested_preemptive_action, suggested_preemptive_action_options,
		 affected_person_name, form_completed_by, reported_to,
		 supervior_or_manager*/
		constructor(events) {
			super(events, {
				singular: "Incident Investigation",
				plural: "Incident Investigations"
			}, "plugin_sheq_assist/17_Incident_Investigation/", "plugin_sheq_assist_17_Incident_Investigation");
			
			const {addAction} = this;
			
			addAction("classification", this.classification.bind(this));
			addAction("investigation", this.investigation.bind(this));
			addAction("corrective-actions", this.corrective_actions.bind(this));
			addAction("add-status", this.addStatus.bind(this));
			addAction("remove-status", this.removeStatus.bind(this));
			addAction("list/search_by_name", this.search_by_name.bind(this));
			// addAction("list/filter", this.filter.bind(this));
			addAction("stats", this.stats.bind(this));
			
			// addAction("select/filter", this.filter_select.bind(this));
			
			addAction("dashboard/total/low-risk", this.dashboard_total_low_risk.bind(this));
			addAction("dashboard/total/medium-risk", this.dashboard_total_medium_risk.bind(this));
			addAction("dashboard/total/high-risk", this.dashboard_total_high_risk.bind(this));
			addAction("dashboard/total/very-high-risk", this.dashboard_total_very_high_risk.bind(this));
			
			addAction("dashboard/total/count", this.dashboard_total_count.bind(this));
			addAction("dashboard/total/vehicles-involved", this.dashboard_total_vehicles_involved.bind(this));
			addAction("dashboard/total/persons-injured", this.dashboard_total_persons_injured.bind(this));
			
			const fn = async () => {
				const doc_ref = await this.getDB().collection(this.tbl);//Promise < DocumentReference < T > >
				const querySnapshot = await doc_ref.get();
				const list = [];
				querySnapshot.forEach((doc) => {
					list.push(doc);
				});
				
				await Promise.all(list.map(async (doc) => {
					const doc_ref = await this.getDB().collection(this.tbl).doc(doc.id);
					let snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
					const old_data = snapshot.data();
					let {
						sec14_data,
						sec15_data
					} = old_data;
					if (old_data.sec14_data && !Object.keys(old_data.sec14_data).isEmpty()) {
						console.log('incidents sec14_data', old_data.sec14_data);
						const {consequence, likelihood} = old_data.sec14_data;
						if (isString(consequence)) {
							old_data.sec14_data.consequence = parseInt(consequence.charAt(0));
						}
						if (isString(likelihood)) {
							old_data.sec14_data.likelihood = ['A', 'B', 'C', 'D', 'E'].indexOf(likelihood.charAt(0)) + 1;
						}
					}
					if (old_data.sec15_data && !Object.keys(old_data.sec15_data).isEmpty()) {
						console.log('incidents sec15_data', old_data.sec15_data);
						const {consequence, likelihood, risk_rating} = old_data.sec15_data;
						if (!old_data.sec14_data) {
							old_data.sec14_data = {};
						}
						if (isString(consequence)) {
							old_data.sec14_data.consequence = parseInt(consequence.charAt(0));
						} else if (isNumber(consequence)) {
							old_data.sec14_data.consequence = consequence;
						}
						if (isString(likelihood)) {
							old_data.sec14_data.likelihood = ['A', 'B', 'C', 'D', 'E'].indexOf(likelihood.charAt(0)) + 1;
						} else if (isNumber(likelihood)) {
							old_data.sec14_data.likelihood = likelihood;
						}
						if (risk_rating) {
							old_data.sec14_data.risk_rating = risk_rating;
						}
						delete old_data.sec15_data.consequence;
						delete old_data.sec15_data.likelihood;
						delete old_data.sec15_data.risk_rating;
					}
					
					if (old_data.sec14_data) {
						const {consequence, likelihood, risk_rating} = old_data.sec14_data;
						if (!risk_rating) {
							old_data.sec14_data.risk_rating = {consequence, likelihood};
						}
						
						delete old_data.sec14_data.consequence_1;
						delete old_data.sec14_data.likelihood_1;
					}

//                    const updated = await doc_ref.set(old_data, {merge: true});//Promise < void >
					
					console.log('incidents', doc.id);
				}));
				console.log('incidents final');
			};

//            fn().catch(err => {
//                console.error('incidents error', err)
//            });
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="create">
		async create(evt, data) {
			return Events.whenLoggedIn(async loggedUser => {
				if (!data.status) {
					data.status = [];
				}
				
				const {sec9_data, sec10_data, sec13_data, sec15_data} = data;
				
				let document_list, third_party_document_list;
				
				if (sec9_data) {
					const {incident_date, incident_time} = sec9_data;
					const __incident_date = Dates.parse(incident_date);
					const hours = incident_time ? parseInt(incident_time.split(":")[0]) : null;
					sec9_data.incident_date_split = {
						year: __incident_date ? __incident_date.getFullYear() : null,
						month: __incident_date ? __incident_date.getMonth() : null,
						date: __incident_date ? __incident_date.getDate() : null,
						day: __incident_date ? __incident_date.getDay() : null,
						am_pm: hours ? ((hours >= 12) ? "PM" : "AM") : null
					};
				}
				if (sec10_data && sec10_data.document_list) {
					document_list = sec10_data.document_list;
					delete sec10_data.document_list;
				}
				if (sec13_data && sec13_data.third_party_document_list) {
					third_party_document_list = sec13_data.third_party_document_list;
					delete sec13_data.third_party_document_list;
				}
				
				let savedItem = await AControllerAid.prototype.create.call(this, evt, data);
				if (savedItem) {
					savedItem = await IncidentFuns.mapResults.call(this, savedItem);
					await IncidentFuns.updateEmployee.call(this, savedItem);
					
					const updateAttrs = {};
					if (document_list) {
						document_list = await Promise.all(document_list.map(async (file, n) => {
							const gcsUri = await files.upload.call(this, file, async function (bucketFile) {
								const name = fileUtils.getFileName(file).replaceAll(' ', '_');
								const new_name = this.tbl + '/' + savedItem.id + '/sec10_data/document_list/' + n + '/' + name;
								return new_name;
							}.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                                throw e;
							});
							return gcsUri;
						}));
						updateAttrs.sec10_data = {document_list};
					}
					if (third_party_document_list) {
						third_party_document_list = await Promise.all(third_party_document_list.map(async (file, n) => {
							const gcsUri = await files.upload.call(this, file, async function (bucketFile) {
								const name = fileUtils.getFileName(file).replaceAll(' ', '_');
								const new_name = this.tbl + '/' + savedItem.id + '/sec13_data/third_party_document_list/' + n + '/' + name;
								return new_name;
							}.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                                throw e;
							});
							return gcsUri;
						}));
						updateAttrs.sec13_data = {third_party_document_list};
					}
					
					if (!Object.keys(updateAttrs).isEmpty()) {
						await this.update(evt, savedItem.id, updateAttrs);
						if (document_list) {
							savedItem.data.sec10_data.document_list = document_list;
						}
						if (third_party_document_list) {
							savedItem.data.sec13_data.third_party_document_list = third_party_document_list;
						}
					}
					
					const sendEmails = async (emails) => {
						let {
							data: {
								classification = {},
								sec1_data = {},
								sec2_data = {},
								sec3_data = {},
								sec6_data = {},
								sec9_data = {},
								sec14_data = {},
								client,
								project,
								site
							}
						} = savedItem;
						sec1_data = classification.sec1_data || sec1_data;
						sec2_data = classification.sec2_data || sec2_data;
						sec3_data = classification.sec3_data || sec3_data;
						const {category_list = [], sector_list = []} = sec1_data;
						const {activity_list = []} = sec2_data;
						const {sub_category_list = []} = sec3_data;
						const {person_reporting} = sec6_data;
						const {incident_date, incident_time = "N/A", exact_location = "N/A"} = sec9_data;
						const {consequence = null, likelihood = null} = sec14_data;
						let rating;
						if (isNumber(consequence) && isNumber(likelihood)) {
							const score = likelihood * consequence;
							if (score > 15) {
								rating = "Extreme";
							} else if (score >= 9 && score <= 15) {
								rating = "High";
							} else if (score >= 5 && score <= 8) {
								rating = "Moderate";
							} else if (score < 5) {
								rating = "Low";
							}
						} else {
							rating = 'N/A';
						}
						
						let location = "";
						if (client) {
							location = client.name || client.data.name;
						}
						if (project) {
							location += " > " + (project.name || project.data.name);
						}
						if (site) {
							location += " > " + (site.name || site.data.name);
						}
						if (location.isEmpty()) {
							location = "N/A";
						}
						const opts = {
							from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
//                            to: emails.join(','),
							bcc: emails.join(','),
							subject: 'Incident Recorded',
							html: '<p>This is an automated email from SHEQ Aid.<br />Please do not reply to this email.</p>\n\
                            <p>The following incident has been reported:</p>\n\
                            <p>Location (Company/Project/Site): <b>' + location + '</b></p>\n\
                            <p>ID: <b>' + savedItem.id + '</b></p>\n\
                            <p>Incident Exact Location: <b>' + exact_location + '</b></p>\n\
                            <p>Incident Category: <b>' + (!category_list.isEmpty() ? category_list.map(v => isString(v) ? v : v.value) : 'N/A') + '</b></p>\n\
                            <p>Incident Sub-Category: <b>' + (!sub_category_list.isEmpty() ? sub_category_list.filter(v => !!v).map(v => isString(v) ? v : v.value) : 'N/A') + '</b></p>\n\
                            <p>Sector(s): <b>' + (!sector_list.isEmpty() ? sector_list.map(v => isString(v) ? v : v.value) : 'N/A') + '</b></p>\n\
                            <p>Activities: <b>' + (!activity_list.isEmpty() ? activity_list.map(v => isString(v) ? v : v.value) : 'N/A') + '</b></p>\n\
                            <p>Date Of Incident: <b>' + (Dates.formatDate(incident_date) || 'N/A') + '</b></p>\n\
                            <p>Time Of Incident: <b>' + incident_time + '</b></p>\n\
                            <p>Incident Severity: <b>' + rating + '</b></p>\n\
                            <p>Reported By: <b>' + (person_reporting ? ((person_reporting.fname || person_reporting.data.fname) + ' ' + (person_reporting.lname || person_reporting.data.lname)) : 'N/A') + '</b></p>\n\
                            <p>Kind Regards<br/>SHEQ Aid</p>'
						};
						
						await Utils.sendEmail(opts);
					};
					
					let emails = [];
					
					const {contractor_id: logged_contractor_id} = loggedUser;
					if (logged_contractor_id) {
						const users_ctrl = await Events.get('users/');
						const employees_ctrl = await Events.get('plugin_sheq_assist/employees/');
						const user_list = await users_ctrl.filter_by_notification_key.call(users_ctrl, null, this.notification_key, true);
						const employee_list = await employees_ctrl.filter_by_notification_key.call(employees_ctrl, null, this.notification_key, true);
						
						emails = [
							...user_list.map(val => val.data.username),
							...employee_list.filter(val => val.data.email).map(val => val.data.email)
						];
					}
					
					if (sec15_data && sec15_data.distribution_list) {
						emails.push(...sec15_data.distribution_list.filter(v => v.email || (v.data && v.data.email)).map((item) => {
							let {email, data} = item;
							if (data) {
								email = data.email;
							}
							return email;
						}));
					}
					
					if (!emails.isEmpty()) {
						await sendEmails(emails);
					}
				}
				return savedItem;
			});
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="update">
		async update(evt, id, updateAttrs) {
			const {sec9_data, sec10_data, sec13_data, sec15_data} = updateAttrs;
			if (sec9_data && (sec9_data.incident_date || sec9_data.incident_time)) {
				const doc_ref = await this.getDB().collection(this.tbl).doc(id);
				const snapshot = await doc_ref.get();
				if (!snapshot.exists) {
					return null;
				}
				
				const old_data = snapshot.data();
				const {
					incident_date: incident_date_old,
					incident_time: incident_time_old,
					incident_date_split: incident_date_split_old
				} = old_data;
				
				sec9_data.incident_date_split = incident_date_split_old || {};
				
				const {incident_date, incident_time} = sec9_data;
				if (incident_date) {
					const __incident_date = Dates.parse(incident_date);
					sec9_data.incident_date_split.year = __incident_date.getFullYear();
					sec9_data.incident_date_split.month = __incident_date.getMonth();
					sec9_data.incident_date_split.date = __incident_date.getDate();
					sec9_data.incident_date_split.day = __incident_date.getDay();
				}
				if (incident_time) {
					const hours = parseInt(incident_time.split(":")[0]);
					sec9_data.incident_date_split.am_pm = (hours >= 12) ? "PM" : "AM";
				}
			}
			
			let document_list, third_party_document_list;
			let document_list_old, third_party_document_list_old;
			
			if (sec10_data && sec10_data.document_list) {
				document_list = sec10_data.document_list.filter(v => isFile(v));
				document_list_old = sec10_data.document_list.filter(v => !isFile(v));
				delete sec10_data.document_list;
			}
			if (sec13_data && sec13_data.third_party_document_list) {
				third_party_document_list = sec13_data.third_party_document_list.filter(v => isFile(v));
				third_party_document_list_old = sec13_data.third_party_document_list.filter(v => !isFile(v));
				delete sec13_data.third_party_document_list;
			}
			if (document_list) {
				document_list = await Promise.all(document_list.map(async (file, n) => {
					const gcsUri = await files.upload.call(this, file, async function (bucketFile) {
						const name = fileUtils.getFileName(file).replaceAll(' ', '_');
						const new_name = this.tbl + '/' + id + '/sec10_data/document_list/' + n + '/' + name;
						return new_name;
					}.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                                throw e;
					});
					return gcsUri;
				}));
				sec10_data.document_list = [...document_list_old, ...document_list];
			}
			if (third_party_document_list) {
				third_party_document_list = await Promise.all(third_party_document_list.map(async (file, n) => {
					const gcsUri = await files.upload.call(this, file, async function (bucketFile) {
						const name = fileUtils.getFileName(file).replaceAll(' ', '_');
						const new_name = this.tbl + '/' + id + '/sec13_data/third_party_document_list/' + n + '/' + name;
						return new_name;
					}.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                                throw e;
					});
					return gcsUri;
				}));
				sec13_data.third_party_document_list = [...third_party_document_list_old, ...third_party_document_list];
			}
			
			
			let savedData = await AControllerAid.prototype.update.call(this, evt, id, updateAttrs);
			if (savedData) {
				let savedItem = {id, data: savedData};
//                console.log('savedData', savedData)
				savedItem = await IncidentFuns.mapResults.call(this, savedItem);
				await IncidentFuns.updateEmployee.call(this, savedItem);
				savedData = savedItem.data;
			}
			return savedData;
//            return this.updateAndUploadIfManyFiles(evt, id, data, ["document_list", "third_party_document_list"]);
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="classification">
		async classification(evt, id, data) {
			return this.update(evt, id, data);
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="investigation">
		async investigation(evt, id, data) {
			return this.update(evt, id, data);
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="corrective_actions">
		async corrective_actions(evt, id, data) {
			return this.update(evt, id, data);
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="updateStatus">
		async updateStatus(evt, id, status, action) {
			return Events.whenLoggedIn(async loggedUser => {
				const doc_ref = await this.getDB().collection(this.tbl).doc(id);
				let snapshot = await doc_ref.get();
				if (!snapshot.exists) {
					return null;
				}
				
				const old_data = snapshot.data();
				const {created_at} = old_data;
				if (created_at && created_at.toDate) {
					old_data.created_at = created_at.toDate();
				}
				
				const updated = await doc_ref.update({status: FBSettings.FieldValue["array" + action](status)});//Promise < void >
				snapshot = await doc_ref.get();
				
				let data = snapshot.data();
				const {created_at: created_at_2} = data;
				if (created_at_2 && created_at_2.toDate) {
					data.created_at = created_at_2.toDate();
				}
				
				let auditData = {id: snapshot.id, data: old_data};
				
				this.editAudit(loggedUser, new Date().getTime(), auditData);
				
				auditData = await IncidentFuns.mapResults.call(this, {id: snapshot.id, data});

//                console.log('update', updated)
				return auditData.data;
			});
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="addStatus">
		async addStatus(evt, id, status) {
			return this.updateStatus(evt, id, status, "Union");
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="removeStatus">
		async removeStatus(evt, id, status) {
			return this.updateStatus(evt, id, status, "Remove");
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="remove">
		async remove(evt, id) {
			return this.removeWithFile(evt, id, async ({data: {sec10_data, sec13_data}}) => {
				if (sec10_data && sec10_data.document_list) {
					await Promise.all(sec10_data.document_list.map(async v => {
						return v && await files.remove(v);
					}));
				}
				if (sec13_data && sec13_data.third_party_document_list) {
					await Promise.all(sec13_data.third_party_document_list.map(async v => {
						return v && await files.remove(v);
					}));
				}
			});
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="export_excel">
		async export_excel(evt, {
			client: _client, project: _project, site: _site,
			list,
		}) {
			return Events.whenLoggedIn(async loggedUser => {
				if (isArray(list)) {
					const rows = list.map((item, idx) => {
						let {
							id,
							data: {
								created_at,
								//0
								company, client, project, site,
								//1
								group,
								short_desc,
								desc,
								location,
								exact_location,
								document_list,
								//2
								incident_date,
								incident_time,
								date_reported,
								time_reported,
								time_shift,
								//3
								category_list,
								sub_category_list,
								//4
								sector_list,
								activity_list,
								//5.1
								person_involved_list,
								//5.2
								person_reporting,
								//5.3
								person_reported_to,
								//5.4
								witness_list,
								//5.5
								distribution_list,
								//6
								is_vehicle_incident,
								is_infringement_issued,
								did_police_attend_scene,
								collision_reported_to_police_station,
								have_charges_been_laid,
								driver,
								driver_dob,
								driver_gender,
								address,
								email,
								phone,
								licence_num,
								licence_expiry,
								licence_years,
								vehicle_make,
								vehicle_model,
								vehicle_year,
								vehicle_color,
								vehicle_reg_num,
								vehicle_fleet_num,
								vehicle_reg_date,
								vehicle_trip_type,
								vehicle_load_type,
								was_3rd_party_involved,
								are_3rd_party_details_available,
								third_party_fname,
								third_party_lname,
								third_party_address,
								third_party_email,
								third_party_phone,
								did_driver_admit_liability,
								did_someone_else_admit_liability,
								someone_else_admit_liability_name,
								liability_admitted_to_name,
								third_party_opinion,
								third_party_document_list,
								penalty_num,
								issuing_authority,
								issuing_officer,
								type_of_breach,
								addressee_issued_to_name,
								addressee_name_or_entity,
								addressee_amount,
								addressee_due_date,
								ref_or_report_num,
								officer_name,
								officer_station,
								nature_of_charges,
								who_laid_charges,
								who_were_nature_charges_laid_against,
								//7
								is_person_injured,
								person_injured,
								injured_person_dob,
								injured_person_gender,
								nature_of_injury_list,
								bodily_injury_location_list,
								injury_mechanism_list,
								injury_desc,
								//8
								test_undertaken,
								test_type_list,
								test_type_drug_undertaken,
								test_type_alcohol_undertaken,
								test_type_mobile_device_undertaken,
								//9
								consequence,
								likelihood,
								risk_rating,
							}
						} = item;
						
						client = client || company;
						
						return {
							idx: idx + 1,
							
							project: project && project.name,
							site: site && site.name,
							
							due_date: Dates.formatDateSQL(due_date),
							investigation_details,
							investigation_findings_list: (investigation_findings_list || []).map(({text}) => text),
							investigation_findings_further_desc,
							document_list: (document_list || []).map(({text}) => text),
							consequence,
							likelihood,
							weather_condition_list: (weather_condition_list || []).map(({text}) => text),
							protective_equipment_worn_list: (protective_equipment_worn_list || []).map(({text}) => text),
							class_list: (class_list || []).map(({text}) => text),
							environment_list: (environment_list || []).map(({text}) => text),
							severity,
							estimated_costs_damages,
							estimated_costs_medical,
							estimated_costs_salaries_wages,
							estimated_costs_investigations,
							estimated_costs_others,
							
						};
					});
					
					const response = await fetch(
						`${self.locationRoot}/templates/xlsx/incidents/Template-List-Incidents.xlsx`.replace('//', '/')
					);
					const arrayBuffer = await response.arrayBuffer();
					const data = new Map();
					
					data.set('date', new Date().formatDate());
					
					data.set('company', _client ? _client.name || _client.data.name : "ANY");
					data.set('project', _project ? _project.name || _project.data.name : "ANY");
					data.set('site', _site ? _site.name || _site.data.name : "ANY");
					
					data.set("rows", rows);
					return await Events.emit("excelTemplate", {arrayBuffer, data});
					// return await this.export_excel_impl(loggedUser, "Training-Toolbox-Talks-Docs", "Attendance-Register", "Attendance-Register List", cols, rows);
				}
				return list;
			});
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="filter_select">
		async filter_select(evt, filterData) {
			return Events.whenLoggedIn(async loggedUser => {
				const {user: {data: {client: my_client, project: my_project, site: my_site}}} = loggedUser;
				const {client_id, project_id, site_id, isNew} = filterData;
				let list = await AControllerRead.prototype.listImpl.call(this, evt, {
					isNew,
					limit: -1,
					direction: 'desc'
				}, q => {
					if (my_client) {
						q = q.where('client_id', '==', my_client.id);
					} else if (client_id) {
						q = q.where('client_id', '==', client_id);
					}
					if (my_project) {
						q = q.where('project_id', '==', my_project.id);
					} else if (project_id) {
						q = q.where('project_id', '==', project_id);
					}
					if (my_site) {
						q = q.where('site_id', '==', my_site.id);
					} else if (site_id) {
						q = q.where('site_id', '==', site_id);
					}
					return q;
				});
				list = await Promise.all(list.map(IncidentFuns.mapResults.bind(this)));
				return list;
			});
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="search_by_name">
		async search_by_name(evt, search_val) {
			return this.filter_by(evt, search_val, search_val => {
				return val => {
					const {title} = val.data;
					return title.toLowerCase().startsWith(search_val)
				};
			});
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="list">
		async list(evt, opts = {}) {
			return Events.whenLoggedIn(async loggedUser => {
				const {direction = 'desc'} = opts;
				let list = await AControllerRead.prototype.listImpl.call(this, evt, {...opts, direction});
				list = await Promise.all(list.map(IncidentFuns.mapResults.bind(this)));
				return list;
			});
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="filter">
		async filter(evt, filterData, extraFilterData) {
			return Events.whenLoggedIn(async loggedUser => {
				const {
					incident_date_range,
					incident_status,
					investigation_status,
					category,
					sub_category,
					sector,
					activity
				} = filterData;
				let list = await AControllerRead.prototype.listImpl.call(this, evt, {direction: 'desc'}, q => {
					if (incident_date_range) {
						if (incident_date_range.start) {
							q = q.where('sec9_data.incident_date', '>=', incident_date_range.start);
						}
						if (incident_date_range.end) {
							q = q.where('sec9_data.incident_date', '<=', incident_date_range.end);
						}
					}
					if (incident_status) {
						switch (incident_status) {
							case 'ApprovedIncident':
							case 'ClosedIncident':
								q = q.where('status', 'array-contains', incident_status);
								break;
//                            case 'AwaitingApproval':
//                                ['ApprovedIncident', 'ClosedIncident']
//                                q = q.where('status', 'array-contains-any', 'ApprovedIncident');
//                                break;
							case 'AssignedInvestigator':
								q = q.where('classification.sec5_data.investigation_team_list', '!=', []);
								break;
							case 'Investigating':
								q = q.where('investigation', '!=', null);
								break;
							default:
								break;
						}
					}
					if (investigation_status) {
						switch (investigation_status) {
							case 'ApprovedInvestigation':
								q = q.where('status', 'array-contains', investigation_status);
								break;
//                            case 'Investigating':
//                                q = q.where('investigation', '!=', null);
//                                ['ApprovedInvestigation', 'ClosedInvestigation']
//                                q = q.where('investigation.status', 'array-contains-any', 'ClosedInvestigation');
//                                break;
							case 'ClosedInvestigation':
								q = q.where('investigation.status', 'array-contains', investigation_status);
								break;
							default:
								break;
						}
					}
					if (category) {
						q = q.where('sec1_data.category_list', 'array-contains', category);
					}
					if (sub_category) {
						q = q.where('sec2_data.sub_category_list', 'array-contains', sub_category);
					}
					if (sector) {
						q = q.where('sec1_data.sector_list', 'array-contains', sector);
					}
					if (activity) {
						q = q.where('sec2_data.activity_list', 'array-contains', activity);
					}
					return q;
				});
				list = await Promise.all(list.map(IncidentFuns.mapResults.bind(this)));
				return list;
			});
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="dashboard_totals">
		async dashboard_total_risk_rating_impl(evt, data = {}) {
			return Events.whenLoggedIn(async loggedUser => {
				const {interval, employee_view, risk_rating} = data;
				let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
					return q;
				});
				
				// list = await TrainingsFuns.filterActiveOrInactiveEmployees(list, employee_view);
				
				return list
					.map(({data: {investigation, sec14_data}}) => getRiskRating({sec14_data, investigation}))
					.filter(risk_rating => risk_rating !== null)
					.filter(RISK_RATING_FUNS[risk_rating]).length;
			});
		}
		
		async dashboard_total_low_risk(evt, data = {}) {
			return this.dashboard_total_risk_rating_impl(evt, {...data, risk_rating: RISK_RATING_CONSTANTS.LOW});
		}
		
		async dashboard_total_medium_risk(evt, data = {}) {
			return this.dashboard_total_risk_rating_impl(evt, {...data, risk_rating: RISK_RATING_CONSTANTS.MEDIUM});
		}
		
		async dashboard_total_high_risk(evt, data = {}) {
			return this.dashboard_total_risk_rating_impl(evt, {...data, risk_rating: RISK_RATING_CONSTANTS.HIGH});
		}
		
		async dashboard_total_very_high_risk(evt, data = {}) {
			return this.dashboard_total_risk_rating_impl(evt, {...data, risk_rating: RISK_RATING_CONSTANTS.VERY_HIGH});
		}
		
		async dashboard_total_count(evt, data = {}) {
			return Events.whenLoggedIn(async loggedUser => {
				const {interval, employee_view, risk_rating} = data;
				let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
					return q;
				});
				
				// list = await TrainingsFuns.filterActiveOrInactiveEmployees(list, employee_view);
				
				return list.length;
			});
		}
		
		async dashboard_total_vehicles_involved(evt, data = {}) {
			const {interval, employee_view, risk_rating} = data;
			let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
				return q;
			});
			
			// list = await TrainingsFuns.filterActiveOrInactiveEmployees(list, employee_view);
			
			// vehicle_make,
			// vehicle_model,
			// vehicle_year,
			// vehicle_color,
			// vehicle_reg_num,
			// vehicle_fleet_num,
			// vehicle_reg_date,
			// vehicle_trip_type,
			// vehicle_load_type
			
			return list
				.filter(({data: {sec13_data}}) => !!sec13_data && !!sec13_data.vehicle_reg_num)
				.map(({data: {sec13_data}}) => sec13_data.vehicle_reg_num)
				.distinct()
				.length;
		}
		
		async dashboard_total_persons_injured(evt, data = {}) {
			const {interval, employee_view, risk_rating} = data;
			let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
				return q;
			});
			
			// list = await TrainingsFuns.filterActiveOrInactiveEmployees(list, employee_view);
			
			return list
				.filter(({data: {sec11_data}}) => !!sec11_data && !!sec11_data.person_injured)
				.map(({data: {sec11_data}}) => sec11_data.person_injured)
				.map(({id, fname, lname, id_num, passport_num}) => `${id}${id_num}${passport_num}`)
				.distinct()
				.length;
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="stats">
		async stats(evt, yr) {
			return Events.whenLoggedIn(async loggedUser => {
				let list = await AControllerRead.prototype.listImpl.call(this, evt, {
					limit: -1,
					direction: 'desc'
				}, q => {
					q = q.where('sec9_data.incident_date_split.year', '==', yr);
					return q;
				});
				list = await Promise.all(list.map(IncidentFuns.mapResults.bind(this)));
				return list;
			});
		}
		
		// </editor-fold>
		
		sortBy() {
			return "sec9_data.incident_date";
		}
	}
	
	function getRiskRating({sec14_data, investigation}) {
		let risk_rating = null;
		let consequence = null;
		let likelihood = null;
		if (investigation && investigation.sec3_data && investigation.sec3_data.risk_rating) {
			risk_rating = investigation.sec3_data.risk_rating;
		} else if (sec14_data && sec14_data.risk_rating) {
			risk_rating = sec14_data.risk_rating;
		}
		if (investigation && investigation.sec3_data && investigation.sec3_data.consequence) {
			consequence = investigation.sec3_data.consequence;
		} else if (sec14_data && sec14_data.consequence) {
			consequence = sec14_data.consequence;
		}
		if (investigation && investigation.sec3_data && investigation.sec3_data.likelihood) {
			likelihood = investigation.sec3_data.likelihood;
		} else if (sec14_data && sec14_data.likelihood) {
			likelihood = sec14_data.likelihood;
		}
		
		if (risk_rating || (!!consequence && !!likelihood)) {
			let _likelihood, _consequence;
			
			const getLikelihood = (_likelihood) => {
				if (isString(_likelihood)) {
					return ['A', 'B', 'C', 'D', 'E'].indexOf(_likelihood.charAt(0)) + 1;
				} else if (isObject(_likelihood)) {
				
				}
				return _likelihood;
			};
			const getConsequence = (_consequence) => {
				if (isString(_consequence)) {
					return parseInt(_consequence.charAt(0));
				} else if (isObject(_consequence)) {
				
				}
				return _consequence;
			};
			
			if (risk_rating) {
				_likelihood = getLikelihood(risk_rating.likelihood);
				_consequence = getConsequence(risk_rating.consequence);
			} else {
				_likelihood = getLikelihood(likelihood);
				_consequence = getConsequence(consequence);
			}
			return _likelihood * _consequence;
		}
		return null;
	}
	
	new Controller(events);
})();
