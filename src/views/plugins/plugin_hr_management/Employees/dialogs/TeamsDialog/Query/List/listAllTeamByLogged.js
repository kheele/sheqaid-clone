import GQLClient from "graphql/GQLClient";
import {orgs_fragment} from "graphql/Fragments";
import {getVariablesAndQueryConfig} from "../Utils";

export default (
	{
		offset = 0,
		limit = 50,
		//
		name,
		supervisor_id,
		employee_id,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = true,
	}
) => {
	const {filter} = getVariablesAndQueryConfig({
		name,
		supervisor_id,
		employee_id,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});

	return GQLClient
	.query({
		query: `
			query listAllTeamByLoggedClientQuery {
		    default_teams(
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
		          status
		
		          supervisor {
		            id
		            fname
		            lname
		            email
		            phone
		            job_position{
		              id
		              name
		            }
		          }
		          employee_list_aggregate{
		            aggregate{
		              count
		            }
		          }
		          ppe_list_aggregate{
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