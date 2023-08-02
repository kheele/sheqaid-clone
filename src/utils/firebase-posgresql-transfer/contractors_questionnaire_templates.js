import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import insertContractorsQuestionnaireTemplate from "mutations/all/Questionnaires/ContractorsQuestionnaireTemplate/insertContractorsQuestionnaireTemplate";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";
import findByFirestoreIdContractorSite from "../../mutations/all/ContractorSite/findByFirestoreIdContractorSite";
import findByFirestoreIdContractorsQuestionnaireTemplate
    from "../../mutations/all/Questionnaires/ContractorsQuestionnaireTemplate/findByFirestoreIdContractorsQuestionnaireTemplate";

const tbl = "plugin_sheq_assist_contractors_questionnaire_templates";
//<editor-fold desc="transfer">
export const contractors_questionnaire_templates_transfer = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    const list = await workers.emit('relay/get_db2', tbl);
    
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            name,
            desc,
            category,
            doc,
            doc_num,
            review_date,

            created_at,
            company_id,
            client_id,
            client,
            user_id,

            contractor_id,
            contractor_site_id,
            contractor_user_id,
        } = data;

        const existingItem = await findByFirestoreIdContractorsQuestionnaireTemplate(id);
        if(existingItem) {

        } else {
            const pg_company = await findByFirestoreIdCompany(company_id);
            const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
            const pg_user = await findByFirestoreIdUser(user_id);

            const pg_contractor = await findByFirestoreIdContractor(contractor_id);
            const pg_contractor_site = await findByFirestoreIdContractorSite(contractor_site_id);
            const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);

            const item = {
                firestore_id: id,
                name,
                desc,
                category,

                doc_version_list: {
                    data: [{
                        expiry: Dates.formatTimestampSQL(review_date),
                        doc_num,
                        type: 'Upload',
                        doc,
                        user_id: pg_user && pg_user.id,
                        contractor_user_id: pg_contractor_user && pg_contractor_user.id,
                    }]
                },

                created_at: Dates.formatTimestampSQL(created_at),

                company_id: pg_company.id,
                client_id: pg_client && pg_client.id,
                user_id: pg_user && pg_user.id,

                contractor_id: pg_contractor && pg_contractor.id,
                contractor_site_id: pg_contractor_site && pg_contractor_site.id,
                contractor_user_id: pg_contractor_user && pg_contractor_user.id,
            };//

            console.log('insertContractorsQuestionnaireTemplate start', item)
            //save plugin
            try {
                const res = await insertContractorsQuestionnaireTemplate(item);
                console.log('insertContractorsQuestionnaireTemplate end', res)
            } catch (e) {
                console.log(name, e);
            }
        }
    }
};
//</editor-fold>
