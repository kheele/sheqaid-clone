import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import findByFirestoreIdSite from "../../mutations/all/Site/findByFirestoreIdSite";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";
import findByFirestoreIdEmployee from "../../mutations/all/Employee/findByFirestoreIdEmployee";
import insertSOP from "../../mutations/all/HIRA_And_Opportunities/SOP/insertSOP";
import findByFirestoreIdSOP from "../../mutations/all/HIRA_And_Opportunities/SOP/findByFirestoreIdSOP";

const tbl = "plugin_sheq_assist_09_HIRA_And_Opportunities_sop";
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
			close_down_list,//[{text}]
			custom_safety_pre_requesite_list,//[{text}]
			date_created,
			date_revised,
			key_point_list,//[{text}]
			location,
			operation_list,//[{text}]
			other,
			photo,
			prepared_by,
			procedure_list,//[{text}]
			risk_level,
			risk_list,//[{text}]
			safety_pre_requesite_list,//[{checked, desc}]
		} = data;

		const existingItem = await findByFirestoreIdSOP(id);
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

				const pg_prepared_by = await findByFirestoreIdEmployee(prepared_by && prepared_by.id);

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
					risk_level,
					location,
					prepared_by_id: pg_prepared_by && pg_prepared_by.id,
					date_created: Dates.formatDateSQL(date_created),
					date_revised: Dates.formatDateSQL(date_revised),
					//2
					doc: photo,
					//3
					risk_list: risk_list && risk_list.map(({text}) => text),
					//4
					close_down_list: close_down_list && close_down_list.map(({text}) => text),
					//5
					safety_pre_requesite_list: safety_pre_requesite_list && safety_pre_requesite_list.filter(({checked, desc}) => checked).map(({checked, desc}) => desc),
					//6
					custom_safety_pre_requesite_list: custom_safety_pre_requesite_list && custom_safety_pre_requesite_list.map(({text}) => text),
					//7
					procedure_list: procedure_list && procedure_list.map(({text}) => text),
					key_point_list: key_point_list && key_point_list.map(({text}) => text),
					operation_list: operation_list && operation_list.map(({text}) => text),
					//8
					other,
				};//

				console.log('insertSOP start', item)
				//save
				try {
					// const res = await insertSOP(item);
					// console.log('insertSOP end', res)
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
