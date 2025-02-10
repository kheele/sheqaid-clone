import GQLClient from "graphql/GQLClient";
import {orgs_no_project_and_site_fragment} from "graphql/Fragments";
import {getVariablesAndQueryConfig} from "../Utils";

export default (
	{
		offset = 0,
		limit = 50,
		//
		name,
		//
		client_id,
		//
		exact_orgs_company = true,
	}
) => {
	const {filter} = getVariablesAndQueryConfig({
		name,
		//
		client_id,
		//
		exact_orgs_company
	});

	return GQLClient
	.query({
		query: `
			query listAllSectorByLoggedQuery {
				default_sectors(
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
				  sector_owner
				  training_course_list_aggregate{
					aggregate{
					  count
					}
				  }
				  company_list_aggregate{
					aggregate{
					  count
					}
				  }
				  client_list_aggregate{
					aggregate{
					  count
					}
				  }
				  ${orgs_no_project_and_site_fragment}
	          	}
			}
    	`,
	});
};