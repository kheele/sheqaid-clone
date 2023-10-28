
//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        removed = false,
        //
        employee,
        occupation,
        status,
        claim_status,
        //
        accident_date_range,
        resume_date_range,
        // year,
        mcr_ref_num,
        claim_number,
        // injury_disease,
        // injury_type,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = false,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});

    if(site_id) {
        filter.push(`site_id: {_eq: ${site_id}}`);
    }
    if(project_id) {
        filter.push(`project_id: {_eq: ${project_id}}`);
    }
    if(client_id) {
        filter.push(`client_id: {_eq: ${client_id}}`);
    }

    if (isBoolean(removed)) {
        filter.push(`removed: {_eq: ${removed}}`);
    }

    if(employee) {
        filter.push(`employee_id: {_eq: ${employee.id}}`);
    }
    if(occupation) {
        filter.push(`wcl_2: {occupation_id: {_eq: ${occupation.id}}}`);
    }
    if(status) {
        filter.push(`status: {_eq: "${status}"}`);
    }
    if(claim_status) {
        filter.push(`claim_status: {_eq: "${claim_status}"}`);
    }

    if(accident_date_range) {
        const {start, end} = accident_date_range;
        if(start && end) {
            filter.push(`accident_date: {_gte: "${start}", _lte: "${end}"}`);
        } else if(start) {
            filter.push(`accident_date: {_gte: "${start}"}`);
        } else if(end) {
            filter.push(`accident_date: {_lte: "${end}"}`);
        }
    }
    if(resume_date_range) {
        const {start, end} = resume_date_range;
        if(start && end) {
            filter.push(`wcl_2: {date_resumed_work: {_gte: "${start}", _lte: "${end}"}}`);
        } else if(start) {
            filter.push(`wcl_2: {date_resumed_work: {_gte: "${start}"}}`);
        } else if(end) {
            filter.push(`wcl_2: {date_resumed_work: {_lte: "${end}"}}`);
        }
    }

    // if(year) {
    //     filter.push(`category_list: {category_id: {_in: [${category_list.map(v => v.id)}]}}`);
    // }
    if(mcr_ref_num) {
        filter.push(`ref_num: {_eq: "${mcr_ref_num}"}`);
    }
    if(claim_number) {
        filter.push(`claim_number: {_eq: "${claim_number}"}`);
    }
    // if(injury_disease) {
    //     filter.push(`exact_location: {_ilike: "%${exact_location}%"}`);
    // }
    // if(injury_type) {
    //     filter.push(`vehicle_make: {_ilike: "%${vehicle_make}%"}`);
    // }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>

//<editor-fold desc="coida_claims_fragment">
exports.coida_claims_fragment = `
    id
    created_at
    
    claim_number
    provincial_office
    accident_date
    doctor_email_1
    
    employee{
      id
      fname
      lname
      full_name
    }
    
    message_list_provider{
      id
      date
      msg
      read
      sender{
        id
        full_name
        fname
        lname
        username
      }
    }
    
    wcl_2{
      id
    }
    wcl_4{
      id
    }
    wcl_5_list{
      id
    }
    wcl_6{
      id
    }
    annexture_1{
      id
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