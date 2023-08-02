import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
	{
		name,
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

	filter = filter.join(',');
	//</editor-fold>

	return {filter};
};