import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import insertClient from "mutations/all/Client/insertClient";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdClient from "../../mutations/all/Client/findByFirestoreIdClient";
import updateClient from "../../mutations/all/Client/updateClient";

const tbl = "plugin_sheq_assist_clients";
//<editor-fold desc="transfer">
export const client_transfer = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    alert(`${tbl}`)

    const list = await workers.emit('relay/get_db', tbl);
    alert(`${tbl}, ${list.length}`)
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            business_id,
            name,
            user_id,//todo
            created_at,
            company_id,
            email,
            phone,
            address,
            profile_pic,
        } = data;

        const pg_company = await findByFirestoreIdCompany(company_id);
        console.log('findByFirestoreIdCompany', pg_company, created_at)

        const item = {
            business_id,
            name,
            // user_id,//todo
            created_at: Dates.formatTimestampSQL(created_at),
            company_id: pg_company.id,
            email,
            phone,
            address,
            firestore_id: id,
            profile_pic,
        };//

        console.log('insertClient start', item)
        //save plugin
        try {
            const res = await insertClient(item);
            console.log('insertClient end', res)
        } catch (e) {
            console.log(name, e);
        }
    }
};
//</editor-fold>

//<editor-fold desc="update">
export const client_update = async () => {
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
            let item = await findByFirestoreIdClient(id);

            item = {
                user_id: pg_user && pg_user.id, id: item.id,
            };

            console.log('updateClient start', item)
            try {
                const res = await updateClient(item);
                console.log('updateClient end', res)
            } catch (e) {
                console.log(name, e);
            }
        } else {
            console.log('updateClient user not found', name, user_id)
        }
    }
};
//</editor-fold>
