import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";
import findByFirestoreIdContractorSite from "../../mutations/all/ContractorSite/findByFirestoreIdContractorSite";
import insertContractorUser from "../../mutations/all/ContractorUser/insertContractorUser";
import updateContractorUser from "../../mutations/all/ContractorUser/updateContractorUser";

const tbl = "plugin_sheq_assist_contractors_users";
//<editor-fold desc="transfer">
export const contractor_user_transfer = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    alert(`${tbl}`)

    const list = await workers.emit('relay/get_db2', tbl);
    alert(`${tbl}, ${list.length}`)
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            auth_type,
            company_id,
            contractor_id,
            contractor_site_id,
            contractor_user_id,
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
            receive_covid_positive_case_notifs,
            receive_covid_return_to_work_notifs,
            receive_covid_screening_notifs,
            receive_covid_vulnerability_notifs,
            receive_expired_docs_notifs,
            receive_modules_notifs, //{checked, text, value}
            username,
            has_biometric,
        } = data;

        const pg_company = await findByFirestoreIdCompany(company_id);

        const pg_contractor = await findByFirestoreIdContractor(contractor_id);
        const pg_contractor_site = await findByFirestoreIdContractorSite(contractor_site_id);
        const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);

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
            created_at: Dates.formatTimestampSQL(created_at || pg_company.created_at),
            company_id: pg_company && pg_company.id,
            contractor_id: pg_contractor && pg_contractor.id,
            contractor_site_id: pg_contractor_site && pg_contractor_site.id,
            // contractor_user_id: pg_contractor_user && pg_contractor_user.id,
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

        console.log('insertContractorUser start', item)
        //save plugin
        try {
            const res = await insertContractorUser(item);
            console.log('insertContractorUser end', res)
        } catch (e) {
            console.log(username, e);
        }
    }
};
//</editor-fold>

//<editor-fold desc="update">
export const contractor_user_update = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    alert(`${tbl}`)

    const list = await workers.emit('relay/get_db2', tbl);
    alert(`${tbl}, ${list.length}`)
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            user_id,
            username,
        } = data;

        const pg_user = await findByFirestoreIdContractorUser(user_id);
        if(pg_user) {
            let item = await findByFirestoreIdContractorUser(id);

            item = {
                contractor_user_id: pg_user && pg_user.id, id: item.id,
            };

            console.log('updateContractorUser start', item)
            try {
                const res = await updateContractorUser(item);
                console.log('updateContractorUser end', res)

                if (res && res.id) {
                    const res_id = convertIdToBigint(res.id);
                }
            } catch (e) {
                console.log(username, e);
            }
        }
    }
};
//</editor-fold>
