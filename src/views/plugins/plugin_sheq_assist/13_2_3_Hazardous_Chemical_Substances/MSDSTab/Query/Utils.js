import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
	{
		name,
		category,
		manufacturer,
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
		if (filter.anyMatch(v => v.trim().startsWith('_or'))) {
			filter.push(`_and: {
				_or: [
					{name: {_ilike: "%${name}%"}}, 
					{common_names: {_ilike: "%${name}%"}}, 
					{chemical_name: {_ilike: "%${name}%"}}
				]
      }`);
		} else {
			filter.push(`_or: [
				{name: {_ilike: "%${name}%"}}, 
				{common_names: {_ilike: "%${name}%"}}, 
				{chemical_name: {_ilike: "%${name}%"}}
			]`);
		}
	}
	if (category) {
		filter.push(`category: {_eq: "${category}"}`);
	}
	if (manufacturer) {
		filter.push(`manufacturer: {_eq: "${manufacturer}"}`);
	}
	if (risk_level) {
		filter.push(`risk_level: {_eq: "${risk_level}"}`);
	}

	filter = filter.join(',');
	//</editor-fold>

	return {filter};
};