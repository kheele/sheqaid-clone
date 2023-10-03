(() => {
	self.TBL_EMPLOYEES = "employees";

	class Controller extends AControllerAid {
		// <editor-fold defaultstate="collapsed" desc="constructor">
		constructor(events) {
			super(events, {
					singular: "Employee",
					plural: "Employees"
				}, "plugin_sheq_assist/employees/",
			);

			const {addAction} = this;

			addAction("import/file", this.importFile.bind(this));
			addAction("import/create", this.createImported.bind(this));
			addAction("send-app-link", this.send_app_link.bind(this));

			addAction("transfer", this.transfer.bind(this));

			addAction("remove/bulk", this.bulk_remove.bind(this));
			addAction("removed/re-instead", this.re_instead.bind(this));
		}

		// </editor-fold>

		getDB() {
			return db_hr;
		}

		// <editor-fold defaultstate="collapsed" desc="importFile">
		async importFile(evt, path) {
			const validHeaderNames = [
				{key: 'fname', value: ['First Name', 'Name'], required: true},
				{key: 'lname', value: ['Last Name', 'Surname'], required: true},
				{
					key: 'id_num',
					value: [
						'Identity Number', 'Identity No', 'Identity No.', 'Identity #',
						'ID', 'ID Number', 'ID No', 'ID No.', 'ID #'
					]
				},
				{
					key: 'passport_num',
					value: [
						'Passport Number', 'Passport', 'Passport No', 'Passport No.', 'Passport #'
					]
				},
				{
					key: 'id_or_pass_num',
					value: [
						'Identity/Passport Number', 'Identity/Passport No', 'Identity/Passport No.', 'Identity/Passport #',
						'Passport/Identity Number', 'Passport/Identity No', 'Passport/Identity No.', 'Passport/Identity #',
						'ID/Passport Number', 'ID/Passport No', 'ID/Passport No.', 'ID/Passport #',
						'Passport/ID Number', 'Passport/ID No', 'Passport/ID No.', 'Passport/ID #'
					]
				},
				{key: 'sex', value: ['Gender', 'Sex']},
				{key: 'dob', value: ['Date Of Birth', 'Birth Date', 'DOB', 'D.O.B', 'D.O.B.']},
				{
					key: 'phone',
					value: [
						'Phone', 'Phone Number', 'Phone No', 'Phone No.', 'Phone #',
						'Contact Number', 'Contact No', 'Contact No.', 'Contact #',
						'Cell', 'Cell Number', 'Cell No', 'Cell No.', 'Cell #'
					]
				},
				{key: 'email', value: ['Email Address', 'Email']},
				{
					key: 'employee_num',
					value: [
						'Employee Number', 'Employee No', 'Employee No.', 'Employee #',
						'Company Number', 'Company No', 'Company No.', 'Company #'
					]
				},
				{
					key: 'employment_date',
					value: [
						'Date Engaged', 'Date Employed',
						'Date of Employment', 'Date of Engagement',
						'Engagement Date', 'Employment Date'
					]
				},
				{key: 'job_position', value: ['Job Position', 'Job Title']},
				{key: 'job_category', value: ['Job Category', 'Occupational Level']},
				{key: 'department', value: ['Department', 'Department Title', 'Department Name']}
			];
			const res = await excelUtils.read(path, validHeaderNames);
			if (res.errors)
				return res;

			res.sortBy('lname');
			return res.distinct();
		}
		// </editor-fold>

		//<editor-fold desc="createImported">
		async createImported(evt, list) {
			return Events.whenLoggedIn(async loggedUser => {
				const emails = list.filter(({email}) => !!email).map(({email}) => email.toLowerCase());
				if (!emails.isEmpty()) {
					let snapshot = await this.getDB().collection(this.tbl).where('email', 'in', emails).get();
					if (!snapshot.empty) {
						let dups = [];
						snapshot.forEach((doc) => {
							dups.push(doc.data().email);
						});
						dups = dups.map(email => list.find(v => v.email === email));
						return {dups};
					}
				}

				return await Promise.all(list.map(async data => {
					return await this.create(evt, data);
				}));
			});
		}
		//</editor-fold>

		// <editor-fold defaultstate="collapsed" desc="send_app_link">
		async send_app_link(evt, id) {
			return Events.whenLoggedIn(async loggedUser => {
				const item = await this.find_by_id(null, id);
				if (item) {
					let {id, data: {password, email, fname, lname}} = item;
					if (email) {
//                        if (!password) {
//                            password = uuidv4();
//                            password = password.substring(0, password.indexOf('-'));
//
//                            const doc_ref = await this.getDB().collection(this.tbl).doc(id);
//                            let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
//                            if (!doc_snapshot.exists) {
//                                return null;
//                            }
//
//                            const updated = await doc_ref.update({password});//Promise < void >
//                        }
//                        const opts = {
//                            from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
//                            to: email,
//                            subject: 'SHEQ Aid Application Link',
//                            html: '<h3><b>Dear ' + fname + ' ' + lname + '</b></h3>\n\
//                                <p>If you have not yet used SHEQ Aid Application, please use the link below to download the application.</p>\n\
//                                <p>Your SHEQ Aid Username is <b>' + email + '</b>, Password is <b>' + password + '</b></p>\n\
//                                ' + Utils.getAppDownloadOptionMsg()
//                        };
//                        await Utils.sendEmail(opts);

						return true;
					}
					return "NO_EMAIL";
				}

				return "NOT_FOUND";
			});
		}

		// </editor-fold>

		// <editor-fold defaultstate="collapsed" desc="transfer">
		async transfer(evt, employeeListData) {
			return Events.whenLoggedIn(async loggedUser => {
				const res = await Promise.all(employeeListData.map(async ({id, data}) => {
					this.injectSavable(evt, loggedUser, data, true);
					const res = await this.update(evt, id, data);
					return res;
				}));

				console.log('transfer', res);

				return true;
			});
		}

		// </editor-fold>

		// <editor-fold defaultstate="collapsed" desc="bulk_remove">
		async bulk_remove(evt, ids) {
			return Events.whenLoggedIn(async loggedUser => {
				const resList = await Promise.all(ids.map(async id => {
					const doc_ref = await this.getDB().collection(this.tbl).doc(id);
					const snapshot = await doc_ref.get();
					if (!snapshot.exists) {
						return null;
					}

					const data = snapshot.data();
					const {created_at} = data;
					if (created_at && created_at.toDate) {
						data.created_at = created_at.toDate();
					}

					const auditData = {id: snapshot.id, data};

					const updated = await doc_ref.set({removed: true}, {merge: true});//Promise < void >

					this.removeAudit(loggedUser, new Date().getTime(), auditData);

					//console.log(this.tbl, 'remove', res)
					return true;
				}));
				return resList;
			});
		}

		// </editor-fold>

		// <editor-fold defaultstate="collapsed" desc="re_instead">
		async re_instead(evt, id) {
			return Events.whenLoggedIn(async loggedUser => {
				const doc_ref = await this.getDB().collection(this.tbl).doc(id);
				const snapshot = await doc_ref.get();
				if (!snapshot.exists) {
					return null;
				}

				const data = snapshot.data();
				const {created_at} = data;
				if (created_at && created_at.toDate) {
					data.created_at = created_at.toDate();
				}

				const auditData = {id: snapshot.id, data};

				const updated = await doc_ref.set({removed: false, notifications_removed: false}, {merge: true});//Promise < void >

				this.editAudit(loggedUser, new Date().getTime(), auditData);
				return true;
			});
		}

		// </editor-fold>

		// <editor-fold defaultstate="collapsed" desc="export_excel">
		async export_excel(evt,{
			client: _client, project: _project, site: _site,
				department: _department, job_position: _job_position, supervisor: _supervisor,
				list,
		}) {
			return Events.whenLoggedIn(async loggedUser => {
				if (isArray(list)) {
					const rows = list.map((
						{
							id,
							data: {
								created_at,
								company, client, project, site,

								profile_pic,
								fname,
								lname,
								id_num,
								passport_num,
								dob,
								sex,
								phone,
								email,

								job_position,
								department,
								supervisor,

								employee_num,
								employment_date,

								removed,
							}
						},
						idx
					) => {
						
						client = client || company;
						
						return {
							idx: idx + 1,

							project: project && project.name,
							site: site && site.name,
							
							job_position: job_position && job_position.name,
							department: department && department.name,
							supervisor: supervisor && supervisor.full_name,

							id,
							fname,
							lname,
							id_or_passport: id_num || passport_num,
							dob: Dates.formatDateSQL(dob),
							sex,
							phone,
							email,

							employee_num,
							employment_date: Dates.formatDateSQL(employment_date),

							status: removed ? "Inactive" : "Active",
						};
					});

					const response = await fetch(
						`${self.locationRoot}/templates/xlsx/employees/Template-List-Employee.xlsx`.replace('//', '/')
					);
					const arrayBuffer = await response.arrayBuffer();
					const data = new Map();
					
					data.set('date', new Date().formatDate());
					
					data.set('company', _client ? _client.name || _client.data.name : "ANY");
					data.set('project', _project ? _project.name || _project.data.name : "ANY");
					data.set('site', _site ? _site.name || _site.data.name : "ANY");
					
					data.set('department', _department ? _department.name || _department.data.name : "ANY");
					data.set('job_position', _job_position ? _job_position.name || _job_position.data.name : "ANY");
					data.set('supervisor', _supervisor ? _supervisor.full_name || _supervisor.data.full_name : "ANY");

					data.set("rows", rows);
					return await Events.emit("excelTemplate", {arrayBuffer, data});
					// return await this.export_excel_impl(loggedUser, "Training-Toolbox-Talks-Docs", "Attendance-Register", "Attendance-Register List", cols, rows);
				}
				return list;
			});
		}

		//
//         async export_excel(evt, list) {
//             return Events.whenLoggedIn(async loggedUser => {
//                 const cols = [
//                     {header: 'Company', key: 'Company', width: 30},
//                     {header: 'Project', key: 'Project', width: 30},
//                     {header: 'Site', key: 'Site', width: 30},
//
//                     {header: 'First Name', key: 'First Name', width: 25},
//                     {header: 'Last Name', key: 'Last Name', width: 25},
//                     {header: 'Identity No.', key: 'Identity No.', width: 25},
//                     {header: 'Passport No.', key: 'Passport No.', width: 20},
//                     {header: 'Gender', key: 'Gender', width: 15},
//                     {header: 'Date Of Birth', key: 'Date Of Birth', width: 15},
//                     {header: 'Phone No.', key: 'Phone No.', width: 15},
//                     {header: 'Email Address', key: 'Email Address', width: 25},
//
//                     {header: 'Date of Employment', key: 'Date of Employment', width: 20},
//                     {header: 'Company/Employee No.', key: 'Company/Employee No.', width: 25},
//                     {header: 'Department', key: 'Department', width: 30},
//                     {header: 'Job Position', key: 'Job Position', width: 30},
//                     {header: 'Job Category', key: 'Job Category', width: 30},
//
//                     {header: 'Supervisor Name', key: 'Supervisor Name', width: 25},
//                     {header: 'Supervisor Phone No.', key: 'Supervisor Phone No.', width: 22},
//                     {header: 'Supervisor Email Address', key: 'Supervisor Email Address', width: 25},
//
//                     {header: 'Street Address', key: 'Street Address', width: 35},
//                     {header: 'Local Area', key: 'Local Area', width: 35},
//                     {header: 'City', key: 'City', width: 35},
//                     {header: 'Province', key: 'Province', width: 20},
//                     {header: 'Address (PDF/Image)', key: 'Address (PDF/Image)', width: 35},
//
//                     {header: 'Bank Name', key: 'Bank Name', width: 20},
//                     {header: 'Branch', key: 'Branch', width: 25},
//                     {header: 'Branch Code', key: 'Branch Code', width: 25},
//                     {header: 'Account No.', key: 'Account No.', width: 30},
//                     {header: 'Banking Details (PDF/Image)', key: 'Banking Details (PDF/Image)', width: 35},
//
//                     {header: 'ID/Passport Copy (PDF/Image)', key: 'ID/Passport Copy (PDF/Image)', width: 35},
//                     {header: 'ID/Passport Expiry Date', key: 'ID/Passport Expiry Date', width: 20},
//                     {
//                         header: 'Driver/Operator License Copy (PDF/Image)',
//                         key: 'Driver/Operator License Copy (PDF/Image)',
//                         width: 40
//                     },
//                     {
//                         header: 'Driver/Operator License Expiry Date',
//                         key: 'Driver/Operator License Expiry Date',
//                         width: 45
//                     },
//                     {header: 'PDrP Copy (PDF/Image)', key: 'PDrP Copy (PDF/Image)', width: 35},
//                     {header: 'PDrP Expiry Date', key: 'PDrP Expiry Date', width: 20},
//                     {header: 'Work Permit Copy (PDF/Image)', key: 'Work Permit Copy (PDF/Image)', width: 35},
//                     {header: 'Work Permit Expiry Date', key: 'Work Permit Expiry Date', width: 20},
//
//                     {header: 'Next Of Kin #1', key: 'Next Of Kin #1', width: 40},
//                     {header: 'Next Of Kin #2', key: 'Next Of Kin #2', width: 40},
//                     {header: 'Dependants', key: 'Dependants', width: 20},
//
//                     //
//                     {header: 'Contract Expiry Date', key: 'Contract Expiry Date', width: 20},
//                     {header: 'Contract End Of Trial Period', key: 'Contract End Of Trial Period', width: 25},
//                     {header: 'Contract Start Date', key: 'Contract Start Date', width: 25},
//                     {header: 'Contract Type', key: 'Contract Type', width: 25},
//                     {
//                         header: 'Contract Working Schedule Start Time',
//                         key: 'Contract Working Schedule Start Time',
//                         width: 25
//                     },
//                     {
//                         header: 'Contract Working Schedule End Time',
//                         key: 'Contract Working Schedule End Time',
//                         width: 25
//                     },
//                     {
//                         header: 'Contract Working Schedule Daily Working Hours',
//                         key: 'Contract Working Schedule Daily Working Hours',
//                         width: 25
//                     },
//                     {header: 'Contract Notes', key: 'Contract Notes', width: 25},
//                     {header: 'Contract Salary Payment Type', key: 'Contract Salary Payment Type', width: 25},
//                     {header: 'Contract Salary Interval', key: 'Contract Salary Interval', width: 25},
//                     {header: 'Contract Salary', key: 'Contract Salary', width: 25},
//                     {header: 'Contract Wage', key: 'Contract Wage', width: 25},
//                     //
//                     {
//                         header: 'Competency Certificate Expiry Date',
//                         key: 'Competency Certificate Expiry Date',
//                         width: 25
//                     },
//                     {header: 'Competency Certificate Type', key: 'Competency Certificate Type', width: 25},
//                     //
//                     {
//                         header: 'Medical Fitness Certificate Expiry Date',
//                         key: 'Medical Fitness Certificate Expiry Date',
//                         width: 25
//                     },
//                     {
//                         header: 'Medical Fitness Certificate Annexture 3?',
//                         key: 'Medical Fitness Certificate Annexture 3?',
//                         width: 25
//                     },
//                     {
//                         header: 'Medical Fitness Certificate Restrictions',
//                         key: 'Medical Fitness Certificate Restrictions',
//                         width: 25
//                     },
//                     //
//                     {header: 'Warning Expiry Date', key: 'Warning Expiry Date', width: 20},
//                     {header: 'Warning Date', key: 'Warning Date', width: 20},
//                     {header: 'Warning Issued By', key: 'Warning Issued By', width: 20},
//                     {header: 'Warning Type', key: 'Warning Type', width: 20},
//                     {header: 'Warning Details Of Misconduct', key: 'Warning Details Of Misconduct', width: 20},
//                     {header: "Warning Employee's Comments", key: "Warning Employee's Comments", width: 20},
//                     {header: 'Warning Notes', key: 'Warning Notes', width: 20},
//                     //
//                     {header: 'Sick Leave Due To', key: 'Sick Leave Due To', width: 20},
//                     {header: 'Sick Leave Type', key: 'Sick Leave Type', width: 20},
//                     {header: 'Sick Leave Start Date', key: 'Sick Leave Start Date', width: 20},
//                     {header: 'Sick Leave Expiry Date', key: 'Sick Leave Expiry Date', width: 20},
//                     {header: 'No. Of Days Booked', key: 'No. Of Days Booked', width: 20},
//                     {header: "Reason Of Sick Leave", key: "Reason Of Sick Leave", width: 20},
//                     {header: "Employee's Comments", key: "Employee's Comments", width: 20},
//                     {header: 'Notes', key: 'Notes', width: 20},
//                     {header: 'Proof Of Sick Note', key: 'Proof Of Sick Note', width: 20},
//
//                     {header: 'Trainings', key: 'Trainings', width: 20},
//                     {header: 'PPE Issue', key: 'PPE Issue', width: 20},
//                     {header: 'Compliance', key: 'Compliance', width: 20},
//                 ];
//
// //                console.log('employeeList', list)
//
//                 const rows = await Promise.all(list.map(async employee => {
//                     const {
//                         id, data: {
//                             created_at,
//                             profile_pic,
//                             fname, lname, id_num, passport_num, dob, sex,
//                             client, project, site, phone, email,
//                             //
//                             optional_info,
//                             documents,
//                             next_of_kin_1, next_of_kin_2, dependants,
//                             //
//                             employee_contract_list = {},
//                             employee_competency_list = {},
//                             employee_medical_list = {},
//                             employee_warning_list = {},
//                             employee_leave_list = {},
//                             //
//                             training_certificate_list = []
//                         }
//                     } = employee;
//
//                     const res = {
//                         Company: isString(client) ? client : (client ? (client.name || client.data.name) : ""),
//                         Project: isString(project) ? project : (project ? (project.name || project.data.name) : ""),
//                         Site: isString(site) ? site : (site ? (site.name || site.data.name) : ""),
//
//                         "Last Name": lname,
//                         "First Name": fname,
//                         "Identity No.": id_num ? String(id_num) : "",
//                         "Passport No.": passport_num || "",
//                         Gender: sex || sex,
//                         "Date Of Birth": Dates.formatDate(dob) || "",
//                         "Phone No.": phone ? String(phone) : "",
//                         "Email Address": email || ""
//                     };
//
//                     if (optional_info) {
//                         const {
//                             employment_date,
//                             employee_num,
//                             department,
//                             job_position,
//                             supervisor_name,
//                             supervisor_phone,
//                             supervisor_email,
//                             living_addr_street,
//                             living_addr_local_area,
//                             living_addr_city,
//                             living_addr_province,
//                             living_addr_doc,
//                             banking_name,
//                             banking_branch,
//                             banking_branch_code,
//                             banking_account_num,
//                             banking_doc
//                         } = optional_info;
//                         if (employment_date) {
//                             res["Date of Employment"] = Dates.formatDate(employment_date) || "";
//                         }
//                         res["Company/Employee No."] = employee_num;
//                         if (department) {
//                             const {name, data: _data} = department;
//                             res["Department"] = name || (_data ? _data.name : 'N/A');
//                         }
//                         if (job_position) {
//                             const {name, category, data: _data} = job_position;
//                             res["Job Position"] = name || (_data ? _data.name : 'N/A');
//                             res["Job Category"] = category || (_data ? _data.category : 'N/A');
//                         }
//
//                         if (supervisor_name) {
//                             if (isString(supervisor_name)) {
//                                 res["Supervisor Name"] = supervisor_name;
//                             } else {
//                                 let {lname, fname, data: _data} = supervisor_name;
//                                 if (_data) {
//                                     lname = _data.lname;
//                                     fname = _data.fname;
//                                 }
//                                 res["Supervisor Name"] = lname + " " + fname;
//                             }
//                         }
//                         res["Supervisor Phone No."] = supervisor_phone;
//                         res["Supervisor Email Address"] = supervisor_email;
//
//                         res["Street Address"] = living_addr_street;
//                         res["Local Area"] = living_addr_local_area;
//                         res["City"] = living_addr_city;
//                         res["Province"] = living_addr_province;
// //                        if (living_addr_doc) {
// //                            const {dlUrls} = living_addr_doc;
// //                            const key = "Address (PDF/Image)";
// //                            res[key] = {
// //                                addImage: () => {
// //                                    return {file: dlUrls[0], col: key};
// //                                }
// //                            };
// //                        }
//
//                         res["Bank Name"] = banking_name;
//                         res["Branch"] = banking_branch;
//                         res["Branch Code"] = banking_branch_code;
//                         res["Account No."] = banking_account_num;
// //                        if (banking_doc) {
// //                            const {dlUrls} = banking_doc;
// //                            const key = "Banking Details (PDF/Image)";
// //                            res[key] = {
// //                                addImage: () => {
// //                                    return {file: dlUrls[0], col: key};
// //                                }
// //                            };
// //                        }
//                     }
//
//                     if (documents) {
//                         const {
//                             doc_id_or_passport, doc_id_or_passport_expiry,
//                             doc_driver_or_operator_licence, doc_driver_or_operator_licence_expiry,
//                             doc_pdrp, doc_pdrp_expiry,
//                             doc_work_permit, doc_work_permit_expiry
//                         } = documents;
// //                        if (doc_id_or_passport) {
// //                            const {dlUrls} = doc_id_or_passport;
// //                            const key = "ID/Passport Copy (PDF/Image)";
// //                            res[key] = {
// //                                addImage: () => {
// //                                    return {file: dlUrls[0], col: key};
// //                                }
// //                            };
// //                        }
//                         if (doc_id_or_passport_expiry) {
//                             res["ID/Passport Expiry Date"] = Dates.formatDate(doc_id_or_passport_expiry) || "";
//                         }
//
// //                        if (doc_driver_or_operator_licence) {
// //                            const {dlUrls} = doc_driver_or_operator_licence;
// //                            const key = "Driver/Operator License Copy (PDF/Image)";
// //                            res[key] = {
// //                                addImage: () => {
// //                                    return {file: dlUrls[0], col: key};
// //                                }
// //                            };
// //                        }
//                         if (doc_driver_or_operator_licence_expiry) {
//                             res["Driver/Operator License Expiry Date"] = Dates.formatDate(doc_driver_or_operator_licence_expiry) || "";
//                         }
//
// //                        if (doc_pdrp) {
// //                            const {dlUrls} = doc_pdrp;
// //                            const key = "PDrP Copy (PDF/Image)";
// //                            res[key] = {
// //                                addImage: () => {
// //                                    return {file: dlUrls[0], col: key};
// //                                }
// //                            };
// //                        }
//                         if (doc_pdrp_expiry) {
//                             res["PDrP Expiry Date"] = Dates.formatDate(doc_pdrp_expiry) || "";
//                         }
//
// //                        if (doc_work_permit) {
// //                            const {dlUrls} = doc_work_permit;
// //                            const key = "Work Permit Copy (PDF/Image)";
// //                            res[key] = {
// //                                addImage: () => {
// //                                    return {file: dlUrls[0], col: key};
// //                                }
// //                            };
// //                        }
//                         if (doc_work_permit_expiry) {
//                             res["Work Permit Expiry Date"] = Dates.formatDate(doc_work_permit_expiry) || "";
//                         }
//                     }
//
//                     if (next_of_kin_1) {
//                         const {lname, fname, phone1, phone2, relationship} = next_of_kin_1;
//                         res["Next Of Kin #1"] = lname + " " + fname + " (" + relationship + ")";
//                     }
//                     if (next_of_kin_2) {
//                         const {lname, fname, phone1, phone2, relationship} = next_of_kin_2;
//                         res["Next Of Kin #2"] = lname + " " + fname + " (" + relationship + ")";
//                     }
//                     if (dependants) {
//
//                     }
//
//                     {
// //                        const employee_contracts_path = await Events.get('plugin_sheq_assist/employees/contracts/').then(tbl => {
// //                            return tbl.export_excel_by_employee.call(tbl, null, employee);
// //                        });
// //                        res["Contracts"] = employee_contracts_path;
//                         let list = Object.keys(employee_contract_list).map(id => {
//                             return {id, expiry_date: employee_contract_list[id].expiry_date || null};
//                         });
//                         list.sortBy('expiry_date', 'desc');
//                         list = list.map(({id, expiry_date}) => {
//                             return {id, data: employee_contract_list[id]};
//                         });
//
//                         const item = list[0];
//                         if (item) {
//                             const {
//                                 data: {
//                                     created_at,
//                                     salary_info = {},
//                                     contract_details = {},
//                                     doc,
//                                     job_profile_doc
//                                 }
//                             } = item;
//                             let {
//                                 contract_type,
//                                 start_date,
//                                 expiry_date,
//                                 end_of_trial_period,
//                                 start_time,
//                                 end_time,
//                                 daily_working_hours,
//                                 notes
//                             } = contract_details;
//                             let {payment_type, salary_interval, salary = "N/A", wage, deductible = {}} = salary_info;
//                             if (salary !== "N/A") {
//                                 salary = salary.toCurrency('R');
//                             }
//                             res["Contract Expiry Date"] = Dates.formatDate(expiry_date) || "";
//                             res["Contract End Of Trial Period"] = Dates.formatDate(end_of_trial_period) || "";
//                             res["Contract Start Date"] = Dates.formatDate(start_date) || "";
//                             res["Contract Type"] = contract_type;
//                             res["Contract Working Schedule Start Time"] = start_time;
//                             res["Contract Working Schedule End Time"] = end_time;
//                             res["Contract Working Schedule Daily Working Hours"] = daily_working_hours;
//                             res["Contract Notes"] = notes;
//
//                             res["Contract Salary Payment Type"] = payment_type;
//                             if (payment_type === "Salary") {
//                                 res["Contract Salary Interval"] = salary_interval;
//                                 res["Contract Salary"] = salary;
//                             }
//                             if (payment_type === "Wage") {
//                                 res["Contract Wage"] = wage;
//                             }
//                         }
//                     }
//
//                     {
// //                        const employee_competencies_path = Events.get('plugin_sheq_assist/employees/competencies/').then(tbl => {
// //                            return tbl.export_excel_by_employee.call(tbl, null, employee);
// //                        });
// //                        res["Competency Certificates"] = employee_competencies_path;
//
//                         let list = Object.keys(employee_competency_list).map(id => {
//                             return {id, expiry_date: employee_competency_list[id].expiry_date || null};
//                         });
//                         list.sortBy('expiry_date', 'desc');
//                         list = list.map(({id, expiry_date}) => {
//                             return {id, data: employee_competency_list[id]};
//                         });
//
//                         const item = list[0];
//                         if (item) {
//                             const {data: {competency_type, expiry_date, doc}} = item;
//                             res["Competency Certificate Expiry Date"] = Dates.formatDate(expiry_date) || "";
//                             res["Competency Certificate Type"] = competency_type;
//                         }
//                     }
//
//                     {
// //                        const employee_medicals_path = await Events.get('plugin_sheq_assist/employees/medicals/').then(tbl => {
// //                            return tbl.export_excel_by_employee.call(tbl, null, employee);
// //                        });
// //                        res["Medicals Fitness Certificates"] = employee_medicals_path;
//
//                         let list = Object.keys(employee_medical_list).map(id => {
//                             return {id, expiry_date: employee_medical_list[id].expiry_date || null};
//                         });
//                         list.sortBy('expiry_date', 'desc');
//                         list = list.map(({id, expiry_date}) => {
//                             return {id, data: employee_medical_list[id]};
//                         });
//
//                         const item = list[0];
//
//                         if (item) {
//                             const {data: {annexture_3, restrictions, expiry_date, doc}} = item;
//                             res["Medical Fitness Certificate Expiry Date"] = Dates.formatDate(expiry_date) || "";
//                             res["Medical Fitness Certificate Annexture 3?"] = annexture_3;
//                             res["Medical Fitness Certificate Restrictions"] = restrictions;
//                         }
//                     }
//
//                     {
// //                        const employee_warnings_path = await Events.get('plugin_sheq_assist/employees/warnings/').then(tbl => {
// //                            return tbl.export_excel_by_employee.call(tbl, null, employee);
// //                        });
// //                        res["Warnings"] = employee_warnings_path;
//
//                         let list = Object.keys(employee_warning_list).map(id => {
//                             return {id, expiry_date: employee_warning_list[id].expiry_date || null};
//                         });
//                         list.sortBy('expiry_date', 'desc');
//                         list = list.map(({id, expiry_date}) => {
//                             return {id, data: employee_warning_list[id]};
//                         });
//
//                         const item = list[0];
//                         if (item) {
//                             const {
//                                 data: {
//                                     issued_by,
//                                     type,
//                                     date,
//                                     expiry_date,
//                                     details,
//                                     employee_comments,
//                                     notes,
//                                     doc
//                                 }
//                             } = item;
//                             res["Warning Expiry Date"] = Dates.formatDate(expiry_date) || "";
//                             res["Warning Date"] = Dates.formatDate(date) || "";
//                             res["Warning Issued By"] = issued_by ? (issued_by.lname + ' ' + issued_by.fname) : "";
//                             res["Warning Type"] = type;
//                             res["Warning Details Of Misconduct"] = details;
//                             res["Warning Employee's Comments"] = employee_comments;
//                             res["Warning Notes"] = notes;
//                         }
//                     }
//
//                     {
// //                        const employee_leaves_path = await Events.get('plugin_sheq_assist/employees/leaves/').then(tbl => {
// //                            return tbl.export_excel_by_employee.call(tbl, null, employee);
// //                        });
// //                        res["Leaves"] = employee_leaves_path;
//
//                         let list = Object.keys(employee_leave_list).map(id => {
//                             return {id, expiry_date: employee_leave_list[id].expiry_date || null};
//                         });
//                         list.sortBy('expiry_date', 'desc');
//                         list = list.map(({id, expiry_date}) => {
//                             return {id, data: employee_leave_list[id]};
//                         });
//
//                         const item = list[0];
//                         if (item) {
//                             const {
//                                 data: {
//                                     doc,
//                                     employee,
//                                     type,
//                                     due_to,
//                                     date,
//                                     expiry_date,
//                                     days_booked,
//                                     reason,
//                                     employee_comments,
//                                     notes
//                                 }
//                             } = item;
//                             res["Sick Leave Due To"] = due_to || "";
//                             res["Sick Leave Type"] = type;
//                             res["Sick Leave Start Date"] = Dates.formatDate(date) || "";
//                             res["Sick Leave Expiry Date"] = Dates.formatDate(expiry_date) || "";
//                             res["Sick Leave No. Of Days Booked"] = days_booked;
//                             res["Sick Leave Reason"] = reason;
//                             res["Sick Leave Employee's Comments"] = employee_comments;
//                             res["Sick Leave Notes"] = notes;
//                         }
//                     }
//
//                     return res;
//                 }));
//
//                 return await this.export_excel_impl(loggedUser, "Employee-Docs", "Employees-Active", "Employees Data", cols, rows);
//             });
//         }

		// </editor-fold>

	}

	self.employeesCntr = new Controller(events);
})();
