import GQLClient from "graphql/GQLClient";
import {orgs_fragment} from "graphql/Fragments";
import {getVariablesAndQueryConfig} from "../Utils";

export default (
	{
		offset = 0,
		limit = 50,
		//
		name,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	const {filter} = getVariablesAndQueryConfig({
		name,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});

	return GQLClient
	.query({
		query: `
			query listAllDepartmentByLoggedClientQuery {
		    default_departments(
		      where: {
            ${filter}
          }, 
		      order_by: {name: asc},
          offset: ${offset}
          ${limit > 0 ? `,limit: ${limit}` : ''}
		    ) {
		          id
		          created_at
		          name
		          ppe_list_aggregate{
		            aggregate{
		              count
		            }
		          }
		          employee_list_aggregate{
		            aggregate{
		              count
		            }
		          }
		          responsible_document_list_aggregate{
		            aggregate{
		              count
		            }
		          }
		          ${orgs_fragment}
		    }
		  }
    `,
	});
};