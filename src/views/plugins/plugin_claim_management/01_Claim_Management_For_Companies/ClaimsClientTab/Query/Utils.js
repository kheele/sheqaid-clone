import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
	{
		employee,
		occupation,
		status,
		claim_status,
		//
		removed,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgsFilter({site_id, project_id, client_id, exact_orgs});

	if (isBoolean(removed)) {
		filter.push(`removed: {_eq: ${removed}}`);
	}

	if(employee) {
		filter.push(`employee_id: {_eq: ${employee.id}}`);
	}
	if(occupation) {
		filter.push(`occupation_id: {_eq: ${occupation.id}}`);
	}
	if(status) {
		filter.push(`status: {_eq: "${status}"}`);
	}
	if(claim_status) {
		filter.push(`claim_status: {_eq: "${claim_status}"}`);
	}

	filter = filter.join(',');
	//</editor-fold>

	return {filter};
};
