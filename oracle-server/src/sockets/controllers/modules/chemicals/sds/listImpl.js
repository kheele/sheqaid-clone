const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {chemical_sds_details_fragment, getVariablesAndQueryConfig} = require('./commons');

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
        name,
        category,
        manufacturer,
        risk_level,
        //
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
        name,
        category,
        manufacturer,
        risk_level,
        //
        site_id, project_id, client_id,
        //
        exact_orgs
    });

    return listGraphQL({
        query: `
            query listAllSDSByLoggedQuery {
                sheq_chemical_sds(
                  where: {
                    removed: {_eq: ${removed}},
                    ${filter}
                  },
                  order_by: {name: asc},
                  offset: ${offset}
                  ${limit > 0 ? `,limit: ${limit}` : ''}
                ) {
                  ${chemical_sds_details_fragment}
                  ${orgs_fragment}
                }
            }
		`,
        operationName: "listAllSDSByLoggedQuery",
    });
}
//</editor-fold>