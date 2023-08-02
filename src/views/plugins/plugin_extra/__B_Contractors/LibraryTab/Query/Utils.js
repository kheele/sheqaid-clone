import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
	{
		site_id, project_id, client_id,
		//
		exact_orgs = false,
		excContractors = true,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgsFilter({site_id, project_id, client_id, exact_orgs, excContractors});

	filter = filter.map(v => `{${v}}`).join(',');
	//</editor-fold>

	return {filter};
};