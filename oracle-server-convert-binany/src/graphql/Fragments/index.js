
//<editor-fold desc="orgs_fragment">
const orgs_fragment = `
    company {
        id
        name
    }
    client {
        id
        name
    }
    project {
        id
        name
    }
    site {
        id
        name
    }
`;
exports.orgs_fragment = orgs_fragment;
//</editor-fold>

//<editor-fold desc="orgs_contractor_fragment">
const orgs_contractor_fragment = `
    company {
        id
        name
    }
    contractor {
        id
        name
    }
    client {
        id
        name
    }
    site {
        id
        name
    }
`;
exports.orgs_contractor_fragment = orgs_contractor_fragment;
//</editor-fold>

//<editor-fold desc="orgs_no_site_fragment">
const orgs_no_site_fragment = `
    company {
        id
        name
    }
    client {
        id
        name
    }
    project {
        id
        name
    }
`;
exports.orgs_no_site_fragment = orgs_no_site_fragment;
//</editor-fold>

//<editor-fold desc="orgs_no_project_and_site_fragment">
const orgs_no_project_and_site_fragment = `
    company {
        id
        name
    }
    client {
        id
        name
    }
`;
exports.orgs_no_project_and_site_fragment = orgs_no_project_and_site_fragment;
//</editor-fold>

//<editor-fold desc="orgs_id_fragment">
const orgs_id_fragment = `
    company_id
    client_id
    project_id
    site_id
`;
exports.orgs_id_fragment = orgs_id_fragment;
//</editor-fold>

//<editor-fold desc="personal_details_other_fragment">
const personal_details_other_fragment = `
    id
    created_at
    fname
    lname
    #full_name
    id_num
    passport_num
    email
    phone
    job_position{
      id
      name
    }
`;
exports.personal_details_other_fragment = personal_details_other_fragment;
//</editor-fold>

//<editor-fold desc="employee_personal_details_fragment">
const employee_personal_details_fragment = `
    id
    created_at
    profile_pic
    fname
    lname
    full_name
    dob
    sex
    phone
    email
    id_num
    passport_num
    employment_num
    employment_date
    removed
    job_position{
      id
      name
    }
    department{
      id
      name
    }
    linked_user_id
    linked_user{
      id
      auth_id
      created_at
      profile_pic
      fname
      lname
      full_name
      phone
      username
    }
`;
exports.employee_personal_details_fragment = employee_personal_details_fragment;
//</editor-fold>

//<editor-fold desc="user_personal_details_fragment">
const user_personal_details_fragment = `
    id
    auth_id
    created_at
    profile_pic
    fname
    lname
    full_name
    phone
    username
    
    linked_employee_id
    linked_employee {
      ${employee_personal_details_fragment}
    }
`;
exports.user_personal_details_fragment = user_personal_details_fragment;
//</editor-fold>
