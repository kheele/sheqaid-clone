/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import {Dates} from "utils/Dates";
import createMutationImpl from "mutations/createMutationImpl";

// 2
const mutation = graphql`
    mutation insertAssetMonitoringPlanFuelUsageListItemMutation($object: asset_monitoring_plan_fuel_usage_insert_input!) {
        insert_asset_monitoring_plan_fuel_usage_one(
            object: $object
        ) {
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
`;

// 3
export default async (input) => {
	const {
		refilled_fuel,
		current_hrs_or_km,
		working_hrs_or_km,
		date,
		receipt,
		cost,
		monitoring_plan_id,
	} = input;

	if(date) {
		input.date = Dates.formatDateSQL(date);
	}

	return await createMutationImpl({mutation, input});
};
