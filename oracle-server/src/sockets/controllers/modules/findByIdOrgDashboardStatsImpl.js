//<editor-fold desc="listImpl">
const findByIdOrgDashboardStatsImpl = (
	{
		name,
		org,
		tbl,
		details_fragment,
		mapResults,
	}
) => {
	const operationName = `findById${org}${name}DashboardStatsQuery`;
	
	return async (socket, data) => {
		const {
			id,
			mon,
			mon2,
			mon3,
			//
			// site_id, project_id, client_id, company_id,
		} = data;
		
		// const id = site_id || project_id || client_id || company_id;
		// let tbl;
		// if(site_id) {
		// 	tbl = "default_sites";
		// } else if(project_id) {
		// 	tbl = "default_projects";
		// } else if(client_id) {
		// 	tbl = "default_clients";
		// } else {
		// 	tbl = "default_companies";
		// }
		
		let promise = getGraphQLOne({
			variables: {id, mon, mon2, mon3},
			query: `
	      query ${operationName}($id: bigint, $mon: date, $mon2: date, $mon3: date) {
	        ${tbl}(
	            where: {id: {_eq: $id},},
	        ) {
	            ${details_fragment}
	        }
	      }
	    `,
			operationName,
		});
		
		if (mapResults) {
			promise = promise.then(mapResults);
		}
		
		return promise;
	};
};
//</editor-fold>

exports.findByIdCompanyDashboardStatsImpl = ({name, details_fragment, mapResults,}) => {
	return findByIdOrgDashboardStatsImpl({
		org: "Company",
		tbl: "default_companies",
		name,
		details_fragment,
		mapResults,
	});
};

exports.findByIdClientDashboardStatsImpl = ({name, details_fragment, mapResults,}) => {
	return findByIdOrgDashboardStatsImpl({
		org: "Client",
		tbl: "default_clients",
		name,
		details_fragment,
		mapResults,
	});
};

exports.findByIdProjectDashboardStatsImpl = ({name, details_fragment, mapResults,}) => {
	return findByIdOrgDashboardStatsImpl({
		org: "Project",
		tbl: "default_projects",
		name,
		details_fragment,
		mapResults,
	});
};

exports.findByIdSiteDashboardStatsImpl = ({name, details_fragment, mapResults,}) => {
	return findByIdOrgDashboardStatsImpl({
		org: "Site",
		tbl: "default_sites",
		name,
		details_fragment,
		mapResults,
	});
};

exports.findByIdContractorDashboardStatsImpl = ({name, details_fragment, mapResults,}) => {
	return findByIdOrgDashboardStatsImpl({
		org: "Contractor",
		tbl: "default_contractors",
		name,
		details_fragment,
		mapResults,
	});
};
