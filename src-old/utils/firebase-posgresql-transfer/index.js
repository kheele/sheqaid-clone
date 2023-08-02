import "./companies";//
import {contractor_transfer} from "./contractors";
import {client_transfer, client_update} from "./clients";//
import {project_transfer, project_update} from "./projects";//
import {site_transfer, site_update} from "./sites";//

import {user_transfer, user_update} from "./users";//
import {contractor_user_transfer, contractor_user_update} from "./contractor_users";

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
// import {employees_transfer} from "./employees";
// import {employees_transfer} from "./employees";
// import {employees_transfer} from "./employees";
// import {employees_transfer} from "./employees";

(async () => {
    // await client_transfer();
    // await project_transfer();
    // await site_transfer();

    // await user_transfer();
    // await user_update();//todo: check why others not found
    //
    // await client_update();
    // await project_update();
    // await site_update();
    //
    // await contractor_transfer();

    // await contractor_user_transfer();
    // await contractor_user_update();

    // await employees_transfer();
    // await employees_docs_competencies_transfer();//fix
})();

//
// await departments_create();//complete
// await departments_transfer();//complete
//
// await job_categories_create();//complete
// await job_categories_transfer();//complete
// await job_positions_create();//complete
// await job_positions_transfer();//complete

// await sectors_create();//complete
// await sectors_transfer();//complete

// await teams_transfer();//complete
// await teams_update();//complete
// await ppes_transfer();//complete

//
// await contractors_questionnaire_templates_transfer();//complete

// await employees_docs_contracts_transfer();//complete
// await employees_docs_counsellings_transfer();//complete
// await employees_docs_leaves_transfer();//complete
// await employees_docs_licenses_transfer();//confirm
// await employees_docs_medicals_transfer();//complete
// await employees_docs_warnings_transfer();//complete
// await employees_docs_work_permits_transfer();//complete

export default {};
