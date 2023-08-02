import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
	{
		name,
		supervisor_id,
		employee_id,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgsFilter({site_id, project_id, client_id, exact_orgs});

	if (name) {
		filter.push(`name: {_ilike: "%${name}%"}`);
	}

	if (supervisor_id) {
		filter.push(`supervisor_id: {_eq: ${supervisor_id}}`);
	}

	if (employee_id) {
		filter.push(`employee_list: {id: {_eq: ${employee_id}}}`);
	}

	filter = filter.join(',');
	//</editor-fold>

	return {filter};
};