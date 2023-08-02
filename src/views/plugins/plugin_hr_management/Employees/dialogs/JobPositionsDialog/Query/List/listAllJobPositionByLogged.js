import GQLClient from "graphql/GQLClient";
import {orgs_fragment} from "graphql/Fragments";
import {getVariablesAndQueryConfig} from "../Utils";

export default (
	{
		offset = 0,
		limit = 50,
		//
		name,
		job_category_id,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	const {filter} = getVariablesAndQueryConfig({
		name,
		job_category_id,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});

	return GQLClient
	.query({
		query: `
			query listAllJobPositionByLoggedClientQuery {
		    default_job_positions(
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
		          desc
		          doc
		          job_position_owner
		          employee_list_aggregate{
		            aggregate{
		              count
		            }
		          }
		          employee_external_list_aggregate{
		            aggregate{
		              count
		            }
		          }
		          ppe_list_aggregate{
		            aggregate{
		              count
		            }
		          }
		          toolbox_talk_list_aggregate{
		            aggregate{
		              count
		            }
		          }
		          training_plan_list_aggregate{
		            aggregate{
		              count
		            }
		          }
		          job_category {
		            id
		            name
		          }
		          ${orgs_fragment}
		        }
		  }
    `,
	});
};