import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
	{
		template,
		job_position,
		employee,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgsFilter({site_id, project_id, client_id, exact_orgs});

	if (template) {
		filter.push(`status: {_eq: "${template}"}`);
	}
	if (job_position) {
		filter.push(`job_position_id: {_eq: ${job_position.id}}`);
	}
	if (employee) {
		filter.push(`_or: [{employee_id: {_eq: ${employee.id}}}, {employee_other_id: {_eq: ${employee.id}}}]`);
	}

	filter = filter.join(',');
	//</editor-fold>

	return {filter};
};