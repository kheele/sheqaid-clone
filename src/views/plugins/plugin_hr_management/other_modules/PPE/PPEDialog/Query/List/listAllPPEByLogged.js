import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {ppe_details_fragment} from "../Fragments";
import {orgs_fragment} from "graphql/Fragments";

export default (
	{
		offset = 0,
		limit = 50,
		//
		// written_off = false,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	const {filter} = getVariablesAndQueryConfig({
		// written_off,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});

	//<editor-fold desc="ByGroup">
	return GQLClient
	.query({
		query: `
      query listAllPPEByLoggedQuery {
        ppe(
          where: {
            ${filter}
          },
	        order_by: {name: asc},
	        offset: ${offset},
	        limit: ${limit}
        ) {
          ${ppe_details_fragment}
          ${orgs_fragment}
          }
      }
    `,
	});//.then(fillNullLists);
	//</editor-fold>
};