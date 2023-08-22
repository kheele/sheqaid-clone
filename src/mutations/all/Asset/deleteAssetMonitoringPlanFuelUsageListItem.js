/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import findByIdAssetMonitoringPlanFuelUsageListItem from "./findByIdAssetMonitoringPlanFuelUsageListItem";

// 2
const mutation = graphql`
   mutation deleteAssetMonitoringPlanFuelUsageListItemMutation($id: bigint!) {
      delete_asset_monitoring_plan_fuel_usage_by_pk(id: $id) {
         id
      }
   }
`;

// 3
export default async (id) => {
	const item = await findByIdAssetMonitoringPlanFuelUsageListItem(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id,
	});
};
