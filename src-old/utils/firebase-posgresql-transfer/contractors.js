import {Dates, execWhen} from "../Utils";
import insertContractor from "mutations/all/Contractor/insertContractor";
import findByFirestoreIdCompany from "../../mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "../../mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "../../mutations/all/Project/findByFirestoreIdProject";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";

const tbl = "plugin_sheq_assist_contractors";
//<editor-fold desc="transfer">
export const contractor_transfer = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    alert(`${tbl}`)

    const list = await workers.emit('relay/get_db2', tbl);
    alert(`${tbl}, ${list.length}`)
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
        } = data;

        const pg_company = await findByFirestoreIdCompany(company_id);
        const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
        const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
        const pg_user = await findByFirestoreIdUser(user_id);

        const item = {
            name,
            password_otp,
            username,
            inc_contractor_pack,
            created_at: Dates.formatTimestampSQL(created_at),
            company_id: pg_company.id,
            client_id: pg_client && pg_client.id,
            project_id: pg_project && pg_project.id,
            user_id: pg_user && pg_user.id,
            firestore_id: id,
        };

        console.log('insertContractor start', item)
        //save plugin
        try {
            const res = await insertContractor(item);
            console.log('insertContractor end', res)
        } catch (e) {
            console.log(e);
        }
    }
};
//</editor-fold>