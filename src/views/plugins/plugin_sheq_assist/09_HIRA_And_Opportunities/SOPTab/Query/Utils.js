import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
	{
		category,
		risk_level,
		location,
		task,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = true,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgsFilter({site_id, project_id, client_id, exact_orgs,});

	if (category) {
		filter.push(`category: {_like: "%${category}%"}`);
	}
	if (risk_level) {
		filter.push(`risk_level: {_eq: "${risk_level}"}`);
	}
	if (location) {
		filter.push(`location: {_like: "%${location}%"}`);
	}
	if (task) {
		filter.push(`task: {_like: "%${task}%"}`);
	}

	filter = filter.join(',');
	//</editor-fold>

	return {filter};
};