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
import findByFirestoreIdJobPosition from "../../mutations/all/JobPosition/findByFirestoreIdJobPosition";
import findByFirestoreIdTrainingCourse from "../../mutations/all/TrainingCourse/findByFirestoreIdTrainingCourse";
import findByFirestoreIdJobCategory from "../../mutations/all/JobCategory/findByFirestoreIdJobCategory";
import findByFirestoreIdSector from "../../mutations/all/Sector/findByFirestoreIdSector";
import findByNameSector from "../../mutations/all/Sector/findByNameSector";
import insertTrainingMatrix from "../../mutations/all/TrainingMatrix/insertTrainingMatrix";
import findByFirestoreIdTrainingMatrix from "../../mutations/all/TrainingMatrix/findByFirestoreIdTrainingMatrix";

const tbl = "plugin_sheq_assist_trainings_matrix";
//<editor-fold desc="transfer">
export const training_matrixes_transfer = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    

    const list = await workers.emit('relay/get_db2', tbl);
    
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            //2
            course_or_module,//
            training_plan,//todo
            //3
            allocation,
            job_title,
            sector_list,
            //4
            status,//
            date_range,//
            cost,//
            //5
            institution_conducting_training,//
            hr,
            job_desc,
            //6
            requirement_legal,//
            requirement,//
            max_participants_per_course,//
            training_standard,//
            training_frequency,//
            training_provider_requirement: provider_requirement,//
            //7
            competency_evaluation,//
            unit_standard,//
            unit_standard_desc,//
            credits,//
            nqf_level,//

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

        const existingItem = await findByFirestoreIdTrainingMatrix(id);
        if(existingItem) {

        } else {
            const pg_company = await findByFirestoreIdCompany(company_id);
            const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
            const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
            const pg_site = await findByFirestoreIdSite(site ? site.id : site_id);
            const pg_user = await findByFirestoreIdUser(user_id);

            const pg_contractor = await findByFirestoreIdContractor(contractor_id);
            const pg_contractor_site = await findByFirestoreIdSite(contractor_site_id);
            const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);

            const pg_course = await findByFirestoreIdTrainingCourse(course_or_module && course_or_module.id);
            const pg_trainer = await findByFirestoreIdEmployee(hr && hr.id);
            const pg_trainer_job_position = await findByFirestoreIdJobPosition(job_desc && job_desc.id);

            const pg_sector_list = (await Promise.all((sector_list || []).filter(v => !!v).map(async v => {
                if (v.id) {
                    const sector = await findByFirestoreIdSector(v.id);
                    if(!sector) return;
                    return {sector_id: sector && sector.id};
                } else if (isString(v)) {
                    const sector = await findByNameSector(v);
                    if(!sector) return;
                    return {sector_id: sector && sector.id};
                }
            }))).filter(v => !!v);
            const pg_job_position_list = (await Promise.all((job_title || []).filter(v => !!v).map(async v => {
                const job_position = await findByFirestoreIdJobPosition(v.id);
                if(!job_position) return;
                return {job_position_id: job_position && job_position.id};
            }))).filter(v => !!v);
            const pg_job_category_list = (await Promise.all((allocation || []).filter(v => !!v).map(async v => {
                const job_category = await findByFirestoreIdJobCategory(v.id);
                if(!job_category) return;
                return {job_category_id: job_category && job_category.id};
            }))).filter(v => !!v);

            let trainer_external = null;
            if(hr && !hr.id) {
                if(hr.id === null) {
                    delete hr.id;
                }
                trainer_external = {
                    data: {
                        ...hr,
                        company_id: pg_company && pg_company.id,
                        client_id: pg_client && pg_client.id,
                    }
                };
            }

            const item = {
                //5
                firestore_id: id,
                //2
                // training_plan_list:training_plan,//todo
                //4
                status,//
                date_range_start: date_range && Dates.formatTimestampSQL(date_range.start),//
                date_range_end: date_range && Dates.formatTimestampSQL(date_range.end),//
                cost,//
                //5
                institution_conducting_training,//
                //6
                requirement_legal,//
                requirement,//
                max_participants_per_course,//
                training_standard,//
                training_frequency,//
                provider_requirement,//
                //7
                competency_evaluation,//
                unit_standard,//
                unit_standard_desc,//
                credits,//
                nqf_level,//

                course_id: pg_course && pg_course.id,//course_or_module
                trainer_id: pg_trainer && pg_trainer.id,//hr
                trainer_external: trainer_external,
                trainer_job_position_id: pg_trainer_job_position && pg_trainer_job_position.id,//job_desc

                job_category_list: {data: pg_job_category_list},//allocation
                job_position_list: {data: pg_job_position_list},//job_title
                sector_list: {data: pg_sector_list},

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

            console.log('insertTrainingMatrix start', item)
            //save
            try {
                const res = await insertTrainingMatrix(item);
                console.log('insertTrainingMatrix end', res)
            } catch (e) {
                console.log(course_or_module, e);
            }
        }
    }
};
//</editor-fold>

//<editor-fold desc="update">
export const training_matrixes_update = async () => {
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
            if(item2) {
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
