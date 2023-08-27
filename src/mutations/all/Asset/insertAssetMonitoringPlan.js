/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";

// 2
const mutation = graphql`
    mutation insertAssetMonitoringPlanMutation($object: asset_monitoring_plan_insert_input!) {
        insert_asset_monitoring_plan_one(
            object: $object
        ) {
            id
            asset_id
            fuel_usage_list {
		            id
                monitoring_plan_id
                refilled_fuel
                current_hrs_or_km
                working_hrs_or_km
                date
                receipt
                cost
            }
        }
    }
`;

// 3
export default async (input) => {
	const {
		asset_id,
		fuel_usage_list,
	} = input;

	return await createMutationImpl({mutation, input});
};
