//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		view,
		//
		// status,
		
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filterIncidentInvestigation = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	
	let filter = [];
	
	if (id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if (view === "Incident Investigation") {
			if (employee_id) {
				filterIncidentInvestigation.push(`id: {_eq: ${employee_id}}`);
			}
			filterIncidentInvestigation = `,${filterIncidentInvestigation.join(',')}`;
		} else {
			if (employee_id) {
				filterIncidentInvestigation = `,employee_id: {_eq: ${employee_id}}`;
			} else {
				filterIncidentInvestigation = `,employee: {${filterIncidentInvestigation.join(',')}}`;
			}
		}
	}
	
	if (!filter.isEmpty()) {
		filter = `,${filter.join(',')}`;
	}
	//</editor-fold>
	
	return {filter, filterIncidentInvestigation};
};
//</editor-fold>
