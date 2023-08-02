import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
	{
		written_off,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgsFilter({site_id, project_id, client_id, exact_orgs});

	if (isBoolean(written_off)) {
		filter.push(`written_off: {_eq: ${written_off}}`);
	}

	filter = filter.join(',');
	//</editor-fold>

	return {filter};
};