import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
	{
		completion_status,
		result_status,
		result,
		date_range,
		course_id,
		training_id,
		trainer_id,
		job_position_id,
		employee_id,
		year,
		//
		view = 'Course',
		employee_view = 'active',
		target_view,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	const {id, target} = target_view || {};

	//<editor-fold desc="variables, filters">
	let filter = orgsFilter({site_id, project_id, client_id, exact_orgs});

	if (employee_view) {
		// filter.push(`removed: {_eq: ${employee_view === 'active'}}`);
		// filter.push(`employee: {removed: {_eq: ${employee_view === 'active'}}}`);
	}

	if (year) {
		filter.push(`year: {_eq: ${year}}`);
	}
	if (course_id) {
		filter.push(`course_id: {_eq: ${course_id}}`);
	}
	if (training_id) {
		filter.push(`training_id: {_eq: ${training_id}}`);
	}
	if (trainer_id) {
		filter.push(`trainer_id: {_eq: ${trainer_id}}`);
	}
	if (job_position_id) {
		filter.push(`job_position_id: {_eq: ${job_position_id}}`);
	}
	if (employee_id) {
		filter.push(`employee_id: {_eq: ${employee_id}}`);
	}

	if (completion_status) {
		filter.push(`completion_status: {_eq: "${completion_status}"}`);
	}
	if (result_status) {
		filter.push(`result_status: {_eq: "${result_status}"}`);
	}
	if (result) {
		filter.push(`result: {_eq: ${result}}`);
	}
	if (date_range) {
		filter.push(`date: {_gte: ${date_range.start}, _lte: ${date_range.end}}`);
	}

	filter = filter.join(',');
	//</editor-fold>

	return {filter};
};