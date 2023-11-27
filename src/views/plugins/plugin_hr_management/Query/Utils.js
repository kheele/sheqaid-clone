import {orgsFilter} from "graphql/Filters";
import {Dates} from "utils/Utils";

export const getVariablesAndQueryConfig = (
	{
		view,
		mon, mon2, mon3,
		expiry_date = 'ALL',
		date_range,
		issued_date,
		date,
		isContract = false,
		//
		type,
		//
		annexture_3,
		//
		// type,
		competency_type,
		course_or_module,
		//
		notes,
		//
		issued_by_id,
		witness_id,
		// type,
		//
		due_to,
		//
		responsible_person,
		types,
		reasons,
		//
		contract_type,
		payment_type,
		salary_interval,
		//
		desc,
		//
		department_id,
		job_position_id,
		team_id,
		supervisor_id,
		employee_id,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = true,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filterEmployee = orgsFilter({site_id, project_id, client_id, exact_orgs,});

	if (department_id) {
		filterEmployee.push(`department_id: {_eq: ${department_id}}`);
	}
	if (job_position_id) {
		filterEmployee.push(`job_position_id: {_eq: ${job_position_id}}`);
	}
	if (team_id) {
		filterEmployee.push(`team_id: {_eq: ${team_id}}`);
	}
	if (supervisor_id) {
		filterEmployee.push(`supervisor_id: {_eq: ${supervisor_id}}`);
	}

	if (view === "Employee") {
		if (employee_id) {
			filterEmployee.push(`id: {_eq: ${employee_id}}`);
		}
		filterEmployee = `,${filterEmployee.join(',')}`;
	} else {
		if (employee_id) {
			filterEmployee.push(`employee_id: {_eq: ${employee_id}}`);
			filterEmployee = `,${filterEmployee.join(',')}`;
		} else {
			filterEmployee = `,employee: {${filterEmployee.join(',')}}`;
		}
	}

	let filter = [];

	if (date_range) {
		const {start, end} = date_range;
		filter.push(`expiry_date: {_gte: "${Dates.formatDateSQL(start)}", _lte: "${Dates.formatDateSQL(end)}"}`);
	} else {
		if (expiry_date === null) {//expiry_no
			filter.push(`expiry_date: {_is_null: true}`);
		} else if (expiry_date === -1) {//expired
			filter.push(`expiry_date: {_lte: "now()"}`);
		} else if (expiry_date === 1) {//expired_1mon
			filter.push(`expiry_date: {_gt: "now()", _lte: "${mon}"}`);
		} else if (expiry_date === 2) {//expired_2mon
			filter.push(`expiry_date: {_gt: "${mon}", _lte: "${mon2}"}`);
		} else if (expiry_date === 3) {//expired_3mon
			filter.push(`expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}`);
		} else if (expiry_date === 4) {//expired_4mon
			filter.push(`expiry_date: {_gt: "${mon3}"}`);
		}
	}

	//
	if (date) {
		filter.push(`date: {_eq: "${date}"}`);
	}
	if (type) {
		filter.push(`type: {_eq: "${type}"}`);
	}

	//
	if (annexture_3) {
		filter.push(`annexture_3: {_eq: ${annexture_3}}`);
	}

	//
	if (issued_date) {
		filter.push(`issued_date: {_eq: "${issued_date}"}`);
	}
	if (competency_type) {
		filter.push(`competency_type: {_eq: "${competency_type}"}`);
	}
	if (course_or_module) {
		filter.push(`course_id: {_eq: ${course_or_module.id}}`);
	}

	//
	if (issued_by_id) {
		filter.push(`issued_by_id: {_eq: ${issued_by_id}}`);
	}
	if (witness_id) {
		filter.push(`witness_list: {witness_id: {_eq: ${witness_id}}}`);//TODO: add other_person_id
	}

	if(due_to) {
		filter.push(`due_to: {_eq: "${due_to}"}`);
	}

	//
	if(responsible_person) {
		filter.push(`responsible_person_id: {_eq: ${responsible_person.id}}`);
	}
	if(types) {
		filter.push(`types: {_in: ${types}}`);
	}
	if(reasons) {
		filter.push(`reasons: {_in: ${reasons}}`);
	}

	//
	if(contract_type) {
		filter.push(`contract_type: {_eq: "${contract_type}"}`);
	}
	if(payment_type) {
		filter.push(`payment_type: {_eq: "${payment_type}"}`);
	}
	if(salary_interval) {
		filter.push(`salary_interval: {_eq: "${salary_interval}"}`);
	}

	//
	if (notes) {
		filter.push(`notes: {_ilike: "%${notes}%"}`);
	}

	//
	if (desc) {
		filter.push(`desc: {_ilike: "%${desc}%"}`);
	}

	if (!filter.isEmpty()) {
		if (isContract) {
			filter = `,contract_details: {${filter.join(',')}}`;
		} else {
			filter = `,${filter.join(',')}`;
		}
	}
	//</editor-fold>

	return {filter, filterEmployee};
};