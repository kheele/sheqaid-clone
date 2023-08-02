import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import insertClient from "mutations/all/Client/insertClient";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdClient from "../../mutations/all/Client/findByFirestoreIdClient";
import updateClient from "../../mutations/all/Client/updateClient";
import findByKeyModule from "../../mutations/all/Module/findByKeyModule";
import updateModule from "../../mutations/all/Module/updateModule";
import insertModuleProxyClient from "../../mutations/all/Module/insertModuleProxyClient";

const tbl = "plugin_sheq_assist_clients";
//<editor-fold desc="transfer">
export const client_transfer = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);



    const list = await workers.emit('relay/get_db', tbl);
    
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            business_id,
            name,
            user_id,
            created_at,
            company_id,
            email,
            phone,
            address,
            profile_pic,
        } = data;

        let pg_client = await findByFirestoreIdClient(id);
        //
        const pg_company = await findByFirestoreIdCompany(company_id);
        console.log('findByFirestoreIdCompany', pg_company, created_at)

        const pg_user = await findByFirestoreIdUser(user_id);

        const item = {
            business_id,
            name,
            user_id: pg_user && pg_user.id,
            created_at: Dates.formatTimestampSQL(created_at),
            company_id: pg_company.id,
            email,
            phone,
            address,
            firestore_id: id,
            profile_pic,
        };//

        if (pg_client) {
            item.id = pg_client.id;

            console.log('updateClient start', item)
            try {
                const res = await updateClient(item);
                console.log('updateClient end', res)
            } catch (e) {
                console.log(name, e);
            }
        } else {

            console.log('insertClient start', item)
            //save plugin
            try {
                const res = await insertClient(item);
                console.log('insertClient end', res)
            } catch (e) {
                console.log(name, e);
            }
        }
    }
};
//</editor-fold>

//<editor-fold desc="update">
export const client_update = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);



    const list = await workers.emit("plugin_manager/list");
    
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            key,
            modules,
        } = data;

        for (let n = 0; n < modules.length; n++) {
            const {key, company_list} = modules[n];
            if (company_list) {
                const pg_module = await findByKeyModule(key);
                if (pg_module) {
                    for (let n = 0; n < company_list.length; n++) {
                        const {id, data: {name}} = company_list[n];
                        console.log('client_update', name, id)
                        let pg_client = await findByFirestoreIdClient(id);
                        if (pg_client) {
                            const item = {
                                client_id: pg_client.id,
                                module_id: pg_module.id,
                            };
                            console.log('insertModuleProxyClient start', item)
                            try {
                                const res = await insertModuleProxyClient(item);
                                console.log('insertModuleProxyClient end', res)
                            } catch (e) {
                                console.log(name, e);
                            }
                        } else {
                            const pg_company = await findByFirestoreIdCompany(id);
                            if (pg_company) {
                                const item = {
                                    company_id: pg_company.id,
                                    module_id: pg_module.id,
                                };
                                console.log('insertModuleProxyClient start', item)
                                try {
                                    const res = await insertModuleProxyClient(item);
                                    console.log('insertModuleProxyClient end', res)
                                } catch (e) {
                                    console.log(name, e);
                                }
                            } else {
                                console.log('findByFirestoreIdCompany not found', name, id)
                            }
                        }
                    }
                } else {
                    console.log('findByKeyModule not found', key)
                }
            }
        }

        // const pg_user = await findByFirestoreIdUser(user_id);
        // if(pg_user) {
        //     let item = await findByFirestoreIdClient(id);
        //
        //     item = {
        //         user_id: pg_user && pg_user.id, id: item.id,
        //     };
        //
        //     console.log('updateClient start', item)
        //     try {
        //         const res = await updateClient(item);
        //         console.log('updateClient end', res)
        //     } catch (e) {
        //         console.log(name, e);
        //     }
        // } else {
        //     console.log('updateClient user not found', name, user_id)
        // }
    }
};
//</editor-fold>
