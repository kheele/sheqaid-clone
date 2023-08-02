import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
	{
		name,
		job_category_id,
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

	if (job_category_id) {
		filter.push(`job_category_id: {_eq: ${job_category_id}}`);
	}

	filter = filter.join(',');
	//</editor-fold>

	return {filter};
};