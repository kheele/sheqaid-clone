import "./companies";//
import {contractor_transfer} from "./contractors";
import {client_transfer, client_update} from "./clients";//
import {project_transfer, project_update} from "./projects";//
import {site_transfer, site_update} from "./sites";//

import {user_transfer, user_update} from "./users";//
import {contractor_user_transfer, contractor_user_update, contractor_user_update_pg} from "./contractor_users";

import {departments_create, departments_transfer} from "./departments";
import {job_categories_create, job_categories_transfer} from "./job_categories";
import {job_positions_create, job_positions_transfer} from "./job_positions";

import {sectors_create, sectors_transfer} from "./sectors";

import {teams_transfer, teams_update} from "./teams";
import {ppes_transfer} from "./ppes";
import {employees_transfer} from "./employees";

import {contractors_questionnaire_templates_transfer} from "./contractors_questionnaire_templates";
import {
    employees_docs_competencies_transfer,
    employees_docs_contracts_transfer,
    employees_docs_counsellings_transfer,
    employees_docs_leaves_transfer,
    employees_docs_licenses_transfer, employees_docs_medicals_transfer, employees_docs_warnings_transfer,
    employees_docs_work_permits_transfer
} from "./employees_docs";
import {training_courses_transfer} from "./training_courses";
import {training_manuals_transfer} from "./training_manuals";
import {training_matrixes_transfer} from "./training_matrices";
import {sheq_chemical_hazchemsheets_transfer} from "./sheq_chemical_hazchemsheets";
import {sheq_chemical_products_transfer} from "./sheq_chemical_products";
import {sheq_chemical_sds_transfer} from "./sheq_chemical_sds";
import {
    documents_IMS_Policies_transfer,
    documents_Project_Plan_documents_transfer,
    documents_Project_Plan_transfer
} from "./sheq_documents";
import {incidents_transfer} from "./sheq_incidents";
import {ncr_transfer} from "./ncr";
import {assets_transfer} from "./assets";
import {audits_transfer} from "./sheq_audits";
import {inspections_transfer} from "./sheq_inspections";
import {inspections_templates_transfer} from "./sheq_inspections_templates";
import {contractors_questionnaire_library_transfer} from "./contractors_questionnaire_library";
import {contractors_questionnaires_transfer} from "./contractors_questionnaires";

// import courses from "graphql/data/courses";
// import plan_gob from "graphql/data/plan_gob";
// import plan_mzi from "graphql/data/plan_mzi";

(async () => {
    // await client_transfer();
    // await project_transfer();
    // await site_transfer();
    // //
    // await user_transfer();
    // await user_update();
    //
    // await client_update();
    // await project_update();
    // await site_update();
    //
    // await contractor_transfer();
    //
    // await contractor_user_transfer();
    // await contractor_user_update();
    // await contractor_user_update_pg();
    //
    // await departments_create();//complete
    // await departments_transfer();//complete
    //
    // await job_categories_create();//complete
    // await job_categories_transfer();//complete
    // await job_positions_create();//complete
    // await job_positions_transfer();//complete
    //
    // await sectors_create();//complete
    // await sectors_transfer();//complete
    //
    // await teams_transfer();//complete
    // await teams_update();//complete
    // await ppes_transfer();//complete

    // await employees_transfer();//fix, insert with phone and email

    //begin: fix notfound employees
    // await employees_docs_competencies_transfer();//complete// confirm training matrix
    // await employees_docs_contracts_transfer();//complete
    // await employees_docs_counsellings_transfer();//complete
    // await employees_docs_leaves_transfer();//complete
    // await employees_docs_licenses_transfer();//confirm
    // await employees_docs_medicals_transfer();//complete
    // await employees_docs_warnings_transfer();//complete
    // await employees_docs_work_permits_transfer();//complete
    //end

    // await training_courses_transfer();//complete
    // await training_matrixes_transfer();//complete

    // await contractors_questionnaire_templates_transfer();//complete

    // await documents_Project_Plan_transfer();//complete
    // await documents_Project_Plan_documents_transfer();//complete
    // await documents_IMS_Policies_transfer();//complete

    // await sheq_chemical_products_transfer();//complete
    // await sheq_chemical_hazchemsheets_transfer();//complete
    // await sheq_chemical_sds_transfer();//complete

    // await audits_transfer();//complete
    // await inspections_transfer();//skip
    // await inspections_templates_transfer();//complete
    // await incidents_transfer();//complete
    // await ncr_transfer();//complete

    // await assets_transfer();

    // await contractors_questionnaire_library_transfer();
    // await contractors_questionnaires_transfer();
})();

//document_categories// skip

export default {};
