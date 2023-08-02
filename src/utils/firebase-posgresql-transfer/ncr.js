import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import findByFirestoreIdSite from "../../mutations/all/Site/findByFirestoreIdSite";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";
import findByFirestoreIdEmployee from "../../mutations/all/Employee/findByFirestoreIdEmployee";
import findByFirestoreIdIncident from "../../mutations/all/Incident/findByFirestoreIdIncident";
import findByFirestoreIdAudit from "../../mutations/all/AuditsAndInspections/Audit/findByFirestoreIdAudit";
import findByFirestoreIdNCR from "mutations/all/NCR/findByFirestoreIdNCR";
import findByFirestoreIdInspectionsQuestionnaire
	from "../../mutations/all/Questionnaires/InspectionsQuestionnaires/findByFirestoreIdInspectionsQuestionnaire";
import insertNCR from "../../mutations/all/NCR/insertNCR";

const tbl = "plugin_sheq_assist_18_Nonconformance_Management";
//<editor-fold desc="transfer">
export const ncr_transfer = async () => {
	await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

	// const list = await workers.emit('relay/get_db', tbl);
	const list = await workers.emit('plugin_sheq_assist/ncr/list');

	alert(list.length)
	//
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
			type, priority,
			source,
			selected_source_item,
			selected_source_ref,
			//2
			desc, process,
			//3
			due_date, responsible_person, approving_person,
			//4
			document_list,
			//5
			comments, remarks,
			//6
			progress_list,
			//7
			status_acceptance, status: status_progress, result, completed_date, additional_notes
		} = data;

		const existingItem = await findByFirestoreIdNCR(id);
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

			const pg_responsible_person = await findByFirestoreIdEmployee(responsible_person && responsible_person.id);
			const pg_approving_person = await findByFirestoreIdEmployee(approving_person && approving_person.id);

			const sources = {
				id: {
					"Site Audit": "selected_source_site_id",
					'Compliance Audit': "selected_source_compliance_audit_id",
					'Inspection': "selected_source_inspection_id",
					'Incident Investigation': "selected_source_incident_id",
				},
				fn: {
					"Site Audit": findByFirestoreIdSite,
					'Compliance Audit': findByFirestoreIdAudit,
					'Inspection': findByFirestoreIdInspectionsQuestionnaire,
					'Incident Investigation': findByFirestoreIdIncident,
				}
			};

			if (source === 'Audit') {
				source = 'Compliance Audit';
			}

			console.log(source, sources.id[source]);
			const sourcesFn = sources.fn[source];
			const pg_selected_source = await sourcesFn(selected_source_item && selected_source_item.id);

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
				//1
				type,
				priority,
				source,
				[sources.id[source]]: pg_selected_source && pg_selected_source.id,
				//2
				desc,
				process,
				//3
				due_date: Dates.formatTimestampSQL(due_date),
				responsible_person_id: pg_responsible_person && pg_responsible_person.id,
				approving_person_id: pg_approving_person && pg_approving_person.id,
				//4
				document_list: {
					data: (document_list || []).map(doc => ({doc})),
				},
				//5
				comments,
				remarks,
				//6
				progress_list: {
					data: (progress_list || []).map(({progress_date, additional_notes, outstanding}) => ({
						outstanding,
						notes: additional_notes,
						date: Dates.formatTimestampSQL(progress_date),
					})),
				},
				//7
				status_acceptance,
				status_progress,
				result,
				completed_date: Dates.formatTimestampSQL(completed_date),
				additional_notes
			};//

			console.log('insertNCR start', item)
			//save
			try {
				const res = await insertNCR(item);
				console.log('insertNCR end', res)
			} catch (e) {
				console.log(name, e);
			}
		}
	}

	console.log(tbl, list.length)
};
//</editor-fold>
