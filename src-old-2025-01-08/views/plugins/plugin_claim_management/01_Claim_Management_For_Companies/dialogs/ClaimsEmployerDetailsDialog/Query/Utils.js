import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
	{
		company_name,
		//
		removed,
		//
		client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgsFilter({client_id, exact_orgs});

	if (isBoolean(removed)) {
		filter.push(`removed: {_eq: ${removed}}`);
	}

	if(company_name) {
		filter.push(`company_name: {_ilike: "%${company_name}%"}`);
	}

	filter = filter.join(',');
	//</editor-fold>

	return {filter};
};
