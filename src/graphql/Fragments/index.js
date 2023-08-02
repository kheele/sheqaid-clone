
//<editor-fold desc="orgs_fragment">
export const orgs_fragment = `
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
//</editor-fold>

//<editor-fold desc="orgs_no_site_fragment">
export const orgs_no_site_fragment = `
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
//</editor-fold>

//<editor-fold desc="orgs_no_site_fragment">
export const orgs_no_project_and_site_fragment = `
    company {
        id
        name
    }
    client {
        id
        name
    }
`;
//</editor-fold>

//<editor-fold desc="orgs_id_fragment">
export const orgs_id_fragment = `
    company_id
    client_id
    project_id
    site_id
`;
//</editor-fold>

//<editor-fold desc="personal_details_other_fragment">
export const personal_details_other_fragment = `
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
//</editor-fold>

//<editor-fold desc="employee_personal_details_fragment">
export const employee_personal_details_fragment = `
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
`;
//</editor-fold>

//<editor-fold desc="user_personal_details_fragment">
export const user_personal_details_fragment = `
    id
    auth_id
    created_at
    profile_pic
    fname
    lname
    full_name
    phone
    username
    
    linked_employee {
      ${employee_personal_details_fragment}
    }
`;
//</editor-fold>
