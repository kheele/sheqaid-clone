import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import findByFirestoreIdSite from "../../mutations/all/Site/findByFirestoreIdSite";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";
import findByFirestoreIdEmployee from "../../mutations/all/Employee/findByFirestoreIdEmployee";
import insertEmployeeCompetency from "../../mutations/all/EmployeeCompetency/insertEmployeeCompetency";
import insertEmployeeContract from "../../mutations/all/EmployeeContract/insertEmployeeContract";
import insertEmployeeLeave from "../../mutations/all/EmployeeLeave/insertEmployeeLeave";
import insertEmployeeLicense from "../../mutations/all/EmployeeLicense/insertEmployeeLicense";
import insertEmployeeMedical from "../../mutations/all/EmployeeMedical/insertEmployeeMedical";
import insertEmployeeCounselling from "../../mutations/all/EmployeeCounselling/insertEmployeeCounselling";
import insertEmployeeWarning from "../../mutations/all/EmployeeWarning/insertEmployeeWarning";
import insertEmployeeWorkPermit from "../../mutations/all/EmployeeWorkPermit/insertEmployeeWorkPermit";

// competency_list: [{data: []}],//
// contract_list: [{data: []}],//
// counselling_list: [{data: []}],
// leave_list: [{data: []}],
// license_list: [{data: []}],
// medical_list: [{data: []}],//
// warning_list: [{data: []}],//
// work_permit_list: [{data: []}],

//<editor-fold desc="transfer">
const employees_docs_transfer = async ({tbl, insertFn, attrs: __attrs}) => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    alert(`${tbl}`)

    const list = await workers.emit('relay/get_db_hr_docs', tbl);
    alert(`${tbl}, ${list.length}`)
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            removed,//
            // notifications_removed,//
            expiry_updated,//
            doc,//

            employee,//

            created_at,//
            company_id,//
            client_id,//
            project_id,//
            site_id,//
            client,//
            project,//
            site,//
            user_id,//

            contractor_id,//
            contractor_site_id,//
            contractor_user_id,//
        } = data;

        const attrs = await __attrs(data);

        const pg_company = await findByFirestoreIdCompany(company_id);
        const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
        const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
        const pg_site = await findByFirestoreIdSite(site ? site.id : site_id);
        const pg_user = await findByFirestoreIdUser(user_id);

        const pg_contractor = await findByFirestoreIdContractor(contractor_id);
        const pg_contractor_site = await findByFirestoreIdSite(contractor_site_id);
        const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);

        const pg_employee = await findByFirestoreIdEmployee(employee.id);
        if (pg_employee) {
            const item = {
                firestore_id: id,

                ...attrs,

                removed,
                // notifications_removed,
                expiry_updated,
                doc,

                created_at: Dates.formatTimestampSQL(created_at),

                employee_id: pg_employee.id,

                company_id: pg_company.id,
                client_id: pg_client && pg_client.id,
                project_id: pg_project && pg_project.id,
                site_id: pg_site && pg_site.id,
                user_id: pg_user && pg_user.id,

                contractor_id: pg_contractor && pg_contractor.id,
                contractor_site_id: pg_contractor_site && pg_contractor_site.id,
                contractor_user_id: pg_contractor_user && pg_contractor_user.id,
            };//

            console.log(tbl, item)
            //save
            // try {
            //     const res = await insertFn(item);
            //     console.log('insert', tbl, 'end', res)
            // } catch (e) {
            //     console.log(id, pg_employee.id, tbl, e);
            // }
        } else {
            console.log('notfound', id, employee, tbl);
        }
    }

    console.log('insert', tbl, 'finished')
};
//</editor-fold>

export const employees_docs_competencies_transfer = async () => {
    await employees_docs_transfer({
        tbl: 'competency_list', insertFn: insertEmployeeCompetency, attrs: async data => {
            const {
                accreditation_num,
                competency_type,
                expiry_date,
                issued_date,
                training,
                type,
            } = data;

            // const pg_training = await findByFirestoreIdTrainingMatrix(training && training.id);

            return {
                accreditation_num,
                competency_type,
                expiry_date: Dates.formatTimestampSQL(expiry_date),
                issued_date: Dates.formatTimestampSQL(issued_date),
                // training_id: pg_training.id,
                type,
            };
        }
    });
};

export const employees_docs_contracts_transfer = async () => {
    await employees_docs_transfer({
        tbl: 'contract_list', insertFn: insertEmployeeContract, attrs: async data => {
            const {
                job_profile_doc,
                contract_details,
                salary_info,
            } = data;

            const {
                contract_type,
                start_date,
                expiry_date,
                end_of_trial_period,
                start_time,
                end_time,
                daily_working_hours,
                notes,
            } = contract_details;

            const {
                payment_type,
                salary_interval,
                salary,
                wage,
                deductible,//[{text, value}]
            } = salary_info;

            const deductible_list = deductible ? deductible.list.filter(v => !!v && !!v.text && !!v.value) : [];

            return {
                job_profile_doc,
                contract_details_list: {
                    data: [{
                        contract_type,
                        start_date: Dates.formatTimestampSQL(start_date),
                        expiry_date: Dates.formatTimestampSQL(expiry_date),
                        end_of_trial_period: Dates.formatTimestampSQL(end_of_trial_period),
                        start_time,
                        end_time,
                        daily_working_hours,
                        notes,
                    }]
                },
                // contract_details: {
                //     data: {
                //         contract_type,
                //         start_date: Dates.formatTimestampSQL(start_date),
                //         expiry_date: Dates.formatTimestampSQL(expiry_date),
                //         end_of_trial_period: Dates.formatTimestampSQL(end_of_trial_period),
                //         start_time,
                //         end_time,
                //         daily_working_hours,
                //         notes,
                //     }
                // },
                salary_info_list: {
                    data: [{
                        payment_type,
                        salary_interval,
                        salary,
                        wage,
                        deductible_list: {data: deductible_list},//[{text, value}]
                    }]
                },
                // salary_info: {
                //     data: {
                //         payment_type,
                //         salary_interval,
                //         salary,
                //         wage,
                //         deductible_list: {data: deductible_list},//[{text, value}]
                //     }
                // },
            };
        }
    });
};

export const employees_docs_counsellings_transfer = async () => {
    await employees_docs_transfer({
        tbl: 'counselling_list', insertFn: insertEmployeeCounselling, attrs: async data => {
            const {
                corrective_actions,
                counselling_hrs_to_complete,
                expiry_date,
                incident_desc,
                reasons,//[]
                responsible_person,
                types,//[]
                witness_list,//[{id} or external_employee]
            } = data;

            const pg_responsible_person = await findByFirestoreIdEmployee(responsible_person && responsible_person.id);

            return {
                corrective_actions,
                counselling_hrs_to_complete,
                expiry_date: Dates.formatTimestampSQL(expiry_date),
                incident_desc,
                reasons,
                responsible_person_id: pg_responsible_person && pg_responsible_person.id,
                types,
                witness_list: {
                    data: witness_list.map(v => {
                        if(v.id) {
                            return {witness_id: v.id};
                        }
                        return {witness_external: {data: v}};
                    })
                },//[{id} or external_employee]
            };
        }
    });
};

export const employees_docs_leaves_transfer = async () => {
    await employees_docs_transfer({
        tbl: 'leave_list', insertFn: insertEmployeeLeave, attrs: async data => {
            const {
                date,
                days_booked,
                due_to,
                employee_comments,
                expiry_date,
                notes,
                reason,
                type,
            } = data;

            return {
                date: Dates.formatTimestampSQL(date),
                days_booked,
                due_to,
                employee_comments,
                expiry_date: Dates.formatTimestampSQL(expiry_date),
                notes,
                reason,
                type,
            };
        }
    });
};

//no data
export const employees_docs_licenses_transfer = async () => {
    await employees_docs_transfer({
        tbl: 'license_list', insertFn: insertEmployeeLicense, attrs: async data => {
            const {
                date,
                expiry_date,
                notes,
            } = data;

            return {
                date: Dates.formatTimestampSQL(date),
                expiry_date: Dates.formatTimestampSQL(expiry_date),
                notes,
            };
        }
    });
};

export const employees_docs_medicals_transfer = async () => {
    await employees_docs_transfer({
        tbl: 'medical_list', insertFn: insertEmployeeMedical, attrs: async data => {
            const {
                expiry_date,
                restrictions,
                annexture_3,
            } = data;

            return {
                expiry_date: Dates.formatTimestampSQL(expiry_date),
                restrictions,
                annexture_3,
            };
        }
    });
};

export const employees_docs_warnings_transfer = async () => {
    await employees_docs_transfer({
        tbl: 'warning_list', insertFn: insertEmployeeWarning, attrs: async data => {
            const {
                date,
                details,
                employee_comments,
                expiry_date,
                issued_by,
                notes,
                type,
            } = data;

            const pg_issued_by = await findByFirestoreIdEmployee(issued_by && issued_by.id);

            return {
                date: Dates.formatTimestampSQL(date),
                details,
                employee_comments,
                expiry_date: Dates.formatTimestampSQL(expiry_date),
                issued_by_id: pg_issued_by && pg_issued_by.id,
                notes,
                type,
            };
        }
    });
};

//no data
export const employees_docs_work_permits_transfer = async () => {
    await employees_docs_transfer({
        tbl: 'work_permit_list', insertFn: insertEmployeeWorkPermit, attrs: async data => {
            const {
                date,
                expiry_date,
                notes,
            } = data;

            return {
                date: Dates.formatTimestampSQL(date),
                expiry_date: Dates.formatTimestampSQL(expiry_date),
                notes,
            };
        }
    });
};