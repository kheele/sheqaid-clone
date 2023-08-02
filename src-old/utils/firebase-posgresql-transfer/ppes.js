import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import insertPPE from "mutations/all/PPE/insertPPE";
import findByFirestoreIdSite from "mutations/all/Site/findByFirestoreIdSite";
import findByFirestoreIdUser from "mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractor from "mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "mutations/all/ContractorUser/findByFirestoreIdContractorUser";
import findByFirestoreIdTeam from "mutations/all/Team/findByFirestoreIdTeam";

const tbl = "plugin_sheq_assist_ppe";
//<editor-fold desc="transfer">
export const ppes_transfer = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    alert(`${tbl}`)

    const list = await workers.emit('relay/get_db2', tbl);
    alert(`${tbl}, ${list.length}`)
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            name,
            duration_type,
            duration_value,
            qty_in_stock,
            qty_issued,
            qty_received,
            unit,

            team_list = [],

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
            contractor_site_id,
            contractor_user_id,
        } = data;

        const pg_company = await findByFirestoreIdCompany(company_id);
        const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
        const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
        const pg_site = await findByFirestoreIdSite(site ? site.id : site_id);
        const pg_user = await findByFirestoreIdUser(user_id);

        const pg_contractor = await findByFirestoreIdContractor(contractor_id);
        const pg_contractor_site = await findByFirestoreIdSite(contractor_site_id);
        const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);

        const pg_team_list = await Promise.all(team_list.map(async id => await findByFirestoreIdTeam(id)));

        const item = {
            firestore_id: id,
            name,
            duration_type,
            duration_value,
            qty_in_stock,
            qty_issued,
            qty_received,
            unit,

            team_list: {data: pg_team_list.map(team => ({team_id: team.id}))},

            created_at: Dates.formatTimestampSQL(created_at),
            company_id: pg_company.id,
            client_id: pg_client && pg_client.id,
            project_id: pg_project && pg_project.id,
            site_id: pg_site && pg_site.id,
            user_id: pg_user && pg_user.id,

            contractor_id: pg_contractor && pg_contractor.id,
            contractor_site_id: pg_contractor_site && pg_contractor_site.id,
            contractor_user_id: pg_contractor_user && pg_contractor_user.id,
        };//

        console.log('insertPPE start', item)
        //save
        try {
            const res = await insertPPE(item);
            console.log('insertPPE end', res)
        } catch (e) {
            console.log(name, e);
        }
    }
};
//</editor-fold>
