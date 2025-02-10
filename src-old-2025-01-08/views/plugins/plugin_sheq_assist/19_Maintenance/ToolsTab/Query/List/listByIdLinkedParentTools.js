import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {asset_basic_details_fragment, asset_details_fragment, asset_export_details_fragment} from "../Fragments";

export default (
	{
		id
	}
) => {
	//<editor-fold desc="ByEach">
	return GQLClient
	.query({
		query: `
      query listByIdLinkedParentToolsQuery {
        assets(
          where: {
            asset_children_list: {
              child_asset_id: {_eq: ${id}}
            }
          },
	        order_by: [{asset_detail:{asset_type: asc}}, {asset_detail:{name: asc}},]
        ) {
          ${asset_basic_details_fragment}
          ${orgs_fragment}
        }
      }
    `,
	});
	//</editor-fold>
};
