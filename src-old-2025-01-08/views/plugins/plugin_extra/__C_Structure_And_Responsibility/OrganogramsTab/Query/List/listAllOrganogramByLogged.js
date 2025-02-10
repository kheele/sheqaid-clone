import GQLClient from "graphql/GQLClient";
import {orgs_fragment} from "graphql/Fragments";
import {organogram_details_fragment} from "../Fragments";
import {getVariablesAndQueryConfig} from "../Utils";

export default (
	{
		offset = 0,
		limit = 50,
		//
		removed = false,
		name,
		type,
		target,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = true,
	}
) => {
	const {filter} = getVariablesAndQueryConfig({
		name,
		type,
		target,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});

	return GQLClient
	.query({
		query: `
      query listAllActiveOrganogramByLoggedQuery {
        sheq_organograms(
          where: {
            removed: {_eq: ${removed}},
            ${filter}
          },
          offset: ${offset}
          ${limit > 0 ? `,limit: ${limit}` : ''}
        ) {
          ${organogram_details_fragment}
          ${orgs_fragment}
        }
      }
    `,
	});
};