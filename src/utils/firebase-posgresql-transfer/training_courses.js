import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import findByFirestoreIdSite from "../../mutations/all/Site/findByFirestoreIdSite";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";
import findByFirestoreIdEmployee from "../../mutations/all/Employee/findByFirestoreIdEmployee";
import updateEmployee from "../../mutations/all/Employee/updateEmployee";
import findByFirestoreIdTeam from "../../mutations/all/Team/findByFirestoreIdTeam";
import updateTeam from "../../mutations/all/Team/updateTeam";
import insertTrainingCourse from "../../mutations/all/TrainingCourse/insertTrainingCourse";
import findByFirestoreIdJobPosition from "../../mutations/all/JobPosition/findByFirestoreIdJobPosition";
import findByFirestoreIdSector from "../../mutations/all/Sector/findByFirestoreIdSector";
import findByNameSector from "../../mutations/all/Sector/findByNameSector";

const tbl = "plugin_sheq_assist_trainings_registry";
//<editor-fold desc="transfer">
export const training_courses_transfer = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);



    const list = await workers.emit('relay/get_db', tbl);
    
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            name,
            frequency,
            provider,
            unit_standard,
            unit_standard_desc,

            sector_list = [],
            job_position_list = [],

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

        const pg_sector_list = (await Promise.all(sector_list.filter(v => !!v).map(async v => {
            if (v.id) {
                const sector = await findByFirestoreIdSector(v.id);
                return {sector_id: sector && sector.id};
            } else if(isString(v)) {
                const sector = await findByNameSector(v);
                return {sector_id: sector && sector.id};
            }
        }))).filter(v => !!v);
        const pg_job_position_list = await Promise.all(job_position_list.filter(v => !!v).map(async v => {
            const job_position = await findByFirestoreIdJobPosition(v.id);
            return {job_position_id: job_position && job_position.id};
        }));

        const item = {
            firestore_id: id,
            name,
            frequency,
            provider,
            unit_standard,
            unit_standard_desc,

            sector_list: {data: pg_sector_list},
            job_position_list: {data: pg_job_position_list},

            created_at: Dates.formatTimestampSQL(created_at),
            company_id: pg_company && pg_company.id,
            client_id: pg_client && pg_client.id,
            project_id: pg_project && pg_project.id,
            site_id: pg_site && pg_site.id,
            user_id: pg_user && pg_user.id,

            contractor_id: pg_contractor && pg_contractor.id,
            contractor_site_id: pg_contractor_site && pg_contractor_site.id,
            contractor_user_id: pg_contractor_user && pg_contractor_user.id,
        };//

        console.log('insertTrainingCourse start', item)
        //save
        try {
            const res = await insertTrainingCourse(item);
            console.log('insertTrainingCourse end', res)
        } catch (e) {
            console.log(name, e);
        }
    }
};
//</editor-fold>

//<editor-fold desc="update">
export const training_courses_update = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);



    const list = await workers.emit('relay/get_db', tbl);
    
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            name,
        } = data;

        const pg_supervisor = await findByFirestoreIdEmployee(supervisor && supervisor.id);

        let item = await findByFirestoreIdTeam(id);
        await Promise.all((employee_list || []).map(async id => {
            let item2 = await findByFirestoreIdEmployee(id);
            if (item2) {
                item2 = {
                    id: item2.id,
                    team_id: item.id,
                };
                console.log('updateEmployee start', item2)
                try {
                    const res = await updateEmployee(item2);
                    console.log('updateEmployee end', res)
                } catch (e) {
                    console.log(id, e);
                }
            }
        }));

        item = {
            id: item.id,
            supervisor_id: pg_supervisor && pg_supervisor.id,
        };

        console.log('updateTeam start', item)
        try {
            const res = await updateTeam(item);
            console.log('updateTeam end', res)
        } catch (e) {
            console.log(id, name, e);
        }
    }
};
//</editor-fold>
