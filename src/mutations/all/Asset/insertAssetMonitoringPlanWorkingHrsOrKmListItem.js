/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import {Dates} from "utils/Dates";
import createMutationImpl from "mutations/createMutationImpl";

// 2
const mutation = graphql`
    mutation insertAssetMonitoringPlanWorkingHrsOrKmListItemMutation($object: asset_monitoring_plan_working_distance_or_time_insert_input!) {
        insert_asset_monitoring_plan_working_distance_or_time_one(
            object: $object
        ) {
            id
            monitoring_plan_id
            working_hrs_or_km_opening
            working_hrs_or_km_closing
            working_hrs_or_km
            date
        }
    }
`;

// 3
export default async (input) => {
	const {
		working_hrs_or_km_opening,
		working_hrs_or_km_closing,
		working_hrs_or_km,
		date,
		monitoring_plan_id,
	} = input;

	if(working_hrs_or_km) {
		delete input.working_hrs_or_km;
	}

	if(date) {
		input.date = Dates.formatDateSQL(date);
	}

	return await createMutationImpl({mutation, input});
};
