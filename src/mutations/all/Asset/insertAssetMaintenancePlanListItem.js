/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import {Dates} from "utils/Dates";
import createMutationImpl from "mutations/createMutationImpl";

// 2
const mutation = graphql`
    mutation insertAssetMaintenancePlanListItemMutation($object: asset_maintenance_plan_list_insert_input!) {
        insert_asset_maintenance_plan_list_one(
            object: $object
        ) {
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
export default async (input) => {
	const {
		maintenance_plan_id,
		reason_for_service,
		service,
		service_hrs_or_km,
		service_date,
		cost,
		receipt,
		parts_used_list,
	} = input;

	if(service_date) {
		input.service_date = Dates.formatDateSQL(service_date);
	}

	return await createMutationImpl({mutation, input});
};
