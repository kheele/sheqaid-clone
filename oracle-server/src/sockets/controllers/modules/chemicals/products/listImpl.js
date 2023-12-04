const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {chemical_product_details_fragment, getVariablesAndQueryConfig} = require('./commons');

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
        manufacturer,
        type,
        category,
        physical_state,
        risk_level,
        is_stable,
        is_hazardous,
        is_combustible,
        is_flammable,
        //
        date_range,
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
        manufacturer,
        type,
        category,
        physical_state,
        risk_level,
        is_stable,
        is_hazardous,
        is_combustible,
        is_flammable,
        //
        date_range,
        //
        site_id, project_id, client_id,
        //
        exact_orgs
    });

    return listGraphQL({
        query: `
            query listAllInventoryProductsByLoggedQuery {
                sheq_chemical_products(
                  where: {
                    removed: {_eq: ${removed}},
                    ${filter}
                  },
                  order_by: {name: asc},
                  offset: ${offset}
                  ${limit > 0 ? `,limit: ${limit}` : ''}
                ) {
                  ${chemical_product_details_fragment}
                  ${orgs_fragment}
                }
            }
		`,
        operationName: "listAllInventoryProductsByLoggedQuery",
    });
}
//</editor-fold>