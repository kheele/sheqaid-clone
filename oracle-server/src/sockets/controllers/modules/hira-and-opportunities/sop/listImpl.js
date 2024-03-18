const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {hira_sop_details_fragment, getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    // console.log('data', data)

    let {
        offset = 0,
        limit = 50,
        //
        removed = false,
        id,
        //
        category,
        risk_level,
        location,
        prepared_by_list,
        prepared_by_id,
        //
        date_created_range,
        date_revised_range,
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
        category,
        risk_level,
        location,
        prepared_by_list,
        prepared_by_id,
        //
        date_created_range,
        date_revised_range,
        //
        logged_employee_id,
        site_id, project_id, client_id,
        //
        exact_orgs
    });

    return listGraphQL({
        query: `
            query listAllSOPByLoggedQuery {
                hira_sop(
                  where: {
                    removed: {_eq: ${removed}},
                    ${filter}
                  },
                  #order_by: {name: asc},
                  offset: ${offset}
                  ${limit > 0 ? `,limit: ${limit}` : ''}
                ) {
                  ${hira_sop_details_fragment}
                  ${orgs_fragment}
                }
            }
		`,
        operationName: "listAllSOPByLoggedQuery",
    });
}
//</editor-fold>
