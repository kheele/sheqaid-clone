import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
	{
		status,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgsFilter({site_id, project_id, client_id, exact_orgs});

	if (status) {
		let comp;
		if (status.startsWith('!')) {
			status = status.replace('!', '');
			comp = '_neq';
		} else {
			comp = '_eq';
		}

		filter.push(`status: {${comp}: "${status}"}`);
	}

	filter = filter.join(',');
	//</editor-fold>

	return {filter};
};