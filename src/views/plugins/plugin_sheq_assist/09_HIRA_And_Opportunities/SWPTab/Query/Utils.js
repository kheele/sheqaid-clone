import {orgsFilter} from "graphql/Filters";
import {Dates} from "utils/Dates";

export const getVariablesAndQueryConfig = (
	{
		category,
		work_task,
		location,
		department,
		person_approving_procedure,
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
	if (work_task) {
		filter.push(`work_task: {_like: "%${work_task}%"}`);
	}
	if (location) {
		filter.push(`location: {_like: "%${location}%"}`);
	}
	if (department) {
		filter.push(`department_id: {_eq: "${department.id}"}`);
	}
	if (person_approving_procedure) {
		filter.push(`person_approving_procedure_id: {_eq: "${person_approving_procedure.id}"}`);
	}

	filter = filter.join(',');
	//</editor-fold>

	return {filter};
};