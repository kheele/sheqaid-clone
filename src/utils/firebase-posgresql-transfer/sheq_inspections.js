import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import findByFirestoreIdSite from "../../mutations/all/Site/findByFirestoreIdSite";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";
import findByFirestoreIdEmployee from "../../mutations/all/Employee/findByFirestoreIdEmployee";
import updateEmployee from "../../mutations/all/Employee/updateEmployee";
import findByFirestoreIdTeam from "../../mutations/all/Team/findByFirestoreIdTeam";
import updateTeam from "../../mutations/all/Team/updateTeam";
import insertChemicalProduct from "../../mutations/all/Chemicals/ChemicalProduct/insertChemicalProduct";
import findByFirestoreIdContractorsQuestionnaireTemplate
	from "../../mutations/all/Questionnaires/ContractorsQuestionnaireTemplate/findByFirestoreIdContractorsQuestionnaireTemplate";
import {process_questionnaire_map} from "./process_questionnaire_map";
import findByFirestoreIdInspectionsQuestionnaireTemplate
	from "../../mutations/all/Questionnaires/InspectionsQuestionnaireTemplate/findByFirestoreIdInspectionsQuestionnaireTemplate";
import insertInspectionsQuestionnaire
	from "../../mutations/all/Questionnaires/InspectionsQuestionnaires/insertInspectionsQuestionnaire";
import findByFirestoreIdInspectionsQuestionnaire
	from "../../mutations/all/Questionnaires/InspectionsQuestionnaires/findByFirestoreIdInspectionsQuestionnaire";

const tbl = "plugin_sheq_assist_21_Internal_Audit_forms";
//<editor-fold desc="transfer">
export const inspections_transfer = async () => {
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
			//0
			client_id, project_id, site_id,
			client, project, site,
			//1
			form,
			form: {name, desc, type, title_page_list, questions},
		} = data;

		const existingItem = await findByFirestoreIdInspectionsQuestionnaire(id);
		if (!existingItem) {
			const pg_company = await findByFirestoreIdCompany(company_id);
			const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
			const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
			const pg_site = await findByFirestoreIdSite(site ? site.id : site_id);
			const pg_user = await findByFirestoreIdUser(user_id);

			const pg_contractor = await findByFirestoreIdContractor(contractor_id);
			const pg_contractor_site = await findByFirestoreIdSite(contractor_site_id);
			const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);

			const question_list = [
				...(await Promise.all(title_page_list.map(process_questionnaire_map(true)))).filter(v => !!v),
				...(await Promise.all(questions.map(process_questionnaire_map(false)))).filter(v => !!v),
			];

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
				is_template: false,
				name,
				desc,
				question_list: {data: question_list},
			};//

			console.log('insertInspectionsQuestionnaire start', item)
			//save
			try {
				const res = await insertInspectionsQuestionnaire(item);
				console.log('insertInspectionsQuestionnaire end', res)
			} catch (e) {
				console.log(name, e);
			}
		}
	}
};
//</editor-fold>
