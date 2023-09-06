import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
	{
		name,
		manufacturer,
		type,
		category,
		physical_state,
		risk_level,
		is_stable,
		is_hazardous,
		is_combustible,
		is_flammable,
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
	if (manufacturer) {
		filter.push(`manufacturer: {_eq: "${manufacturer}"}`);
	}
	if (type) {
		filter.push(`type: {_eq: "${type}"}`);
	}
	if (category) {
		filter.push(`category: {_eq: "${category}"}`);
	}
	if (physical_state) {
		filter.push(`physical_state: {_eq: "${physical_state}"}`);
	}
	if (risk_level) {
		filter.push(`risk_level: {_eq: "${risk_level}"}`);
	}
	if (is_stable) {
		filter.push(`is_stable: {_eq: ${is_stable}}`);
	}
	if (is_hazardous) {
		filter.push(`is_hazardous: {_eq: ${is_hazardous}}`);
	}
	if (is_combustible) {
		filter.push(`is_combustible: {_eq: ${is_combustible}}`);
	}
	if (is_flammable) {
		filter.push(`is_flammable: {_eq: ${is_flammable}}`);
	}

	filter = filter.join(',');
	//</editor-fold>

	return {filter};
};