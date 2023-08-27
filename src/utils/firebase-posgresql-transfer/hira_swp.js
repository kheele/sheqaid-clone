import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import findByFirestoreIdSite from "../../mutations/all/Site/findByFirestoreIdSite";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";
import findByFirestoreIdEmployee from "../../mutations/all/Employee/findByFirestoreIdEmployee";
import insertSWP from "../../mutations/all/HIRA_And_Opportunities/SWP/insertSWP";
import findByFirestoreIdDepartment from "../../mutations/all/Department/findByFirestoreIdDepartment";
import findByFirestoreIdSWP from "../../mutations/all/HIRA_And_Opportunities/SWP/findByFirestoreIdSWP";

const tbl = "plugin_sheq_assist_09_HIRA_And_Opportunities_swp";
//<editor-fold desc="transfer">
export const hira_sop_transfer = async () => {
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
			category,
			date_created,
			department,
			location,
			notes,
			person_approving_procedure,
			photo,
			potential_hazard_and_possible_cause_list,//[{cause, hazard, rating}]
			ppe_required_list,//[{text}]
			sign_sheet_name_list,//[{employee}]
			sign_sheet_notes,
			steps_to_perform_task_list,//[{text}]
			to_be_reviewed_before,
			training_requirement_list,//[{text}]
			work_task,
		} = data;

		const existingItem = await findByFirestoreIdSWP(id);
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

				const pg_department = await findByFirestoreIdDepartment(department && department.id);
				const pg_person_approving_procedure = await findByFirestoreIdEmployee(person_approving_procedure && person_approving_procedure.id);

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
					category,
					work_task,
					date_created: Dates.formatDateSQL(date_created),
					location,
					department_id: pg_department && pg_department.id,
					person_approving_procedure_id: pg_person_approving_procedure && pg_person_approving_procedure.id,
					expiry: Dates.formatDateSQL(to_be_reviewed_before),
					sign_sheet_notes,
					//2
					doc: photo,
					//3
					potential_hazard_and_possible_cause_list: {
						data: (potential_hazard_and_possible_cause_list || []).map(({cause, hazard, rating}) => ({
							cause, hazard, rating,
						}))
					}, //{id, swp_id, cause, hazard, rating,}
					//4
					ppe_required_list: {data: (ppe_required_list || []).map(({text}) => ({ppe_id}))},//{id, swp_id, ppe,}
					//5
					steps_to_perform_task_list: steps_to_perform_task_list && steps_to_perform_task_list.map(({text}) => text),
					//6
					notes,
					//7
					training_requirement_list: training_requirement_list && training_requirement_list.map(({text}) => text),
					//8
					sign_sheet_employee_list: {
						data: await Promise.all((sign_sheet_name_list || []).map(async ({employee}) => {
							const pg_employee = await findByFirestoreIdEmployee(employee.id);
							return {employee_id: pg_employee.id};
						})),
					}, //{id, swp_id, signature, employee,}
				};//

				console.log('insertSWP start', item)
				//save
				try {
					// const res = await insertSWP(item);
					// console.log('insertSWP end', res)
				} catch (e) {
					console.log(id, e);
				}
			} else {
				console.log(name, "NO_COMPANY_ID");
			}
		}
	}
};
//</editor-fold>
