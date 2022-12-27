import JsExcelTemplate from "js-excel-template/browser/browser";
import {Dates, execWhen} from "./Utils";
import insertPlugin from "mutations/all/Plugin/insertPlugin";
import insertCompany from "../mutations/all/Company/insertCompany";
import insertUser from "../mutations/all/User/insertUser";
import findByFirestoreIdCompany from "../mutations/all/Company/findByFirestoreIdCompany";
import insertClient from "../mutations/all/Client/insertClient";
import findByFirestoreIdClient from "../mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "../mutations/all/Project/findByFirestoreIdProject";
import insertProject from "../mutations/all/Project/insertProject";
import insertSite from "../mutations/all/Site/insertSite";
import findByFirestoreIdSite from "../mutations/all/Site/findByFirestoreIdSite";

//<editor-fold desc="WorkerEvents">
class WorkerEvents {

    constructor() {
        workers.on("excelTemplate", this.excelTemplate);
    }

    async excelTemplate({arrayBuffer, data}) {
        const excelTemplate = await JsExcelTemplate.fromArrayBuffer(arrayBuffer);
        data.forEach((value, key) => {
            excelTemplate.set(key, data.get(key));
        });
        const blob = await excelTemplate.toBlob();
        return await FileConverters.asDataUrl(blob);
    }
}

//</editor-fold>

//<editor-fold desc="transfer">
const transfer = async ({tbl}) => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    const doc_ref = await db.collection(tbl);//.where('', '=', '');//Promise < DocumentReference < T > >
    const querySnapshot = await doc_ref.get();
    const list = querySnapshot.docs.map((doc) => ({id: doc.id, data: doc.data()}));
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            auth_type,
            client_id,//
            company_id,
            created_at,
            fname,
            lname,
            // password,
            linked_employee_id,//
            reset_password_id,
            permissions_modules,
            permissions_other,
            phone,
            profile_pic,
            project_id,//
            receive_covid_positive_case_notifs,
            receive_covid_return_to_work_notifs,
            receive_covid_screening_notifs,
            receive_covid_vulnerability_notifs,
            receive_expired_docs_notifs,
            receive_modules_notifs, //{checked, text, value}
            site_id,//
            user_id,//
            username,
            client_blacklist,//
            project_blacklist,//
            site_blacklist,//
            has_biometric,
            client,
            project,
            site,
        } = data;

        const pg_company = await findByFirestoreIdCompany(company_id);
        const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
        const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
        const pg_site = await findByFirestoreIdSite(site ? site.id : site_id);
        console.log('findByFirestoreIdCompany', pg_company, pg_company.created_at, created_at)

        const receive_contractor_management_notifs = receive_modules_notifs && receive_modules_notifs.find(({text}) => text === 'Receive Contractor Management Notifications'); //{checked, text, value}
        const receive_asset_management_notifs = receive_modules_notifs && receive_modules_notifs.find(({text}) => text === 'Receive Asset Management Notifications'); //{checked, text, value}
        const receive_incident_management_notifs = receive_modules_notifs && receive_modules_notifs.find(({text}) => text === 'Receive Incident Management Notifications'); //{checked, text, value}
        const receive_chemicals_management_notifs = receive_modules_notifs && receive_modules_notifs.find(({text}) => text === 'Receive Chemicals Management Notifications'); //{checked, text, value}
        const receive_non_conformance_management_notifs = receive_modules_notifs && receive_modules_notifs.find(({text}) => text === 'Receive Non-Conformance Management Notifications'); //{checked, text, value}

        if (!user_id) {
            const item = {
                auth_type: auth_type || 'MultiFactor',
                fname,
                lname,
                username,
                phone,
                profile_pic,
                reset_password_id,
                notifications_settings: {
                    data: {
                        receive_covid_positive_case_notifs,
                        receive_covid_return_to_work_notifs,
                        receive_covid_screening_notifs,
                        receive_covid_vulnerability_notifs,
                        receive_expired_docs_notifs,
                        receive_contractor_management_notifs: receive_contractor_management_notifs && receive_contractor_management_notifs.value, //{checked, text, value}
                        receive_asset_management_notifs: receive_asset_management_notifs && receive_asset_management_notifs.value, //{checked, text, value}
                        receive_incident_management_notifs: receive_incident_management_notifs && receive_incident_management_notifs.value, //{checked, text, value}
                        receive_chemicals_management_notifs: receive_chemicals_management_notifs && receive_chemicals_management_notifs.value, //{checked, text, value}
                        receive_non_conformance_management_notifs: receive_non_conformance_management_notifs && receive_non_conformance_management_notifs.value, //{checked, text, value}
                    }
                },
                created_at: Dates.formatTimestampSQL(created_at || pg_company.created_at),
                company_id: pg_company.id,
                client_id: pg_client && pg_client.id,
                project_id: pg_project && pg_project.id,
                site_id: pg_site && pg_site.id,
                // user_id,
                auth_id: id,
                // linked_employee_id,
                firebase_linked_employee_id: linked_employee_id,
                // permissions_module_list: {data: permissions_modules.map(({actions}) => ({actions: {data: actions}, module: }))},//
                // permissions_other_list: {data: permissions_other.map(({}) => ({actions: , key: }))},//
                // client_blacklist,
                // project_blacklist,
                // site_blacklist,
                has_biometric: isBoolean(has_biometric) ? has_biometric : false,
            };//

            console.log('insertUser start', item)
            //save plugin
            try {
                const res = await insertUser(item);
                console.log('insertUser end', res)

                if (res && res.id) {
                    const res_id = convertIdToBigint(res.id);
                    // for (let n = 0; n < module_list.length; n++) {
                    //     const v = module_list[n];
                    //     const {
                    //         id,
                    //         title, desc, hover,
                    //         discount, has_update, price, sort,
                    //         faIconLeft, faIconRight, svgIconLeft, svgIconRight,
                    //         key, status, borderColor,
                    //         // manager_plugin_id,
                    //         company_list
                    //     } = v;
                    //
                    //     console.log('insertModule start',
                    //         id,
                    //         title, desc, hover,
                    //         discount, has_update, price, sort,
                    //         faIconLeft, faIconRight, svgIconLeft, svgIconRight,
                    //         key, status, borderColor,
                    //         manager_plugin_id,
                    //         // company_list
                    //     )
                    //
                    //     //save module
                    //     const module_res = await insertModule({
                    //         title, desc, hover,
                    //         discount, has_update, price, sort,
                    //         faIconLeft, faIconRight, svgIconLeft, svgIconRight,
                    //         key, status, borderColor,
                    //         manager_plugin_id,
                    //         // company_list
                    //     });
                    //     console.log('insertModule end', module_res)
                    // }
                }
            } catch (e) {
                console.log(username, e);
            }
        }
    }
};
// transfer({tbl: "default_users"});
//</editor-fold>

//<editor-fold desc="transferUpdate">
const transferUpdate = async ({tbl}) => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    const doc_ref = await db.collection(tbl);//.where('', '=', '');//Promise < DocumentReference < T > >
    const querySnapshot = await doc_ref.get();
    const list = querySnapshot.docs.map((doc) => ({id: doc.id, data: doc.data()}));
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            auth_type,
            client_id,//
            company_id,
            created_at,
            fname,
            lname,
            // password,
            linked_employee_id,//
            reset_password_id,
            permissions_modules,
            permissions_other,
            phone,
            profile_pic,
            project_id,//
            receive_covid_positive_case_notifs,
            receive_covid_return_to_work_notifs,
            receive_covid_screening_notifs,
            receive_covid_vulnerability_notifs,
            receive_expired_docs_notifs,
            receive_modules_notifs, //{checked, text, value}
            site_id,//
            user_id,//
            username,
            client_blacklist,//
            project_blacklist,//
            site_blacklist,//
            has_biometric,
        } = data;

        const pg_company = await findByFirestoreIdCompany(company_id);
        console.log('findByFirestoreIdCompany', pg_company, pg_company.created_at, created_at)

        const receive_contractor_management_notifs = receive_modules_notifs && receive_modules_notifs.find(({text}) => text === 'Receive Contractor Management Notifications'); //{checked, text, value}
        const receive_asset_management_notifs = receive_modules_notifs && receive_modules_notifs.find(({text}) => text === 'Receive Asset Management Notifications'); //{checked, text, value}
        const receive_incident_management_notifs = receive_modules_notifs && receive_modules_notifs.find(({text}) => text === 'Receive Incident Management Notifications'); //{checked, text, value}
        const receive_chemicals_management_notifs = receive_modules_notifs && receive_modules_notifs.find(({text}) => text === 'Receive Chemicals Management Notifications'); //{checked, text, value}
        const receive_non_conformance_management_notifs = receive_modules_notifs && receive_modules_notifs.find(({text}) => text === 'Receive Non-Conformance Management Notifications'); //{checked, text, value}

        if (!client_id && !user_id) {
            const item = {
                auth_type: auth_type || 'MultiFactor',
                fname,
                lname,
                username,
                phone,
                profile_pic,
                reset_password_id,
                notifications_settings: {
                    data: {
                        receive_covid_positive_case_notifs,
                        receive_covid_return_to_work_notifs,
                        receive_covid_screening_notifs,
                        receive_covid_vulnerability_notifs,
                        receive_expired_docs_notifs,
                        receive_contractor_management_notifs: receive_contractor_management_notifs && receive_contractor_management_notifs.value, //{checked, text, value}
                        receive_asset_management_notifs: receive_asset_management_notifs && receive_asset_management_notifs.value, //{checked, text, value}
                        receive_incident_management_notifs: receive_incident_management_notifs && receive_incident_management_notifs.value, //{checked, text, value}
                        receive_chemicals_management_notifs: receive_chemicals_management_notifs && receive_chemicals_management_notifs.value, //{checked, text, value}
                        receive_non_conformance_management_notifs: receive_non_conformance_management_notifs && receive_non_conformance_management_notifs.value, //{checked, text, value}
                    }
                },
                created_at: Dates.formatTimestampSQL(created_at || pg_company.created_at),
                company_id: pg_company.id,
                // client_id,
                // project_id,
                // site_id,
                // user_id,
                auth_id: id,
                // linked_employee_id,
                firebase_linked_employee_id: linked_employee_id,
                // permissions_module_list: {data: permissions_modules.map(({actions}) => ({actions: {data: actions}, module: }))},//
                // permissions_other_list: {data: permissions_other.map(({}) => ({actions: , key: }))},//
                // client_blacklist,
                // project_blacklist,
                // site_blacklist,
                has_biometric: isBoolean(has_biometric) ? has_biometric : false,
            };//

            console.log('insertUser start', item)
            //save plugin
            try {
                const res = await insertUser(item);
                console.log('insertUser end', res)

                if (res && res.id) {
                    const res_id = convertIdToBigint(res.id);
                    // for (let n = 0; n < module_list.length; n++) {
                    //     const v = module_list[n];
                    //     const {
                    //         id,
                    //         title, desc, hover,
                    //         discount, has_update, price, sort,
                    //         faIconLeft, faIconRight, svgIconLeft, svgIconRight,
                    //         key, status, borderColor,
                    //         // manager_plugin_id,
                    //         company_list
                    //     } = v;
                    //
                    //     console.log('insertModule start',
                    //         id,
                    //         title, desc, hover,
                    //         discount, has_update, price, sort,
                    //         faIconLeft, faIconRight, svgIconLeft, svgIconRight,
                    //         key, status, borderColor,
                    //         manager_plugin_id,
                    //         // company_list
                    //     )
                    //
                    //     //save module
                    //     const module_res = await insertModule({
                    //         title, desc, hover,
                    //         discount, has_update, price, sort,
                    //         faIconLeft, faIconRight, svgIconLeft, svgIconRight,
                    //         key, status, borderColor,
                    //         manager_plugin_id,
                    //         // company_list
                    //     });
                    //     console.log('insertModule end', module_res)
                    // }
                }
            } catch (e) {
                console.log(username, e);
            }
        }
    }
};
// transferUpdate({tbl: "default_users"});
//</editor-fold>

//<editor-fold desc="transferClients">
const transferClients = async ({tbl}) => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    // alert(tbl)

    const doc_ref = await db.collection(tbl);//.where('', '=', '');//Promise < DocumentReference < T > >
    const querySnapshot = await doc_ref.get();
    const list = querySnapshot.docs.map((doc) => ({id: doc.id, data: doc.data()}));
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

            if (res && res.id) {
                const res_id = convertIdToBigint(res.id);
            }
        } catch (e) {
            console.log(name, e);
        }
    }
};
transferClients({tbl: "plugin_sheq_assist_clients"});
//</editor-fold>

//<editor-fold desc="transferProjects">
const transferProjects = async ({tbl}) => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    const doc_ref = await db.collection(tbl);//.where('', '=', '');//Promise < DocumentReference < T > >
    const querySnapshot = await doc_ref.get();
    const list = querySnapshot.docs.map((doc) => ({id: doc.id, data: doc.data()}));
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
            user_id,//todo
        } = data;

        const pg_company = await findByFirestoreIdCompany(company_id);
        console.log('findByFirestoreIdClient:client_id', name, client_id)
        const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
        console.log('findByFirestoreIdCompany/findByFirestoreIdClient', pg_company, pg_client, created_at)

        const item = {
            name,
            email,
            phone,
            address,
            created_at: Dates.formatTimestampSQL(created_at),
            company_id: pg_company.id,
            client_id: pg_client && pg_client.id,
            // user_id,//todo
            firestore_id: id,
        };//

        console.log('insertProject start', item)
        //save plugin
        try {
            const res = await insertProject(item);
            console.log('insertProject end', res)

            if (res && res.id) {
                const res_id = convertIdToBigint(res.id);
            }
        } catch (e) {
            console.log(name, e);
        }
    }
};
// transferProjects({tbl: "plugin_sheq_assist_projects"});
//</editor-fold>

//<editor-fold desc="transferSites">
const transferSites = async ({tbl}) => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    const doc_ref = await db.collection(tbl);//.where('', '=', '');//Promise < DocumentReference < T > >
    const querySnapshot = await doc_ref.get();
    const list = querySnapshot.docs.map((doc) => ({id: doc.id, data: doc.data()}));
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

            if (res && res.id) {
                const res_id = convertIdToBigint(res.id);
            }
        } catch (e) {
            console.log(name, e);
        }
    }
};
// transferSites({tbl: "plugin_sheq_assist_sites"});
//</editor-fold>

//<editor-fold desc="insert">
const insert = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);
    //
    // console.log("countries", countries.length);
    // for (let n = 0; n < countries.length; n++) {
    //     const {
    //         capital,
    //         city_list,//default_cities_arr_rel_insert_input
    //         company_list,//default_companies_arr_rel_insert_input
    //         currency,
    //         currency_name,
    //         currency_symbol,
    //         date_format,
    //         emoji,
    //         emojiU,
    //         id,
    //         iso2,
    //         iso3,
    //         latitude,
    //         living_address_list,//hr_employees_living_address_arr_rel_insert_input
    //         longitude,
    //         name,
    //         native,
    //         numeric_code,
    //         phone_code,
    //         region,
    //         subregion,
    //         symbol,
    //         timezones,
    //         tld,
    //         translations,
    //         zone_list,//default_zones_arr_rel_insert_input
    //     } = countries[n];
    //     const item = countries[n];
    //     console.log(item.name, "start");
    //     await insertCountry(item);
    //     // console.log(`(${id}, ${name}, ${iso2}, ${phone_code}, ${currency}, ${symbol}, ${date_format}, ${iso3}, ${numeric_code}, ${currency_name}, ${capital}, ${currency_symbol}, ${tld}, ${native}, ${region}, ${subregion}, ${latitude}, ${longitude}, ${emoji}, ${emojiU}, ${timezones}, ${translations}`);
    //     console.log(item.name, "done");
    // }
    //
    // console.log("zones", zones.length);
    // for (let n = 0; n < zones.length; n++) {
    //     const item = zones[n];
    //     console.log(item.name, "start");
    //     await insertZone(item);
    //     console.log(item.name, "done");
    // }

    // console.log("cities", cities.length);
    // for (let n = 0; n < cities.length; n++) {
    //     const item = cities[n];
    //     console.log(item.name, "start");
    //     await insertCity(item);
    //     console.log(item.name, "done");
    // }
};
// insert();
//</editor-fold>

export default new WorkerEvents();
