import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {asset_basic_details_maintenance_plan_fragment} from "../Fragments";

export default (
	{
		offset = 0,
		limit = 50,
		//
		name,
		reg_num,
		serial_num,
		model,
		condition,
		location,
		manufacturer,
		asset_type,
		//
		written_off = false,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	const {filter} = getVariablesAndQueryConfig({
		name,
		reg_num,
		serial_num,
		model,
		condition,
		location,
		manufacturer,
		asset_type,
		//
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
            ${filter},
            maintenance_plan_list:{id: {_is_null: false}}
          },
	        order_by: [{asset_detail:{asset_type: asc}}, {asset_detail:{name: asc}},],
	        offset: ${offset},
	        ${limit > 0 ? `limit: ${limit}` : ''}
        ) {
          ${asset_basic_details_maintenance_plan_fragment}
          ${orgs_fragment}
        }
      }
    `,
	});
	//</editor-fold>
};
