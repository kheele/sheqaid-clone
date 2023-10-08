import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {coida_claims_fragment} from "../Fragments";

export default (
	{
		offset = 0,
		limit = 50,
		//
		employee,
		occupation,
		status,
		claim_status,
		//
		removed = false,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
		data_export = false,
	}
) => {
	const {filter} = getVariablesAndQueryConfig({
		employee,
		occupation,
		status,
		claim_status,
		//
		removed,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});

	//<editor-fold desc="ByEach">
	return GQLClient
	.query({
		query: `
      query listAllClaimsClientByLoggedQuery {
        coida_claims(
          where: {
            ${filter}
          },
	        order_by: {accident_date: desc},
	        offset: ${offset},
	        ${limit > 0 ? `limit: ${limit}` : ''}
        ) {
          ${coida_claims_fragment}
          ${orgs_fragment}
        }
      }
    `,
	});
	//</editor-fold>
};
