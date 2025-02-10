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
        query listAllToolboxTalkSubjectByLoggedQuery {
            sheq_training_toolbox_talk_subjects(
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
              register_list{
                id
                date
                employee_list{
                  employee{
                    id
                    full_name
                  }
                  signature
                  date
                }
              }
              ${orgs_fragment}
            }
          }
        `,
		});
};
