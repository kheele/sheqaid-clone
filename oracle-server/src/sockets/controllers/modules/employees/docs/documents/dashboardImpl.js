const {
	findByIdCompanyDashboardStatsImpl,
	findByIdClientDashboardStatsImpl,
	findByIdProjectDashboardStatsImpl,
	findByIdSiteDashboardStatsImpl,
	findByIdContractorDashboardStatsImpl,
} = require("../../../findByIdOrgDashboardStatsImpl");

//<editor-fold desc="getFragment">
const getFragment = type => {
	return `
    employee_list_aggregate {
        nodes {
            id

            #document_list
            list_active_aggregate:document_list_aggregate(where: {removed: {_eq: false}, type: {_eq: "${type}"}}){
                aggregate{
                    count
                }
            }
            list_removed_aggregate:document_list_aggregate(where: {removed: {_eq: true}, type: {_eq: "${type}"}}){
                aggregate{
                    count
                }
            }
            list_no_expiry_aggregate:document_list_aggregate(where: {
                removed: {_eq: false}, expiry_date: {_is_null: true}, type: {_eq: "${type}"}
            }){
                aggregate{
                    count
                }
            }
            list_expired_aggregate:document_list_aggregate(where: {
                removed: {_eq: false}, expiry_date: {_lte: "now()"}, type: {_eq: "${type}"}
            }){
                aggregate{
                    count
                }
            }
            list_mon_expiry_aggregate:document_list_aggregate(where: {
                removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}, type: {_eq: "${type}"}
            }){
                aggregate{
                    count
                }
            }
            list_2mon_expiry_aggregate:document_list_aggregate(where: {
                removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}, type: {_eq: "${type}"}
            }){
                aggregate{
                    count
                }
            }
            list_3mon_expiry_aggregate:document_list_aggregate(where: {
                removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}, type: {_eq: "${type}"}
            }){
                aggregate{
                    count
                }
            }
            list_4mon_expiry_aggregate:document_list_aggregate(where: {
                removed: {_eq: false}, expiry_date: {_gt: $mon3}, type: {_eq: "${type}"}
            }){
                aggregate{
                    count
                }
            }
        }
    }
	`;
};
//</editor-fold>

const mapResults = id => {
	return res => {
		console.log('findByIdOrgHRDocumentDashboardStatsQuery', id, res)
		const {employee_list_aggregate: {nodes}} = res;
		
		const convertAggregates = (key, nodes) => ({
			aggregate: {
				count: nodes.map(({[`${key}_aggregate`]: {aggregate: {count}}}) => count).reduce((a, b) => a + b, 0),
			}
		});
		
		return {
			id,
			data: {
				list_active_aggregate: convertAggregates('list_active', nodes),
				list_removed_aggregate: convertAggregates('list_removed', nodes),
				list_no_expiry_aggregate: convertAggregates('list_no_expiry', nodes),
				list_expired_aggregate: convertAggregates('list_expired', nodes),
				list_mon_expiry_aggregate: convertAggregates('list_mon_expiry', nodes),
				list_2mon_expiry_aggregate: convertAggregates('list_2mon_expiry', nodes),
				list_3mon_expiry_aggregate: convertAggregates('list_3mon_expiry', nodes),
				list_4mon_expiry_aggregate: convertAggregates('list_4mon_expiry', nodes),
			}
		};
	};
};

//<editor-fold desc="findByIdCompanyDashboardStatsImpl">
module.exports.findByIdCompanyDashboardStats = ({name, type}) => {
	return findByIdCompanyDashboardStatsImpl({
		name: `HR${name}`,
		details_fragment: getFragment(type),
		mapResults,
	});
}
//</editor-fold>

//<editor-fold desc="findByIdClientDashboardStatsImpl">
module.exports.findByIdClientDashboardStats = ({name, type}) => {
	return findByIdClientDashboardStatsImpl({
		name: `HR${name}`,
		details_fragment: getFragment(type),
		mapResults,
	});
}
//</editor-fold>

//<editor-fold desc="findByIdProjectDashboardStatsImpl">
module.exports.findByIdProjectDashboardStats = ({name, type}) => {
	return findByIdProjectDashboardStatsImpl({
		name: `HR${name}`,
		details_fragment: getFragment(type),
		mapResults,
	});
}
//</editor-fold>

//<editor-fold desc="findByIdSiteDashboardStatsImpl">
module.exports.findByIdSiteDashboardStats = ({name, type}) => {
	return findByIdSiteDashboardStatsImpl({
		name: `HR${name}`,
		details_fragment: getFragment(type),
		mapResults,
	});
}
//</editor-fold>

//<editor-fold desc="findByIdContractorDashboardStatsImpl">
module.exports.findByIdContractorDashboardStats = ({name, type}) => {
	return findByIdContractorDashboardStatsImpl({
		name: `HR${name}`,
		details_fragment: getFragment(type),
		mapResults,
	});
}
//</editor-fold>
