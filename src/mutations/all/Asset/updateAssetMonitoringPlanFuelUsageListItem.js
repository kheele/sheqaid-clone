/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import findByIdAssetMonitoringPlanFuelUsageListItem from "./findByIdAssetMonitoringPlanFuelUsageListItem";
import {Dates} from "utils/Dates";

// 2
const mutation = graphql`
    mutation updateAssetMonitoringPlanFuelUsageListItemMutation($id: asset_monitoring_plan_fuel_usage_pk_columns_input!, $_set: asset_monitoring_plan_fuel_usage_set_input!) {
        update_asset_monitoring_plan_fuel_usage_by_pk(pk_columns: $id, _set: $_set) {
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
export default async (attrs) => {
	const {
		id,
		refilled_fuel,
		current_hrs_or_km,
		working_hrs_or_km,
		date,
		receipt,
		cost,
		monitoring_plan_id,
	} = attrs;

	const item = await findByIdAssetMonitoringPlanFuelUsageListItem(id);
	if (!item) return;

	if(date) {
		attrs.date = Dates.formatDateSQL(date);
	}

	return updateMutationImpl({
		mutation,
		id,
		attrs,
	});
};
