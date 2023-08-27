/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import findByIdAssetMaintenancePlanListItem from "./findByIdAssetMaintenancePlanListItem";
import {Dates} from "utils/Dates";

// 2
const mutation = graphql`
    mutation updateAssetMaintenancePlanListItemMutation($id: asset_maintenance_plan_list_pk_columns_input!, $_set: asset_maintenance_plan_list_set_input!) {
        update_asset_maintenance_plan_list_by_pk(pk_columns: $id, _set: $_set) {
            id
            maintenance_plan_id
            reason_for_service
            service
            service_hrs_or_km
            service_date
            cost
            receipt
            parts_used_list{
                id
                plan_list_id
                qty
                part{
                    id
                    asset_id
                    asset_type
                    name
                }
            }
        }
    }
`;

// 3
export default async (attrs) => {
	const {
		id,
		reason_for_service,
		service,
		service_hrs_or_km,
		service_date,
		parts_used,
		cost,
		receipt,
		maintenance_plan_id,
	} = attrs;

	const item = await findByIdAssetMaintenancePlanListItem(id);
	if (!item) return;

	if(service_date) {
		attrs.service_date = Dates.formatDateSQL(service_date);
	}

	return updateMutationImpl({
		mutation,
		id,
		attrs,
	});
};
