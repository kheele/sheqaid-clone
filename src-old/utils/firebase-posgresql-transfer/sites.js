import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import insertSite from "mutations/all/Site/insertSite";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import updateSite from "../../mutations/all/Site/updateSite";
import findByFirestoreIdSite from "../../mutations/all/Site/findByFirestoreIdSite";

const tbl = "plugin_sheq_assist_sites";
//<editor-fold desc="transfer">
export const site_transfer = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    alert(`${tbl}`)

    const list = await workers.emit('relay/get_db', tbl);
    alert(`${tbl}, ${list.length}`)
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            name,
            phone,
            email,
            address,
            created_at,
            company_id,
            client_id,
            project_id,
            client,
            project,
            user_id,//todo
        } = data;

        const pg_company = await findByFirestoreIdCompany(company_id);
        const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
        const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
        console.log('findByFirestoreIdCompany/findByFirestoreIdClient/findByFirestoreIdProject', pg_company, pg_client, pg_project, created_at)

        const item = {
            name,
            phone,
            email,
            address,
            created_at: Dates.formatTimestampSQL(created_at),
            company_id: pg_company.id,
            client_id: pg_client && pg_client.id,
            project_id: pg_project && pg_project.id,
            // user_id,//todo
            firestore_id: id,
        };//

        console.log('insertSite start', item)
        //save plugin
        try {
            const res = await insertSite(item);
            console.log('insertSite end', res)
        } catch (e) {
            console.log(name, e);
        }
    }
};
//</editor-fold>

//<editor-fold desc="update">
export const site_update = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    alert(`${tbl}`)

    const list = await workers.emit('relay/get_db', tbl);
    alert(`${tbl}, ${list.length}`)
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            user_id,
            name,
        } = data;

        const pg_user = await findByFirestoreIdUser(user_id);
        if(pg_user) {
            let item = await findByFirestoreIdSite(id);

            item = {
                user_id: pg_user && pg_user.id, id: item.id,
            };

            console.log('updateSite start', item)
            try {
                const res = await updateSite(item);
                console.log('updateSite end', res)
            } catch (e) {
                console.log(name, e);
            }
        } else {
            console.log('updateSite user not found', name, user_id)
        }
    }
};
//</editor-fold>
