import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import findByFirestoreIdSite from "../../mutations/all/Site/findByFirestoreIdSite";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";
import findByFirestoreIdEmployee from "../../mutations/all/Employee/findByFirestoreIdEmployee";
import findByFirestoreIdSOP from "../../mutations/all/HIRA_And_Opportunities/SOP/findByFirestoreIdSOP";
import insertBaselineRA from "../../mutations/all/HIRA_And_Opportunities/BaselineRA/insertBaselineRA";
import findByFirestoreIdBaselineRA
	from "../../mutations/all/HIRA_And_Opportunities/BaselineRA/findByFirestoreIdBaselineRA";

const tbl = "plugin_sheq_assist_09_risk_assessment_baseline";
//<editor-fold desc="transfer">
export const hira_baseline_ra_transfer = async () => {
	await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

	const list = await workers.emit('relay/get_db', tbl);

	for (let n = 0; n < list.length; n++) {
		const {id, data} = list[n];
		const {
			company_id,
			user_id,
			contractor_user_id,
			contractor_id,
			contractor_site_id,
			//
			created_at,
			//0
			client_id,
			project_id,
			site_id,
			client,
			project,
			site,
			//1
			activity,
			expiry_date,
			risk_tolerance,
			//2
			list: _list,
		} = data;

		const existingItem = await findByFirestoreIdBaselineRA(id);
		if (existingItem) {
		} else {
			if (company_id) {
				const pg_company = await findByFirestoreIdCompany(company_id);
				const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
				const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
				const pg_site = await findByFirestoreIdSite(site ? site.id : site_id);
				const pg_user = await findByFirestoreIdUser(user_id);

				const pg_contractor = await findByFirestoreIdContractor(contractor_id);
				const pg_contractor_site = await findByFirestoreIdSite(contractor_site_id);
				const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);

				const item = {
					firestore_id: id,
					company_id: pg_company && pg_company.id,
					user_id: pg_user && pg_user.id,
					contractor_id: pg_contractor && pg_contractor.id,
					contractor_site_id: pg_contractor_site && pg_contractor_site.id,
					contractor_user_id: pg_contractor_user && pg_contractor_user.id,
					//
					created_at: Dates.formatDateSQL(created_at),
					//0
					client_id: pg_client && pg_client.id,
					project_id: pg_project && pg_project.id,
					site_id: pg_site && pg_site.id,
					//1
					activity,
					expiry_date: Dates.formatDateSQL(expiry_date),
					risk_tolerance,
					//2
					list: {
						data: await Promise.all(_list.map(async val => {
							const {
								task_step,
								hazard,
								risk,
								risk_type,
								control_measure_list_additional,
								control_measure_list,
								responsible_person,
								target_date,
								due_date,
							} = val;

							delete val.risk_rank_1;
							delete val.risk_rank_2;
							delete val.risk_rank_3;

							delete val.risk_rating_1;
							delete val.risk_rating_2;
							delete val.risk_rating_3;

							if(responsible_person) {
								const pg_responsible_person = await findByFirestoreIdEmployee(responsible_person.id);
								val.responsible_person_id = pg_responsible_person && pg_responsible_person.id;
								delete val.responsible_person;
							}

							if(target_date) {
								val.target_date = Dates.formatDateSQL(target_date);
							}

							if(due_date) {
								val.due_date = Dates.formatDateSQL(due_date);
							}

							if(task_step) {
								val.task_step = task_step.trim();
							}
							if(hazard) {
								val.hazard = hazard.trim();
							}
							if(risk) {
								val.risk = risk.trim();
							}
							if(risk_type) {
								val.risk_type = risk_type.map((text) => text.trim());
							}
							if(control_measure_list) {
								val.control_measure_list = control_measure_list.map(({text}) => text.trim());
							}
							if (control_measure_list_additional) {
								return {
									...val,
									control_measure_list_additional: {
										data: await Promise.all(control_measure_list_additional.map(async val => {
											const {text, responsible_person, cost, date_completed} = val;
											delete val.responsible_person;

											const pg_responsible_person = await findByFirestoreIdEmployee(responsible_person && responsible_person.id);

											return {
												...val,
												date_completed: Dates.formatDateSQL(date_completed),
												responsible_person_id: pg_responsible_person && pg_responsible_person.id,
											};
										})),
									},
								};
							}
							return val;
						})),
					},
				};//

				console.log('insertBaselineRA start', item)
				//save
				try {
					const res = await insertBaselineRA(item);
					console.log('insertBaselineRA end', res)
				} catch (e) {
					console.error(id, e);
				}
			} else {
				console.log(name, "NO_COMPANY_ID");
			}
		}
	}
};
//</editor-fold>
