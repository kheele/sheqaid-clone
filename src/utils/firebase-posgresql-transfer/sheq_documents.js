import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import insertJobCategory from "mutations/all/JobCategory/insertJobCategory";
import findByFirestoreIdSite from "../../mutations/all/Site/findByFirestoreIdSite";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";
import insertEmployeeCompetency from "../../mutations/all/EmployeeCompetency/insertEmployeeCompetency";
import findByFirestoreIdTrainingMatrix from "../../mutations/all/TrainingMatrix/findByFirestoreIdTrainingMatrix";
import findByFirestoreIdEmployee from "../../mutations/all/Employee/findByFirestoreIdEmployee";
import findByFirestoreIdDepartment from "../../mutations/all/Department/findByFirestoreIdDepartment";
import insertDocument from "../../mutations/all/Document/insertDocument";
import findByNameCompanyCategory from "../../mutations/all/CompanyCategory/findByNameCompanyCategory";
import findByFirestoreIdDocument from "../../mutations/all/Document/findByFirestoreIdDocument";

const tbl = "plugin_sheq_assist_documents";

//<editor-fold desc="transfer">
const docs_transfer = async ({doc_type_key: __doc_type_key, doc_type}) => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    

    const list = await workers.emit('relay/get_db', tbl);
    
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            title,//
            desc,
            category,
            type,
            doc_num,
            internal_or_external,
            doc_type_key,
            expiry,
            doc, doc_old,//

            responsible_department,
            responsible_person,
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

        if (doc_type_key === __doc_type_key) {
            const existingItem = await findByFirestoreIdDocument(id);
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

                const pg_employee = await findByFirestoreIdEmployee(employee && employee.id);
                const pg_responsible_person = await findByFirestoreIdEmployee(responsible_person && responsible_person.id);

                const pg_responsible_department = await findByFirestoreIdDepartment(responsible_department && responsible_department.id);

                const pg_category = await findByNameCompanyCategory(category);

                const item = {
                    firestore_id: id,

                    company_id: pg_company.id,
                    client_id: pg_client && pg_client.id,
                    project_id: pg_project && pg_project.id,

                    site_id: pg_site && pg_site.id,
                    user_id: pg_user && pg_user.id,

                    internal_or_external,
                    title,
                    desc,

                    category_id: pg_category && pg_category.id,

                    responsible_department_id: pg_responsible_department && pg_responsible_department.id,
                    responsible_person_id: pg_responsible_person && pg_responsible_person.id,

                    created_at: Dates.formatTimestampSQL(created_at),

                    contractor_id: pg_contractor && pg_contractor.id,
                    contractor_site_id: pg_contractor_site && pg_contractor_site.id,
                    contractor_user_id: pg_contractor_user && pg_contractor_user.id,

                    employee_id: pg_employee && pg_employee.id,

                    doc_type,

                    doc_version_list: {
                        data: [
                            {
                                type,
                                doc_num: isNumber(doc_num) ? String(doc_num) : doc_num,
                                doc: (doc_old && doc_old.dlUrls) ? doc_old : ((doc && doc.dlUrls) ? doc : null),
                                doc_docs_id: isString(doc) ? doc : null,
                                expiry: Dates.formatDateSQL(expiry),
                            }
                        ],
                    }
                };//

                console.log("insertDocument", __doc_type_key, item)
                //save
                try {
                    const res = await insertDocument(item);
                    console.log('insert', tbl, 'end', res)
                } catch (e) {
                    console.log(id, title, __doc_type_key, e);
                }
            }
        }
    }

    console.log('insert', tbl, 'finished')
};
//</editor-fold>

export const documents_Project_Plan_transfer = async () => {
    await docs_transfer({
        doc_type_key: 'plugin_sheq_assist_01_Project_Plan', doc_type: 'Project Plan',
    });
};

export const documents_Project_Plan_documents_transfer = async () => {
    await docs_transfer({
        doc_type_key: 'plugin_sheq_assist_01_Project_Plan_documents', doc_type: 'General Document',
    });
};

export const documents_IMS_Policies_transfer = async () => {
    await docs_transfer({
        doc_type_key: 'plugin_sheq_assist_02_IMS_Policies', doc_type: 'IMS Policy',
    });
};
