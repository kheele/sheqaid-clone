const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {chemical_sds_details_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
	return getGraphQLOne({
		query: `
            query findByIdSDSQuery {
                sheq_chemical_sds(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${chemical_sds_details_fragment}
                    ${orgs_fragment}
                }
            }
        `,
		operationName: "findByIdSDSQuery",
	});
}
//</editor-fold>
