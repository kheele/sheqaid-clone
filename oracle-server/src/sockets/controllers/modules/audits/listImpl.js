const {orgs_fragment} = require("../../../../graphql/Fragments");
const {audit_details_fragment, getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
	console.log('data', data)
	
	let {
		offset = 0,
		limit = 50,
		//
		removed = false,
		//
		id,
		//
		representative_list,
		representative_id,
		auditor,
		type,
		scope,
		date_range,
		//
		logged_employee_id,
		site_id, project_id, client_id,
		//
		exact_orgs = false,
		//
		client_filter,
		orgs_filter = [],
	} = data;
	
	const {filter} = getVariablesAndQueryConfig({
		orgs_filter,
		//
		id,
		//
		representative_list,
		representative_id,
		auditor,
		type,
		scope,
		date_range,
		//
		logged_employee_id,
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	if (id) {
		return listGraphQL({
			query: `
        query listAllAuditByLoggedQuery {
            sheq_compliance_audits(
              where: {
                  ${filter}
              }
            ) {
                ${audit_details_fragment}
                ${orgs_fragment}
            }
        }
			`,
			operationName: "listAllAuditByLoggedQuery",
		});
	} else {
		return listGraphQL({
			query: `
        query listAllAuditByLoggedQuery {
            sheq_compliance_audits(
              where: {
                  removed: {_eq: ${removed}},
                  ${filter}
              },
              order_by: {date: desc},
              offset: ${offset},
              ${limit > 0 ? `limit: ${limit}` : ''}
            ) {
                ${audit_details_fragment}
                ${orgs_fragment}
            }
        }
			`,
			operationName: "listAllAuditByLoggedQuery",
		});
	}
}
//</editor-fold>
