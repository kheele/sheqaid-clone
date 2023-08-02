import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import findByFirestoreIdSite from "../../mutations/all/Site/findByFirestoreIdSite";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";
import findByFirestoreIdEmployee from "../../mutations/all/Employee/findByFirestoreIdEmployee";
import StateLists
	from "../../views/plugins/plugin_sheq_assist/17_Incident_Investigation/dialogs/IncidentForms/StateLists";
import findByNameSector from "../../mutations/all/Sector/findByNameSector";
import insertIncidentActivity from "../../mutations/all/IncidentActivity/insertIncidentActivity";
import findByNameIncidentCategory from "../../mutations/all/IncidentCategory/findByNameIncidentCategory";
import insertIncidentSubCategory from "../../mutations/all/IncidentSubCategory/insertIncidentSubCategory";
import insertIncident from "../../mutations/all/Incident/insertIncident";
import findByNameIncidentSubCategory from "../../mutations/all/IncidentSubCategory/findByNameIncidentSubCategory";
import findByNameIncidentActivity from "../../mutations/all/IncidentActivity/findByNameIncidentActivity";
import findByFirestoreIdIncident from "../../mutations/all/Incident/findByFirestoreIdIncident";
import findByNameIncidentInjury from "../../mutations/all/IncidentInjury/findByNameIncidentInjury";
import findByFirestoreIdJobPosition from "../../mutations/all/JobPosition/findByFirestoreIdJobPosition";

const tbl = "plugin_sheq_assist_17_Incident_Investigation";
//<editor-fold desc="transfer">
export const incidents_transfer = async () => {
	await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

	// const {
	// 	sector_list, category_list,
	// 	activity_list, sub_category_list,
	// } = StateLists;
	//
	// const pg_sector_list = await Promise.all(sector_list.map(async ({value: name}) => {
	// 	const activity_list_by_sector = activity_list[name].map(({value}) => value);
	// 	const pg_sector = await findByNameSector(name === 'Food' ? 'Food and beverage' : name);
	// 	await Promise.all(activity_list_by_sector.map(async name => {
	// 		await insertIncidentActivity({name, sector_id: pg_sector.id})
	// 	}));
	// }));
	// const pg_category_list = await Promise.all(category_list.map(async ({value: name}) => {
	// 	const sub_category_list_by_sector = sub_category_list[name].map(({value}) => value);
	// 	const pg_category = await findByNameIncidentCategory(name);
	// 	await Promise.all(sub_category_list_by_sector.map(async name => {
	// 		await insertIncidentSubCategory({name, category_id: pg_category.id})
	// 	}));
	// }));
	//
	// return;

	const list = await workers.emit('relay/get_db', tbl);

	for (let n = 0; n < list.length; n++) {
		const {id, data} = list[n];
		let {
			company_id,
			user_id,
			contractor_user_id,
			contractor_id,
			contractor_site_id,
			//0
			client_id, project_id, site_id,
			client, project, site,
			//1
			created_at, status,
			classification,//{sec1_data:{},sec2_data:{},sec3_data:{},sec4_data:{},sec5_data:{investigation_team_list},}
			investigation,//{sec1_data:{},sec2_data:{},sec3_data:{},sec4_data:{}}
			sec1_data, sec2_data, sec3_data, sec4_data, sec5_data, sec6_data, sec7_data, sec8_data,
			sec9_data, sec10_data, sec11_data, sec12_data, sec13_data, sec14_data, sec15_data
		} = data;

		if(!status) status = [];

		const existingItem = await findByFirestoreIdIncident(id);
		if (existingItem) {

		} else {
			const pg_company = await findByFirestoreIdCompany(company_id);
			const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
			const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
			const pg_site = await findByFirestoreIdSite(site ? site.id : site_id);
			const pg_user = await findByFirestoreIdUser(user_id);

			const pg_contractor = await findByFirestoreIdContractor(contractor_id);
			const pg_contractor_site = await findByFirestoreIdSite(contractor_site_id);
			const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);

			const {group, short_desc, category_list, sector_list,} = sec1_data || {};
			const {sub_category_list, activity_list} = sec2_data || {};
			const {type} = sec3_data || {};//Fatality, Assault, Arson, Alcohol Testing, Vehicle, Vehicle Speeding, Nearmiss, Vandalism, Structure, Spillage, Other, Lost Time Injury, Medical Treatment Injury, First Aid Injury,
			const {secondary_type_list} = sec4_data || {};//
			const {person_involved_list} = sec5_data || {};
			const {person_reporting} = sec6_data || {};
			const {date_reported, time_reported, time_shift, person_reported_to,} = sec7_data || {};
			const {witness_list,} = sec8_data || {};
			const {location, exact_location, incident_date, incident_time,} = sec9_data || {};
			const {desc, document_list} = sec10_data || {};
			const {
				injury_desc,
				person_injured, injured_person_dob, injured_person_gender,//skip dob & gender
				nature_of_injury_list, bodily_injury_location_list, injury_mechanism_list,
			} = sec11_data || {};
			const {
				test_undertaken,
				test_type_list,//skip
				test_type_drug_undertaken,
				test_type_alcohol_undertaken,
				test_type_mobile_device_undertaken
			} = sec12_data || {};
			const {
				is_vehicle_incident,
				driver,
				driver_dob,
				driver_gender,
				address,
				email,
				phone,
				licence_num,
				licence_expiry,
				licence_years,
				//
				vehicle_make,
				vehicle_model,
				vehicle_year,
				vehicle_color,
				vehicle_reg_num,
				vehicle_fleet_num,
				vehicle_reg_date,
				vehicle_trip_type,
				vehicle_load_type,
				//
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
				//
				is_infringement_issued,
				penalty_num,
				issuing_authority,
				issuing_officer,
				type_of_breach,
				addressee_issued_to_name,
				addressee_name_or_entity,
				addressee_amount,
				addressee_due_date,
				//
				did_police_attend_scene,
				ref_or_report_num,
				officer_name,
				officer_station,
				collision_reported_to_police_station,
				have_charges_been_laid,
				nature_of_charges,
				who_laid_charges,
				who_were_nature_charges_laid_against,
			} = sec13_data || {};

			const {
				consequence, likelihood, risk_rating,
			} = sec14_data || {};

			const {
				distribution_list,
			} = sec15_data || {};

			const pg_person_reporting = await findByFirestoreIdEmployee(person_reporting && person_reporting.id);
			const pg_person_reported_to = await findByFirestoreIdEmployee(person_reported_to && person_reported_to.id);
			const pg_person_injured = await findByFirestoreIdEmployee(person_injured && person_injured.id);
			const pg_driver = await findByFirestoreIdEmployee(driver && driver.id);

			if (person_reporting && !person_reporting.id) {
				person_reporting.company_id = pg_company && pg_company.id;
				person_reporting.contractor_id = pg_contractor && pg_contractor.id;
				person_reporting.contractor_site_id = pg_contractor_site && pg_contractor_site.id;
				person_reporting.client_id = pg_client && pg_client.id;

				delete person_reporting.id;
				if (person_reporting.job_position) {
					const pg_job_position = await findByFirestoreIdJobPosition(person_reporting.job_position.id);
					if (pg_job_position) {
						person_reporting.job_position_id = pg_job_position.id;
					}
					delete person_reporting.job_position;
				}
			}
			if (person_reported_to && !person_reported_to.id) {
				person_reported_to.company_id = pg_company && pg_company.id;
				person_reported_to.contractor_id = pg_contractor && pg_contractor.id;
				person_reported_to.contractor_site_id = pg_contractor_site && pg_contractor_site.id;
				person_reported_to.client_id = pg_client && pg_client.id;

				delete person_reported_to.id;
				if (person_reported_to.job_position) {
					const pg_job_position = await findByFirestoreIdJobPosition(person_reported_to.job_position.id);
					if (pg_job_position) {
						person_reported_to.job_position_id = pg_job_position.id;
					}
					delete person_reported_to.job_position;
				}
			}
			if (person_injured && !person_injured.id) {
				person_injured.company_id = pg_company && pg_company.id;
				person_injured.contractor_id = pg_contractor && pg_contractor.id;
				person_injured.contractor_site_id = pg_contractor_site && pg_contractor_site.id;
				person_injured.client_id = pg_client && pg_client.id;

				delete person_injured.id;
				if (person_injured.job_position) {
					const pg_job_position = await findByFirestoreIdJobPosition(person_injured.job_position.id);
					if (pg_job_position) {
						person_injured.job_position_id = pg_job_position.id;
					}
					delete person_injured.job_position;
				}
			}
			if (driver && !driver.id) {
				driver.company_id = pg_company && pg_company.id;
				driver.contractor_id = pg_contractor && pg_contractor.id;
				driver.contractor_site_id = pg_contractor_site && pg_contractor_site.id;
				driver.client_id = pg_client && pg_client.id;

				delete driver.id;
				if (driver.job_position) {
					const pg_job_position = await findByFirestoreIdJobPosition(driver.job_position.id);
					if (pg_job_position) {
						driver.job_position_id = pg_job_position.id;
					}
					delete driver.job_position;
				}
			}

			//load from db
			const pg_activity_list = await Promise.all((activity_list || []).map(async (name) => {
				const pg_activity = await findByNameIncidentActivity(name);
				// console.log('pg_activity_list', pg_activity && pg_activity.id, name)
				return {
					activity_id: pg_activity.id,
				};
			}));

			//load from db
			const pg_category_list = (await Promise.all((category_list || []).map(async (name) => {
				const pg_category = await findByNameIncidentCategory(name);
				if (!pg_category) {
					console.log('pg_category_list', pg_category && pg_category.id, name)
					return;
				}
				return {
					category_id: pg_category.id,
				};
			}))).filter(v => !!v);

			//load from db
			const pg_sub_category_list = (await Promise.all((sub_category_list || []).map(async (name) => {
				const pg_sub_category = id && await findByNameIncidentSubCategory(name);
				if (!pg_sub_category) {
					console.log('pg_sub_category_list', pg_sub_category && pg_sub_category.id, name)
					return;
				}
				return {
					sub_category_id: pg_sub_category.id,
				};
			}))).filter(v => !!v);

			//load from db
			const pg_sector_list = await Promise.all((sector_list || []).map(async (name) => {
				const pg_sector = await findByNameSector(name);
				// console.log('pg_sector_list', pg_sector && pg_sector.id, name)
				return {
					sector_id: pg_sector.id,
				};
			}));

			//load from db
			const pg_injury_list = await Promise.all([
				...(nature_of_injury_list || []),
				...(bodily_injury_location_list || []),
				...(injury_mechanism_list || []),
			].map(async (name) => {
				const pg_injury = await findByNameIncidentInjury(name);
				// console.log('pg_injury_list', pg_injury && pg_injury.id, name)
				return {
					injury_id: pg_injury.id,
				};
			}));

			const pg_distribution_list = await Promise.all((distribution_list || []).map(async ({id, ...others}) => {
				const pg_person = id && await findByFirestoreIdEmployee(id);
				const person_other = !id && others;
				if (person_other) {
					person_other.company_id = pg_company && pg_company.id;
					person_other.contractor_id = pg_contractor && pg_contractor.id;
					person_other.contractor_site_id = pg_contractor_site && pg_contractor_site.id;
					person_other.client_id = pg_client && pg_client.id;

					delete person_other.id;
					if (person_other.job_position) {
						const pg_job_position = await findByFirestoreIdJobPosition(person_other.job_position.id);
						if (pg_job_position) {
							person_other.job_position_id = pg_job_position.id;
						}
						delete person_other.job_position;
					}
				}
				return {
					employee_id: pg_person && pg_person.id,
					other_person: person_other && {
						data: person_other
					} || null,
				};
			}));

			const pg_person_involved_list = await Promise.all((person_involved_list || []).map(async ({id, ...others}) => {
				const pg_person = id && await findByFirestoreIdEmployee(id);
				const person_other = !id && others;
				if (person_other) {
					person_other.company_id = pg_company && pg_company.id;
					person_other.contractor_id = pg_contractor && pg_contractor.id;
					person_other.contractor_site_id = pg_contractor_site && pg_contractor_site.id;
					person_other.client_id = pg_client && pg_client.id;

					delete person_other.id;
					if (person_other.job_position) {
						const pg_job_position = await findByFirestoreIdJobPosition(person_other.job_position.id);
						if (pg_job_position) {
							person_other.job_position_id = pg_job_position.id;
						}
						delete person_other.job_position;
					}
				}
				return {
					person_involved_id: pg_person && pg_person.id,
					person_involved_other: person_other && {
						data: person_other
					} || null,
				};
			}));

			const pg_witness_list = await Promise.all((witness_list || []).map(async ({id, ...others}) => {
				const pg_person = id && await findByFirestoreIdEmployee(id);
				const person_other = !id && others;
				if (person_other) {
					person_other.company_id = pg_company && pg_company.id;
					person_other.contractor_id = pg_contractor && pg_contractor.id;
					person_other.contractor_site_id = pg_contractor_site && pg_contractor_site.id;
					person_other.client_id = pg_client && pg_client.id;

					delete person_other.id;
					if (person_other.job_position) {
						const pg_job_position = await findByFirestoreIdJobPosition(person_other.job_position.id);
						if (pg_job_position) {
							person_other.job_position_id = pg_job_position.id;
						}
						delete person_other.job_position;
					}
				}
				return {
					witness_id: pg_person && pg_person.id,
					witness_other: person_other && {
						data: person_other
					} || null,
				};
			}));

			let pg_investigation;
			{
				let investigation_team_list = [];
				if (investigation && investigation.sec1_data && investigation.sec1_data.investigation_team_list) {
					investigation_team_list = investigation.sec1_data.investigation_team_list;
				} else if (classification && classification.sec5_data && classification.sec5_data.investigation_team_list) {
					investigation_team_list = classification.sec5_data.investigation_team_list;
				}

				const pg_investigation_team_list = await Promise.all((investigation_team_list || []).map(async (
					{
						id,
						...others
					}
				) => {
					const pg_person = id && await findByFirestoreIdEmployee(id);
					const person_other = !id && others;
					if (person_other) delete person_other.id;
					return {
						investigator_id: pg_person && pg_person.id,
						investigator_other: person_other && {
							data: person_other
						} || null,
					};
				}));

				let investigation_due_date;
				if (investigation && investigation.sec1_data && investigation.sec1_data.investigation_due_date) {
					investigation_due_date = investigation.sec1_data.investigation_due_date;
				} else if (classification && classification.sec5_data && classification.sec5_data.investigation_due_date) {
					investigation_due_date = classification.sec5_data.investigation_due_date;
				}

				const document_list = investigation && investigation.sec2_data && investigation.sec2_data.document_list;

				if (
					investigation_due_date ||
					(pg_investigation_team_list && pg_investigation_team_list.isNotEmpty()) ||
					(document_list && document_list.isNotEmpty())
				) {
					pg_investigation = {
						due_date: Dates.formatDateSQL(investigation_due_date),
						investigation_team_list: {
							data: pg_investigation_team_list,
						},
						document_list: {
							data: (document_list || []).map(doc => ({doc})),
						},
					};
				}
			}

			let vehicle;
			if (Object.values(sec13_data || {}).isNotEmpty()) {
				vehicle = {
					driver_id: pg_driver && pg_driver.id,
					driver_dob: Dates.formatDateSQL(driver_dob),
					driver_gender,
					address,
					email,
					phone,
					licence_num,
					licence_expiry: Dates.formatDateSQL(licence_expiry),
					licence_years,
					//
					vehicle_make,
					vehicle_model,
					vehicle_year,
					vehicle_color,
					vehicle_reg_num,
					vehicle_fleet_num,
					vehicle_reg_date: Dates.formatDateSQL(vehicle_reg_date),
					vehicle_trip_type,
					vehicle_load_type,
					//
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
					third_party_document_list: {
						data: [...(third_party_document_list || [])].map(doc => ({doc})),
					},
					//
					is_infringement_issued,
					penalty_num,
					issuing_authority,
					issuing_officer,
					type_of_breach,
					addressee_issued_to_name,
					addressee_name_or_entity,
					addressee_amount,
					addressee_due_date: Dates.formatDateSQL(addressee_due_date),
					//
					did_police_attend_scene,
					ref_or_report_num,
					officer_name,
					officer_station,
					collision_reported_to_police_station,
					have_charges_been_laid,
					nature_of_charges,
					who_laid_charges,
					who_were_nature_charges_laid_against,
				};
			}

			const item = {
				firestore_id: id,
				company_id: pg_company && pg_company.id,
				user_id: pg_user && pg_user.id,
				contractor_id: pg_contractor && pg_contractor.id,
				contractor_site_id: pg_contractor_site && pg_contractor_site.id,
				contractor_user_id: pg_contractor_user && pg_contractor_user.id,
				//0
				client_id: pg_client && pg_client.id,
				project_id: pg_project && pg_project.id,
				site_id: pg_site && pg_site.id,
				//1
				group,
				short_desc,
				desc,
				location,
				exact_location,
				incident_date: Dates.formatDateSQL(incident_date),
				incident_time,
				date_reported: Dates.formatDateSQL(date_reported),
				time_reported,
				time_shift,
				injury_desc,
				//
				status_closed: status.contains('ClosedIncident'),
				status_approved: status.contains('ApprovedIncident'),
				status_approved_investigation: status.contains('ApprovedInvestigation'),
				status_awaiting_approval: !status.contains('ClosedIncident'),
				status_awaiting_investigation_approval: !status.contains('ClosedIncident') && status.contains('ApprovedIncident') && !!investigation && !status.contains('ApprovedInvestigation'),
				status_investigating: !status.contains('ClosedIncident') && status.contains('ApprovedIncident') && !!investigation,
				//
				severity: {
					data: {
						consequence, likelihood
					}
				},
				person_reporting_id: pg_person_reporting && pg_person_reporting.id,
				person_reporting_other: person_reporting && !person_reporting.id ? {
					data: person_reporting
				} : null,
				person_reported_to_id: pg_person_reported_to && pg_person_reported_to.id,
				person_reported_to_other: person_reported_to && !person_reported_to.id ? {
					data: person_reported_to
				} : null,
				person_injured_id: pg_person_injured && pg_person_injured.id,
				person_injured_other: person_injured && !person_injured.id ? {
					data: person_injured
				} : null,
				test_type_drug_undertaken,
				test_type_alcohol_undertaken,
				test_type_mobile_device_undertaken,
				is_vehicle_incident: is_vehicle_incident === 'Yes',
				test_undertaken: test_undertaken === 'Yes',
				//
				investigation: pg_investigation ? {
					data: pg_investigation
				} : null,
				activity_list: {
					data: pg_activity_list
				},
				category_list: {
					data: pg_category_list
				},
				distribution_list: {
					data: pg_distribution_list
				},
				document_list: {
					data: (document_list || []).filter(doc => !isString(doc)).map(doc => ({doc}))//TODO: fix local files
				},
				injury_list: {
					data: pg_injury_list
				},
				person_involved_list: {
					data: pg_person_involved_list
				},
				sector_list: {
					data: pg_sector_list
				},
				sub_category_list: {
					data: pg_sub_category_list
				},
				// test_type_list: {skip
				// 	data: [({name})]
				// },
				vehicle_list: vehicle && is_vehicle_incident === 'Yes' ? {
					data: [vehicle],
				} : null,
				witness_list: {
					data: pg_witness_list
				},
			};//

			console.log('insertIncident start', item)
			//save
			try {
				const res = await insertIncident(item);
				console.log('insertIncident end', res)
			} catch (e) {
				console.log(short_desc, e);
			}
		}
	}

	console.log('insertIncident complete', list.length);
};
//</editor-fold>
