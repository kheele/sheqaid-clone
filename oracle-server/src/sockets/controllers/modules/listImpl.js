let {orgs_fragment} = require("../../../graphql/Fragments");

//<editor-fold desc="listImpl">
module.exports = (
	{
		name,
		tbl,
		details_fragment,
		orgs_fragment: orgs_fragment_override,
		where: __where,
		order_by,
		getVariablesAndQueryConfig,
	}
) => {
	return async (socket, data) => {
		console.log('data', data)
		
		let {
			offset = 0,
			limit = 50,
			//
			removed = false,
			//
			id,
			//
			//
			site_id, project_id, client_id, company_id,
			//
			exact_orgs = false,
			//
			client_filter,
			orgs_filter = [],
			//
			...others
		} = data;
		
		const {filter} = getVariablesAndQueryConfig({
			orgs_filter,
			//
			id,
			//
			...others,
			//
			site_id, project_id, client_id, company_id,
			//
			exact_orgs
		});
		
		// const whereArgs = {filter, removed, ...data, site_id, project_id, client_id, company_id};
		
		let where;
		if (__where) {
			where = __where({filter, removed});
		} else {
			where = `
			  removed: {_eq: ${removed}},
		    ${filter}
			`;
		}
		
		const __orgs_fragment = orgs_fragment_override === null ? '' : orgs_fragment_override || orgs_fragment;
		
		if (id) {
			return listGraphQL({
				query: `
        query listAll${name}ByLoggedQuery {
          ${tbl}(
            where: {
              ${filter}
            }
          ) {
              ${isFunction(details_fragment) ? details_fragment(data) : details_fragment}
              ${__orgs_fragment}
          }
        }
			`,
				operationName: `listAll${name}ByLoggedQuery`,
			});
		} else {
			
			return listGraphQL({
				query: `
	        query listAll${name}ByLoggedQuery {
	          ${tbl}(
	            where: {
	              ${where}
	            },
	            ${order_by ? `${order_by},` : ''}
	            offset: ${offset},
	            ${limit > 0 ? `limit: ${limit}` : ''}
	          ) {
                ${isFunction(details_fragment) ? details_fragment(data) : details_fragment}
	              ${__orgs_fragment}
	          }
	        }
				`,
				operationName: `listAll${name}ByLoggedQuery`,
			});
		}
	};
}
//</editor-fold>
