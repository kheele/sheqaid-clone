import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import findByFirestoreIdSite from "../../mutations/all/Site/findByFirestoreIdSite";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";

import {process_questionnaire_map} from "./process_questionnaire_map";
import insertContractorsQuestionnaireLibrary
	from "../../mutations/all/Questionnaires/ContractorsQuestionnaireLibrary/insertContractorsQuestionnaireLibrary";
import findByFirestoreIdContractorsQuestionnaireLibrary
	from "../../mutations/all/Questionnaires/ContractorsQuestionnaireLibrary/findByFirestoreIdContractorsQuestionnaireLibrary";
import {isObservableArray, toJS} from "mobx";
import WebWorker from "web-worker/WebWorker";

async function convertQuestionnaireObjectToArray(questionsObject) {
	if (isArray(questionsObject) || isObservableArray(questionsObject)) {
		return questionsObject;
	}
	const worker = new WebWorker(() => {
		Events.on("process", Utils.convertQuestionnaireObjectToArray);
	});
	const res = await worker.emit("process", toJS(questionsObject));
	worker.terminate();
	return res;
}


const tbl = "plugin_sheq_assist_contractors_questionnaire_library";
//<editor-fold desc="transfer">
export const contractors_questionnaire_library_transfer = async () => {
	await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

	const list = await workers.emit('relay/get_db2', tbl);

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
			contractor,
			form: {name, desc, answered_by, type, title_page_list, questions},
			status,
			visibility,
		} = data;

		const existingItem = await findByFirestoreIdContractorsQuestionnaireLibrary(id);
		if (!existingItem) {
			const pg_company = await findByFirestoreIdCompany(company_id);
			const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
			const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
			const pg_site = await findByFirestoreIdSite(site ? site.id : site_id);
			const pg_user = await findByFirestoreIdUser(user_id);

			const pg_contractor = await findByFirestoreIdContractor(contractor_id || (contractor && contractor.id));
			const pg_contractor_site = await findByFirestoreIdSite(contractor_site_id);
			const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);

			title_page_list = await convertQuestionnaireObjectToArray(title_page_list);
			questions = await convertQuestionnaireObjectToArray(questions);

			// console.log(title_page_list);
			// console.log(questions);

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
				is_template: true,
				visibility: visibility === "Public" ? visibility : "Private",
				name,
				desc,
				answered_by: answered_by === 'Receipient' ? 'Recipient' : answered_by,
				status,
				question_list: {data: question_list},
			};//

			console.log('insertContractorsQuestionnaireLibrary start', item)
			//save
			try {
				const res = await insertContractorsQuestionnaireLibrary(item);
				console.log('insertContractorsQuestionnaireLibrary end', res)
			} catch (e) {
				console.log(name, e);
			}
		}
	}
	console.log('contractors_questionnaire_library done', list.length);
};
//</editor-fold>
