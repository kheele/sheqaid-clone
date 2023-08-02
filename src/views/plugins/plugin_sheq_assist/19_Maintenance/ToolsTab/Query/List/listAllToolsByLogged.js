import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {asset_details_fragment} from "../Fragments";

export default (
	{
		offset = 0,
		limit = 50,
		//
		written_off = false,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	const {filter} = getVariablesAndQueryConfig({
		written_off,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});

	//<editor-fold desc="ByEach">
	return GQLClient
	.query({
		query: `
      query listAllToolsByLoggedQuery {
        assets(
          where: {
            ${filter}
          },
	        order_by: [{asset_detail:{asset_type: asc}}, {asset_detail:{name: asc}},],
	        offset: ${offset},
	        ${limit > 0 ? `limit: ${limit}` : ''}
        ) {
          ${asset_details_fragment}
          ${orgs_fragment}
          }
      }
    `,
	});
	//</editor-fold>
};