import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
	{
		name,
		reg_num,
		serial_num,
		model,
		condition,
		location,
		manufacturer,
		asset_type,
		//
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

	if(name) {
		filter.push(`asset_detail:{name: {_ilike: "%${name}%"}}`);
	}

	if(reg_num) {
		filter.push(`asset_detail:{reg_num: {_eq: "${reg_num}"}}`);
	}

	if(serial_num) {
		filter.push(`asset_detail:{serial_num: {_eq: "${serial_num}"}}`);
	}

	if(model) {
		filter.push(`asset_detail:{model: {_ilike: "%${model}%"}}`);
	}

	if(condition) {
		filter.push(`asset_detail:{condition: {_eq: "${condition}"}}`);
	}

	if(location) {
		filter.push(`asset_detail:{location: {_ilike: "%${location}%"}}`);
	}

	if(manufacturer) {
		filter.push(`asset_detail:{manufacturer: {_ilike: "%${manufacturer}%"}}`);
	}

	if(asset_type) {
		filter.push(`asset_detail:{asset_type: {_eq: "${asset_type}"}}`);
	}

	filter = filter.join(',');
	//</editor-fold>

	return {filter};
};