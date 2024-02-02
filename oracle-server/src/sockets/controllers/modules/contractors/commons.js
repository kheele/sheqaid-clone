//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		name,
		interval,
		template_id,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	
	if(id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if(name) {
			filter.push(`name: {_ilike: "%${name}%"}`);
		}
		if(interval) {
			filter.push(`interval: {_eq: "${interval}"}`);
		}
		if(template_id) {
			filter.push(`template_id: {_eq: ${template_id}}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="site_details_fragment">
const site_details_fragment = `
      id
      status
      contractor{
        id
        name
        username
      }
      site {
        id
        name
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
      }
`;
//</editor-fold>

exports.contractor_details_fragment = (where) => {
	// const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = storage.sessionIds;
	// const {selectedClient, selectedProject, selectedSite} = storage.selected;
	//
	// const company_id = sess_company_id;
	// const client_id = selectedClient && selectedClient.id;
	// const project_id = selectedProject && selectedProject.id;
	// const site_id = selectedSite && selectedSite.id;
	//
	// const id = site_id || project_id || client_id || company_id;
	// let where = '';
	// if (site_id) {
	// 	where = `id: {_eq: ${id}}`;
	// } else if (project_id) {
	// 	where = `project_id: {_eq: ${id}}`;
	// } else if (client_id) {
	// 	where = `client_id: {_eq: ${id}}`;
	// } else {
	// 	where = `company_id: {_eq: ${id}}`;
	// }
	//
	return `
    id
    created_at
    name
    username
    inc_contractor_pack
    contractor_user_list_aggregate{
      aggregate{
        count
      }
    }
    employee_list_aggregate{
      aggregate{
        count
      }
    }
    questionnaire_list_aggregate:contractor_questionnaire_list_aggregate(where: {group: {_eq: "Contractors"}}){
      aggregate{
        count
      }
    }
    questionnaire_active_list_aggregate:contractor_questionnaire_list_aggregate(where: {group: {_eq: "Contractors"}, status: {_neq: "CompleteAccepted"}}){
      aggregate{
        count
      }
    }
    questionnaire_complete_list_aggregate:contractor_questionnaire_list_aggregate(where: {group: {_eq: "Contractors"}, status: {_eq: "CompleteAccepted"}}){
        aggregate{
          count
        }
    }
    questionnaire_compliance_list_aggregate:contractor_questionnaire_list_aggregate(where: {group: {_eq: "Contractors"}, status: {_eq: "CompleteAccepted"}}){
        nodes {
            id
            question_list_aggregate {
                aggregate {
                    sum {
                        score
                        maxScore
                    }
                    min {
                        score
                    }
                    max {
                        score
                    }
                    avg {
                        score
                    }
                }
            }
        }
    }
    incident_list_aggregate{
      aggregate{
        count
      }
    }
    site_pending_list:site_list(where: {status: {_eq: "Pending"}, site: {${where}}}){
      ${site_details_fragment}
    }
    site_accepted_list:site_list(where: {status: {_eq: "Accepted"}, site: {${where}}}){
      ${site_details_fragment}
    }
    site_declined_list:site_list(where: {status: {_eq: "Declined"}, site: {${where}}}){
      ${site_details_fragment}
    }
    site_cancelled_list:site_list(where: {status: {_eq: "Cancelled"}, site: {${where}}}){
      ${site_details_fragment}
    }
    site_removed_list:site_list(where: {status: {_eq: "Removed"}, site: {${where}}}){
      ${site_details_fragment}
    }
    site_list(where: {site: {${where}}}){
      ${site_details_fragment}
    }
`;
};
