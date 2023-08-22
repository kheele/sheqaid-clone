/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import findByIdAssetMonitoringPlanWorkingHrsOrKmListItem from "./findByIdAssetMonitoringPlanWorkingHrsOrKmListItem";

// 2
const mutation = graphql`
   mutation deleteAssetMonitoringPlanWorkingHrsOrKmListItemMutation($id: bigint!) {
      delete_asset_monitoring_plan_working_distance_or_time_by_pk(id: $id) {
         id
      }
   }
`;

// 3
export default async (id) => {
	const item = await findByIdAssetMonitoringPlanWorkingHrsOrKmListItem(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id,
	});
};
