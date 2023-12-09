import GQLClient from "graphql/GQLClient";
import {orgs_fragment} from "graphql/Fragments";
import {getVariablesAndQueryConfig} from "../Utils";

export default (
	{
		offset = 0,
		limit = 50,
		//
		removed = false,
		//
		name,
		job_category_id,
		//
		site_id, project_id, client_id,
	}
) => {
	const {filter} = getVariablesAndQueryConfig({
		name,
		job_category_id,
		//
		site_id, project_id, client_id,
	});

	return GQLClient
	.query({
		query: `
			query listAllJobPositionByLoggedClientQuery {
		    default_job_positions(
		      where: {
		      	removed: {_eq: ${removed}},
				${filter}
			  }, 
		      order_by: {name: asc},
			  offset: ${offset}
			  ${limit > 0 ? `,limit: ${limit}` : ''}
		    ) {
		          
		          ${orgs_fragment}
		        }
		  }
    `,
	});
};