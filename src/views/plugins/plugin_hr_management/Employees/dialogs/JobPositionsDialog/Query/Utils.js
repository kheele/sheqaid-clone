import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
	{
		name,
		job_category_id,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = true,
		exact_orgs_company = true,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgsFilter({site_id, project_id, client_id, exact_orgs, exact_orgs_company,});

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