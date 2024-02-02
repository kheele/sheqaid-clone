let {orgs_fragment} = require("../../../graphql/Fragments");

//<editor-fold desc="listImpl">
module.exports = (
	{
		name,
		tbl,
		details_fragment,
		orgs_fragment: orgs_fragment_override,
	}
) => {
	
	orgs_fragment = orgs_fragment_override || orgs_fragment;
	
	return async (socket, id) => {
		return getGraphQLOne({
			query: `
	      query findById${name}Query {
	        ${tbl}(
	            where: {id: {_eq: ${id}},},
	        ) {
	            ${details_fragment}
	            #// ${isFunction(details_fragment) ? details_fragment(where) : details_fragment}
	            ${orgs_fragment ? orgs_fragment : ''}
	        }
	      }
	    `,
			operationName: `findById${name}Query`,
		});
	};
}
//</editor-fold>
