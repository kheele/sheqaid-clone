let {orgs_fragment} = require("../../../graphql/Fragments");
const {audit_details_fragment} = require("./audits/commons");

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
			written_off = false,
			//
			id,
			id_list,
			//
			logged_employee_id,
			site_id, project_id, client_id, company_id,
			//
			exact_orgs = false,
			//
			client_filter,
			orgs_filter = [],
			//
			...others
		} = data;
		
		let remove_args;
		if ('written_off' in data) {
			remove_args = {key: 'written_off', value: written_off};
		} else {
			remove_args = {key: 'removed', value: removed};
		}
		
		const {filter} = getVariablesAndQueryConfig({
			orgs_filter,
			//
			id,
			//
			...others,
			//
			logged_employee_id,
			site_id, project_id, client_id, company_id,
			//
			exact_orgs
		});
		
		// const whereArgs = {filter, [remove_args.key]: remove_args.value, ...data, site_id, project_id, client_id, company_id};
		
		let where;
		if (__where) {
			where = __where({filter, [remove_args.key]: remove_args.value});
		} else {
			where = `
			  ${remove_args.key}: {_eq: ${remove_args.value}},
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
		} else if (id_list) {
			return listGraphQL({
				query: `
					query listByIds${name}ByLoggedQuery {
		        ${tbl}(
		          where: {
		            id: {_in: [${id_list.join(',')}]}
		          },
	            ${order_by ? `${order_by},` : ''}
		        ) {
		          ${isFunction(details_fragment) ? details_fragment(data) : details_fragment}
	            ${__orgs_fragment}
		        }
		      }
				`,
				operationName: `listByIds${name}ByLoggedQuery`,
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
