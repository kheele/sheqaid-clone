import {execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import findByFirestoreIdSite from "../../mutations/all/Site/findByFirestoreIdSite";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";
import findByFirestoreIdOrganogram
    from "../../mutations/all/StructureAndResponsibility/Organogram/findByFirestoreIdOrganogram";
import findByFirestoreIdEmployee from "../../mutations/all/Employee/findByFirestoreIdEmployee";
import findByFirestoreIdTeam from "../../mutations/all/Team/findByFirestoreIdTeam";
import insertOrganogram from "../../mutations/all/StructureAndResponsibility/Organogram/insertOrganogram";

const tbl = "plugin_sheq_assist_StructureAndResponsibility_organograms";
//<editor-fold desc="transfer">
export const organograms_transfer = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    const list = await workers.emit('relay/get_db', tbl);

    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        let {
            company_id,
            user_id,
            contractor_user_id,
            contractor_id,
            contractor_site_id,
            //0
            client_id, project_id, site_id,
            client, project, site,
            //1
            created_at,
            list: old_list,
            _target: target,
            type,
            doc,
        } = data;

        const existingItem = await findByFirestoreIdOrganogram(id);
        if (existingItem) {

        } else {
            const pg_company = await findByFirestoreIdCompany(company_id);
            const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
            const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
            const pg_site = await findByFirestoreIdSite(site ? site.id : site_id);
            const pg_user = await findByFirestoreIdUser(user_id);

            const pg_contractor = await findByFirestoreIdContractor(contractor_id);
            const pg_contractor_site = await findByFirestoreIdSite(contractor_site_id);
            const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);

            const item = {
                firestore_id: id,
                company_id: pg_company && pg_company.id,
                user_id: pg_user && pg_user.id,
                contractor_id: pg_contractor && pg_contractor.id,
                contractor_site_id: pg_contractor_site && pg_contractor_site.id,
                contractor_user_id: pg_contractor_user && pg_contractor_user.id,
                //0
                client_id: pg_client && pg_client.id,
                project_id: pg_project && pg_project.id,
                site_id: pg_site && pg_site.id,
                //1
                target,
                type,
                doc,
                employee_list: {
                    data: (await Promise.all((old_list || []).map(async ({employee, employeeReportedTo, team, team_id, employee_list}) => {
                        const employee_pg = await findByFirestoreIdEmployee(employee && employee.id);
                        const employeeReportedTo_pg = await findByFirestoreIdEmployee(employeeReportedTo && employeeReportedTo.id);
                        const team_pg = await findByFirestoreIdTeam(team_id || (team && team.id));
                        if(employee_pg === null) {
                            console.log('employee_pg1 not found', employee && employee.id)
                            return;
                        }
                        return {
                            employee_id: employee_pg && employee_pg.id,
                            employee_reported_to_id: employeeReportedTo_pg && employeeReportedTo_pg.id,
                            team_id: team_pg && team_pg.id,
                            employee_list: {
                                data: (await Promise.all((employee_list || []).map(async ({id}) => {
                                    const employee_pg = await findByFirestoreIdEmployee(id);
                                    if(employee_pg === null) {
                                        console.log('employee_pg2 not found', id)
                                        return;
                                    }
                                    return {
                                        employee_id: employee_pg && employee_pg.id,
                                    };
                                }))).filter(v => !!v),
                            },
                        };
                    }))).filter(v => !!v),
                },
            };//

            console.log('insertOrganogram start', item)
            //save
            try {
                // const res = await insertOrganogram(item);
                // console.log('insertOrganogram end', res)
            } catch (e) {
                console.log(target, type, e);
            }
        }
    }

    console.log('insertOrganogram complete', list.length);
};
//</editor-fold>
