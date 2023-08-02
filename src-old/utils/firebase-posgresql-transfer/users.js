import {Dates, execWhen} from "../Utils";
import insertUser from "mutations/all/User/insertUser";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import findByFirestoreIdSite from "mutations/all/Site/findByFirestoreIdSite";
import updateUser from "../../mutations/all/User/updateUser";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdEmployee from "../../mutations/all/Employee/findByFirestoreIdEmployee";

const tbl = "default_users";
//<editor-fold desc="transfer">
export const user_transfer = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    alert(`${tbl}`)

    const list = await workers.emit('relay/get_db', tbl);
    alert(`${tbl}, ${list.length}`)
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
            user_id,//done
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
        console.log('findByFirestoreIdCompany', pg_company, pg_company.data.created_at, created_at)

        const receive_contractor_management_notifs = receive_modules_notifs && receive_modules_notifs.find(({text}) => text === 'Receive Contractor Management Notifications'); //{checked, text, value}
        const receive_asset_management_notifs = receive_modules_notifs && receive_modules_notifs.find(({text}) => text === 'Receive Asset Management Notifications'); //{checked, text, value}
        const receive_incident_management_notifs = receive_modules_notifs && receive_modules_notifs.find(({text}) => text === 'Receive Incident Management Notifications'); //{checked, text, value}
        const receive_chemicals_management_notifs = receive_modules_notifs && receive_modules_notifs.find(({text}) => text === 'Receive Chemicals Management Notifications'); //{checked, text, value}
        const receive_non_conformance_management_notifs = receive_modules_notifs && receive_modules_notifs.find(({text}) => text === 'Receive Non-Conformance Management Notifications'); //{checked, text, value}

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
            created_at: Dates.formatTimestampSQL(created_at || pg_company.data.created_at),
            company_id: pg_company.id,
            client_id: pg_client && pg_client.id,
            project_id: pg_project && pg_project.id,
            site_id: pg_site && pg_site.id,
            // user_id,//done
            auth_id: id,
            // linked_employee_id,//done
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
        } catch (e) {
            console.log(username, e);
        }
    }
};
//</editor-fold>

//<editor-fold desc="update">
export const user_update = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    alert(`${tbl}`)

    const list = await workers.emit('relay/get_db', tbl);
    alert(`${tbl}, ${list.length}`)
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            user_id,
            linked_employee_id,
            username,
        } = data;

        const pg_user = await findByFirestoreIdUser(user_id);
        if(pg_user) {
            let item = await findByFirestoreIdUser(id);
            const pg_linked_employee = await findByFirestoreIdEmployee(linked_employee_id);
            if(pg_linked_employee) {
                item = {
                    linked_employee_id: pg_linked_employee.id, id: item.id,
                };

                console.log('updateUser start', item)
                try {
                    const res = await updateUser(item);
                    console.log('updateUser end', res)
                } catch (e) {
                    console.log(username, e);
                }
            }
        } else {
            console.log('updateUser user not found', username, user_id)
        }
    }
};
//</editor-fold>
