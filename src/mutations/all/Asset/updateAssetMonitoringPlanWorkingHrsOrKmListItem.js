/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import findByIdAssetMonitoringPlanWorkingHrsOrKmListItem from "./findByIdAssetMonitoringPlanWorkingHrsOrKmListItem";
import {Dates} from "utils/Dates";

// 2
const mutation = graphql`
    mutation updateAssetMonitoringPlanWorkingHrsOrKmListItemMutation($id: asset_monitoring_plan_working_distance_or_time_pk_columns_input!, $_set: asset_monitoring_plan_working_distance_or_time_set_input!) {
        update_asset_monitoring_plan_working_distance_or_time_by_pk(pk_columns: $id, _set: $_set) {
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
export default async (attrs) => {
	const {
		id,
		working_hrs_or_km_opening,
		working_hrs_or_km_closing,
		working_hrs_or_km,
		date,
		monitoring_plan_id,
	} = attrs;

	const item = await findByIdAssetMonitoringPlanWorkingHrsOrKmListItem(id);
	if (!item) return;

	if(working_hrs_or_km) {
		delete attrs.working_hrs_or_km;
	}

	if(date) {
		attrs.date = Dates.formatDateSQL(date);
	}

	return updateMutationImpl({
		mutation,
		id,
		attrs,
	});
};
