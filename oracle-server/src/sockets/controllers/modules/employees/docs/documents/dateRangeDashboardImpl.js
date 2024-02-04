
//<editor-fold desc="findByIdOrgHRDocumentsDateRangeDashboardStatsImpl">
const findByIdOrgHRDocumentsDateRangeDashboardStatsImpl = (
	{
		org,
		org_id_key,
		name,
		type,
	}
) => {
	const operationName = `findById${org}HRDocument${name}DateRangeDashboardStatsQuery`;
	
	return async (socket, data) => {
		const {
			id,
			dates,
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
		
		return Promise.all(
			dates.map(async date => {
				const {start: dateStart, end: dateEnd} = date;
				const stats = await getGraphQLOne({
					variables: {id, dateStart, dateEnd},
					multi_queries: true,
					query: `
			      query ${operationName}($id: bigint, $dateStart: date, $dateEnd: date) {
	            #doc_list
			        list_aggregate:hr_employees_documents_aggregate(where: {
			            employee: {${org_id_key}: {_eq: $id}},
			            removed: {_eq: false}, expiry_date: {_gte: $dateStart, _lte: $dateEnd}, type: {_eq: "${type}"}
			        }){
			            aggregate{
			                count
			            }
			        }
			      }
			    `,
					operationName,
				});
				
				if (!stats) return {id, month_year: Dates.parse(dateStart).formatMonthYear(), count: 0};
				
				const {list_aggregate: {aggregate: {count}}} = stats;
				return {id, month_year: Dates.parse(dateStart).formatMonthYear(), count};
			})
		);
	};
};
//</editor-fold>

exports.findByIdCompanyHRDocumentsDateRangeDashboardStats = ({name, type}) => {
	return findByIdOrgHRDocumentsDateRangeDashboardStatsImpl({
		org: "Company",
		org_id_key: "company_id",
		name,
		type,
	});
};

exports.findByIdClientHRDocumentsDateRangeDashboardStats = ({name, type}) => {
	return findByIdOrgHRDocumentsDateRangeDashboardStatsImpl({
		org: "Client",
		org_id_key: "client_id",
		name,
		type,
	});
};

exports.findByIdProjectHRDocumentsDateRangeDashboardStats = ({name, type}) => {
	return findByIdOrgHRDocumentsDateRangeDashboardStatsImpl({
		org: "Project",
		org_id_key: "project_id",
		name,
		type,
	});
};

exports.findByIdSiteHRDocumentsDateRangeDashboardStats = ({name, type}) => {
	return findByIdOrgHRDocumentsDateRangeDashboardStatsImpl({
		org: "Site",
		org_id_key: "site_id",
		name,
		type,
	});
};

exports.findByIdContractorHRDocumentsDateRangeDashboardStats = ({name, type}) => {
	return findByIdOrgHRDocumentsDateRangeDashboardStatsImpl({
		org: "Contractor",
		org_id_key: "contractor_id",
		name,
		type,
	});
};
