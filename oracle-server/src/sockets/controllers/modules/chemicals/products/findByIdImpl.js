const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {chemical_product_details_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdInventoryProductQuery {
                sheq_chemical_products(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${chemical_product_details_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findByIdInventoryProductQuery",
    });
}
//</editor-fold>
