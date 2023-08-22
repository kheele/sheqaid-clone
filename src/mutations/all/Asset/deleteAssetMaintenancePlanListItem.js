/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import findByIdAssetMaintenancePlanListItem from "./findByIdAssetMaintenancePlanListItem";

// 2
const mutation = graphql`
   mutation deleteAssetMaintenancePlanListItemMutation($id: bigint!) {
      delete_asset_maintenance_plan_list_by_pk(id: $id) {
         id
      }
   }
`;

// 3
export default async (id) => {
	const item = await findByIdAssetMaintenancePlanListItem(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id,
	});
};
