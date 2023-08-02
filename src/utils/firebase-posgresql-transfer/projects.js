import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import insertProject from "mutations/all/Project/insertProject";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdProject from "../../mutations/all/Project/findByFirestoreIdProject";
import updateProject from "../../mutations/all/Project/updateProject";
import updateClient from "../../mutations/all/Client/updateClient";

const tbl = "plugin_sheq_assist_projects";
//<editor-fold desc="transfer">
export const project_transfer = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    

    const list = await workers.emit('relay/get_db', tbl);
    
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            name,
            email,
            phone,
            address,
            created_at,
            company_id,
            client_id,
            client,
            user_id,
        } = data;

        let pg_project = await findByFirestoreIdProject(id);
        //
        const pg_company = await findByFirestoreIdCompany(company_id);
        console.log('findByFirestoreIdClient:client_id', name, client_id)
        const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
        console.log('findByFirestoreIdCompany/findByFirestoreIdClient', pg_company, pg_client, created_at)

        const pg_user = await findByFirestoreIdUser(user_id);

        const item = {
            name,
            email,
            phone,
            address,
            created_at: Dates.formatTimestampSQL(created_at),
            company_id: pg_company.id,
            client_id: pg_client && pg_client.id,
            user_id: pg_user && pg_user.id,
            firestore_id: id,
        };//

        if (pg_project) {
            item.id = pg_project.id;

            console.log('updateProject start', item)
            try {
                const res = await updateProject(item);
                console.log('updateProject end', res)
            } catch (e) {
                console.log(name, e);
            }
        } else {
            console.log('insertProject start', item)
            //save plugin
            try {
                const res = await insertProject(item);
                console.log('insertProject end', res)
            } catch (e) {
                console.log(name, e);
            }
        }
    }
};
//</editor-fold>

//<editor-fold desc="update">
export const project_update = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    

    const list = await workers.emit('relay/get_db', tbl);
    
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            user_id,
            name,
        } = data;

        const pg_user = await findByFirestoreIdUser(user_id);
        if(pg_user) {
            let item = await findByFirestoreIdProject(id);

            item = {
                user_id: pg_user && pg_user.id, id: item.id,
            };

            console.log('updateProject start', item)
            try {
                const res = await updateProject(item);
                console.log('updateProject end', res)
            } catch (e) {
                console.log(name, e);
            }
        } else {
            console.log('updateProject user not found', name, user_id)
        }
    }
};
//</editor-fold>
