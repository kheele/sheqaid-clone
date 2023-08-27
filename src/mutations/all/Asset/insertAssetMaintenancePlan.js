/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import {Dates} from "utils/Dates";
import createMutationImpl from "mutations/createMutationImpl";

// 2
const mutation = graphql`
    mutation insertAssetMaintenancePlanMutation($object: asset_maintenance_plan_insert_input!) {
        insert_asset_maintenance_plan_one(
            object: $object
        ) {
            id
            asset_id
            next_service_hrs_or_km
            plan_list {
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
                    part_id
                    plan_list_id
                    qty
                }
            }
        }
    }
`;

// 3
export default async (input) => {
	const {
		asset_id,
		next_service_hrs_or_km,
		plan_list,
	} = input;

	return await createMutationImpl({mutation, input});
};
