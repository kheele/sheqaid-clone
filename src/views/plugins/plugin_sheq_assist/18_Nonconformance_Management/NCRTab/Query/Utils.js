import {orgsFilter} from "graphql/Filters";
import {Dates} from "utils/Dates";

export const getVariablesAndQueryConfig = (
	{
		expiry_date = 'ALL',
		mon, mon2, mon3,
		source,
		responsible_party_list,
		assigned_job_position_list,
		assigned_person_list,
		approving_person_list,
		type,
		priority,
		allocation,
		status_progress,
		status_acceptance,
		result,
		due_date_range,
		progress_date_range,
		completed_date_range,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = true,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgsFilter({site_id, project_id, client_id, exact_orgs,});

	if (expiry_date === null) {//expiry_no
		filter.push(`due_date: {_is_null: true}`);
	} else if (expiry_date === -1) {//expired
		filter.push(`due_date: {_lte: "now()"}`);
	} else if (expiry_date === 1) {//expired_1mon
		filter.push(`due_date: {_gt: "now()", _lte: "${mon}"}`);
	} else if (expiry_date === 2) {//expired_2mon
		filter.push(`due_date: {_gt: "${mon}", _lte: "${mon2}"}`);
	} else if (expiry_date === 3) {//expired_3mon
		filter.push(`due_date: {_gt: "${mon2}", _lte: "${mon3}"}`);
	} else if (expiry_date === 4) {//expired_4mon
		filter.push(`due_date: {_gt: "${mon3}"}`);
	}

	if (source) {
		filter.push(`source: {_eq: "${source}"}`);
	}

	if (responsible_party_list && responsible_party_list.isNotEmpty()) {
		filter.push(`responsible_party_list: {value: {_in: [${responsible_party_list.map(v => `"${v}"`).join(',')}]}}`);
	}
	if (assigned_job_position_list && assigned_job_position_list.isNotEmpty()) {
		filter.push(`assigned_job_position_list: {job_position_id: {_in: [${assigned_job_position_list.join(',')}]}}`);
	}
	if (assigned_person_list && assigned_person_list.isNotEmpty()) {
		filter.push(`assigned_person_list: {employee_id: {_in: [${assigned_person_list.join(',')}]}}`);
	}
	if (approving_person_list && approving_person_list.isNotEmpty()) {
		filter.push(`approving_person_id: {_in: [${approving_person_list.join(',')}]}`);
	}

	if (type) {
		filter.push(`type: {_eq: "${type}"}`);
	}
	if (priority) {
		filter.push(`priority: {_eq: "${priority}"}`);
	}
	if (allocation) {
		filter.push(`allocation: {_eq: "${allocation}"}`);
	}
	if (status_progress) {
		filter.push(`status_progress: {_eq: "${status_progress}"}`);
	}
	if (status_acceptance) {
		filter.push(`status_acceptance: {_eq: "${status_acceptance}"}`);
	}
	if (result) {
		filter.push(`result: {_eq: "${result}"}`);
	}

	if (due_date_range) {
		const {start, end} = due_date_range;
		if(start && end) {
			filter.push(`due_date: {_gte: "${Dates.formatDateSQL(start)}", _lte: "${Dates.formatDateSQL(end)}"}`);
		} else if(start) {
			filter.push(`due_date: {_gte: "${Dates.formatDateSQL(start)}"}`);
		} else if(end) {
			filter.push(`due_date: {_lte: "${Dates.formatDateSQL(end)}"}`);
		}
	}
	if (progress_date_range) {
		const {start, end} = progress_date_range;
		if(start && end) {
			filter.push(`progress_list: {date: {_gte: "${Dates.formatDateSQL(start)}", _lte: "${Dates.formatDateSQL(end)}"}}`);
		} else if(start) {
			filter.push(`progress_list: {date: {_gte: "${Dates.formatDateSQL(start)}"}}`);
		} else if(end) {
			filter.push(`progress_list: {date: {_lte: "${Dates.formatDateSQL(end)}"}}`);
		}
	}
	if (completed_date_range) {
		const {start, end} = completed_date_range;
		if(start && end) {
			filter.push(`completed_date: {_gte: "${Dates.formatDateSQL(start)}", _lte: "${Dates.formatDateSQL(end)}"}`);
		} else if(start) {
			filter.push(`completed_date: {_gte: "${Dates.formatDateSQL(start)}"}`);
		} else if(end) {
			filter.push(`completed_date: {_lte: "${Dates.formatDateSQL(end)}"}`);
		}
	}

	filter = filter.join(',');
	//</editor-fold>

	return {filter};
};