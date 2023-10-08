import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {coida_claims_employer_details_fragment} from "../Fragments";

export default (
	{
		offset = 0,
		limit = 50,
		//
		company_name,
		//
		removed = false,
		//
		client_id,
		//
		exact_orgs = false,
		data_export = false,
	}
) => {
	const {filter} = getVariablesAndQueryConfig({
		company_name,
		//
		removed,
		//
		client_id,
		//
		exact_orgs
	});

	//<editor-fold desc="ByEach">
	return GQLClient
	.query({
		query: `
      query listAllClaimsEmployerDetailsByLoggedQuery {
        coida_claims_employer_details(
          where: {
            ${filter}
          },
	        order_by: {company_name: asc},
	        offset: ${offset},
	        ${limit > 0 ? `limit: ${limit}` : ''}
        ) {
          ${coida_claims_employer_details_fragment}
          ${orgs_fragment}
        }
      }
    `,
	});
	//</editor-fold>
};
