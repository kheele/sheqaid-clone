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
import insertChemicalProduct from "../../mutations/all/Chemicals/ChemicalProduct/insertChemicalProduct";
import insertAudit from "../../mutations/all/AuditsAndInspections/Audit/insertAudit";

const tbl = "plugin_sheq_assist_21_Internal_Audit_audit";
//<editor-fold desc="transfer">
export const audits_transfer = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    

    const list = await workers.emit('relay/get_db', tbl);
    
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            created_at,
            company_id,
            user_id,
            contractor_user_id,
            contractor_id,
            contractor_site_id,
            //0
            client_id, project_id, site_id,
            client, project, site,
            //1
            scope, date, type,
            representative_list,
            auditor_list,
            definition_list, list: __list
        } = data;

        const pg_company = await findByFirestoreIdCompany(company_id);
        const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
        const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
        const pg_site = await findByFirestoreIdSite(site ? site.id : site_id);
        const pg_user = await findByFirestoreIdUser(user_id);

        const pg_contractor = await findByFirestoreIdContractor(contractor_id);
        const pg_contractor_site = await findByFirestoreIdSite(contractor_site_id);
        const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);

        const pg_representative_list = (await Promise.all((representative_list || []).map(async (v) => {
            const {other_person, employee} = v;
            if (other_person) {
                return {other_person};
            } else if (employee) {
                const {id} = employee;
                const pg_employee = await findByFirestoreIdEmployee(id);
                if(!pg_employee) return;
                return {employee_id: pg_employee.id};
            } else if(v.id) {
                const {id} = v;
                const pg_employee = await findByFirestoreIdEmployee(id);
                if(!pg_employee) return;
                return {employee_id: pg_employee.id};
            }
        }))).filter(v => !!v);
        const pg_auditor_list = (await Promise.all((auditor_list || []).map(async (v) => {
            const {other_person, employee} = v;
            if (other_person) {
                return {other_person};
            } else if (employee) {
                const {id} = employee;
                const pg_employee = await findByFirestoreIdEmployee(id);
                if(!pg_employee) return;
                return {employee_id: pg_employee.id};
            } else if(v.id) {
                const {id} = v;
                const pg_employee = await findByFirestoreIdEmployee(id);
                if(!pg_employee) return;
                return {employee_id: pg_employee.id};
            }
        }))).filter(v => !!v);
        const pg_list = (await Promise.all((__list || []).map(async (v) => {
            const {
                achieved_score,//
                audit_findings,//
                audit_summary,//
                comments,//
                compliance,//
                due_date,
                element,//
                possible_score,//
                target_date,
                responsible_person,
                sub_element,//
            } = v;

            const pg_responsible_person = await findByFirestoreIdEmployee(responsible_person && responsible_person.id);

            return {
                achieved_score,//
                audit_findings,//
                audit_summary,//
                comments,//
                compliance,//
                due_date: Dates.formatDateSQL(due_date),//
                element,//
                possible_score,//
                target_date: Dates.formatDateSQL(target_date),//
                responsible_person_id: pg_responsible_person && pg_responsible_person.id,//
                sub_element,//
            };
        }))).filter(v => !!v);

        const item = {
            firestore_id: id,
            created_at: Dates.formatDateSQL(created_at),
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
            scope,
            date: Dates.formatDateSQL(date),
            type,
            //2
            representative_list: {data: pg_representative_list},
            //3
            auditor_list: {data: pg_auditor_list},
            //4
            definition_list: {data: (definition_list || [])},//[{title, desc}]
            //5
            list: {data: pg_list},//[{element, sub_element, audit_findings, audit_summary, possible_score, achieved_score, comments}]
        };//

        console.log('insertAudit start', item)
        //save
        try {
            const res = await insertAudit(item);
            console.log('insertAudit end', res)
        } catch (e) {
            console.log(type, scope, e);
        }
    }
};
//</editor-fold>
