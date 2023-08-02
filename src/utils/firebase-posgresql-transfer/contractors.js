import {Dates, execWhen} from "../Utils";
import insertContractor from "mutations/all/Contractor/insertContractor";
import findByFirestoreIdCompany from "../../mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "../../mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "../../mutations/all/Project/findByFirestoreIdProject";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdSite from "../../mutations/all/Site/findByFirestoreIdSite";
import updateClient from "../../mutations/all/Client/updateClient";
import updateContractor from "../../mutations/all/Contractor/updateContractor";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";

const tbl = "plugin_sheq_assist_contractors";
//<editor-fold desc="transfer">
export const contractor_transfer = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    

    const list = await workers.emit('relay/get_db2', tbl);
    
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            name,
            password_otp,
            username,
            inc_contractor_pack,
            created_at,
            company_id,
            client_id,
            project_id,
            client,
            project,
            user_id,
            site_list,
        } = data;

        let pg_contractor = await findByFirestoreIdContractor(id);

        const pg_company = await findByFirestoreIdCompany(company_id);
        const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
        const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
        const pg_user = await findByFirestoreIdUser(user_id);

        const pg_site_list = (await Promise.all(site_list.map(async (site) => {
            console.log("pg_site_list 1", username, site)
            return await findByFirestoreIdSite(site.id);
        }))).filter(v => !!v);

        console.log("pg_site_list 2 ", username, pg_site_list)

        const item = {
            name,
            password_otp,
            username,
            inc_contractor_pack,
            company_id: pg_company.id,
            client_id: pg_client && pg_client.id,
            project_id: pg_project && pg_project.id,
            user_id: pg_user && pg_user.id,
            firestore_id: id,
            site_list: {data: pg_site_list.map(v => ({site_id: v.id}))}
        };

        if (pg_contractor) {
            item.id = pg_contractor.id;

            console.log('updateContractor start', item)
            try {
                const res = await updateContractor(item);
                console.log('updateContractor end', res)
            } catch (e) {
                console.log(name, e);
            }
        } else {
            item.created_at = Dates.formatTimestampSQL(created_at);
            console.log('insertContractor start', item)
            //save plugin
            try {
                const res = await insertContractor(item);
                console.log('insertContractor end', res)
            } catch (e) {
                console.log(e);
            }
        }
    }
};
//</editor-fold>