const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {hira_swp_details_fragment, getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
	// console.log('data', data)
	
	let {
		offset = 0,
		limit = 50,
		//
		removed = false,
		id,
		//
		category,
		work_task,
		location,
		department_list,
		department_id,
		person_approving_procedure_list,
		person_approving_procedure_id,
		sign_sheet_employee_list,
		sign_sheet_employee_id,
		//
		expiry_range,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
		//
		client_filter,
		orgs_filter = [],
	} = data;
	
	const {filter} = getVariablesAndQueryConfig({
		orgs_filter,
		//
		id,
		//
		category,
		work_task,
		location,
		department_list,
		department_id,
		person_approving_procedure_list,
		person_approving_procedure_id,
		sign_sheet_employee_list,
		sign_sheet_employee_id,
		//
		expiry_range,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	return listGraphQL({
		query: `
			query listAllSWPByLoggedQuery {
                hira_swp(
                  where: {
                    removed: {_eq: ${removed}},
                    ${filter}
                  },
	                order_by: {work_task: asc},
                  offset: ${offset},
                  ${limit > 0 ? `limit: ${limit}` : ''}
                ) {
                    ${hira_swp_details_fragment}
                    ${orgs_fragment}
                }
            }
		`,
		operationName: "listAllSWPByLoggedQuery",
	});
}
//</editor-fold>
