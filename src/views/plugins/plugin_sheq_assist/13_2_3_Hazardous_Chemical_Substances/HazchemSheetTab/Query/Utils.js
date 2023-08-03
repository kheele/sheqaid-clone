import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
	{
		name,
		category,
		manufacturer,
		physical_state,
		type,
		risk_level,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgsFilter({site_id, project_id, client_id, exact_orgs,});

	if (name) {
		filter.push(`name: {_ilike: "%${name}%"}`);
	}
	if (category) {
		filter.push(`category: {_eq: "${category}"}`);
	}
	if (manufacturer) {
		filter.push(`manufacturer: {_eq: "${manufacturer}"}`);
	}
	if (physical_state) {
		filter.push(`physical_state: {_eq: "${physical_state}"}`);
	}
	if (type) {
		filter.push(`type: {_eq: "${type}"}`);
	}
	if (risk_level) {
		filter.push(`type: {_eq: "${risk_level}"}`);
	}

	filter = filter.join(',');
	//</editor-fold>

	return {filter};
};