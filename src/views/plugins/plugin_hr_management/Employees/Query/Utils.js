import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
	{
		incContractors = false,
		department_id,
		job_position_id,
		team_id,
		supervisor_id,
		name,
		id_or_pass_num,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgsFilter({site_id, project_id, client_id, exact_orgs, incContractors});

	if (department_id) {
		filter.push(`department_id: {_eq: ${department_id}}`);
	}
	if (job_position_id) {
		filter.push(`job_position_id: {_eq: ${job_position_id}}`);
	}
	if (team_id) {
		filter.push(`team_id: {_eq: ${team_id}}`);
	}
	if (supervisor_id) {
		filter.push(`supervisor_id: {_eq: ${supervisor_id}}`);
	}

	if (name || id_or_pass_num) {
		if (filter.anyMatch(v => v.trim().startsWith('_or'))) {
			if (name && id_or_pass_num) {
				filter.push(`_and: {
					_or: [
						{fname: {_ilike: "%${name}%"}}, {lname: {_ilike: "%${name}%"}},
						{id_num: {_eq: "${id_or_pass_num}"}}, {passport_num: {_ilike: "${id_or_pass_num}"}}
					]
				}`);
			} else if(name) {
				filter.push(`_and: {
					_or: [
						{fname: {_ilike: "%${name}%"}}, {lname: {_ilike: "%${name}%"}}
					]
				}`);
			} else if (id_or_pass_num) {
				filter.push(`_and: {
					_or: [
						{id_num: {_eq: "${id_or_pass_num}"}}, {passport_num: {_ilike: "${id_or_pass_num}"}}
					]
				}`);
			}
		} else {
			if (name && id_or_pass_num) {
				filter.push(`_or: [
					{fname: {_ilike: "%${name}%"}}, {lname: {_ilike: "%${name}%"}},
					{id_num: {_eq: "${id_or_pass_num}"}}, {passport_num: {_ilike: "${id_or_pass_num}"}}
				]`);
			} else if(name) {
				filter.push(`_or: [
					{fname: {_ilike: "%${name}%"}}, {lname: {_ilike: "%${name}%"}}
				]`);
			} else if (id_or_pass_num) {
				filter.push(`_or: [
					{id_num: {_eq: "${id_or_pass_num}"}}, {passport_num: {_ilike: "${id_or_pass_num}"}}
				]`);
			}
		}
	}

	filter = filter.join(',');
	//</editor-fold>

	return {filter};
};