import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import insertJobCategory from "mutations/all/JobCategory/insertJobCategory";
import findByFirestoreIdSite from "../../mutations/all/Site/findByFirestoreIdSite";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";

const tbl = "plugin_sheq_assist_job_positions";
//<editor-fold desc="transfer">
export const document_categories_transfer = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    

    const list1 = await workers.emit('relay/get_db', tbl);
    const list2 = await workers.emit('relay/get_db_hr', tbl);
    const fn = (item) => {
        if (list.noneMatch(({id, data: {job_category, company_id, client_id, project_id, site_id}}) => {
            return job_category === item.data.job_category &&
                company_id === item.data.company_id &&
                client_id === item.data.client_id &&
                project_id === item.data.project_id &&
                site_id === item.data.site_id;
        })) {
            list.push(item);
        }
    };
    const list = [];
    list1.filter(v => !!v.data.job_category).forEach(fn);
    list2.filter(v => !!v.data.job_category).forEach(fn);

    

    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            name,
            desc,
            job_category,
            created_at,
            company_id,
            client_id,
            project_id,
            site_id,
            client,
            project,
            site,
            user_id,

            contractor_id,
            contractor_user_id,
        } = data;

        const pg_company = await findByFirestoreIdCompany(company_id);
        const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
        const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
        const pg_site = await findByFirestoreIdSite(site ? site.id : site_id);
        const pg_user = await findByFirestoreIdUser(user_id);

        const pg_contractor = await findByFirestoreIdContractor(contractor_id);
        const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);

        const item = {
            firestore_id: id,
            name: job_category,
            job_category_owner: 'Private',//[Public, Private]
            created_at: Dates.formatTimestampSQL(created_at),
            company_id: pg_company.id,
            client_id: pg_client && pg_client.id,
            project_id: pg_project && pg_project.id,
            site_id: pg_site && pg_site.id,
            user_id: pg_user && pg_user.id,

            contractor_id: pg_contractor && pg_contractor.id,
            contractor_user_id: pg_contractor_user && pg_contractor_user.id,
        };//

        console.log('insertJobCategory start', item)
        //save
        try {
            const res = await insertJobCategory(item);
            console.log('insertJobCategory end', res)
        } catch (e) {
            console.log(name, e);
        }
    }
};
//</editor-fold>
