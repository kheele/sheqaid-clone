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
		client_id,
		//
		exact_orgs = true,
	}
) => {
	const {variables, filter} = getVariablesAndQueryConfig({
		name,
		client_id,
		//
		exact_orgs
	});
	
	return GQLClient
		.query({
			variables,
			query: `
        query listAllToolboxTalkSubjectCategoryByLoggedQuery {
            sheq_training_toolbox_talks(
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
                  ${orgs_fragment}
            }
          }
        `,
		});
};
