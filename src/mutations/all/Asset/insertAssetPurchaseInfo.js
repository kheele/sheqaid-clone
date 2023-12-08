/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import findByIdAssetPurchaseInfo from "./findByIdAssetPurchaseInfo";

// 2
const mutation = graphql`
    mutation insertAssetPurchaseInfoMutation($object: asset_purchase_info_insert_input!) {
        insert_asset_purchase_info_one(
            object: $object
        ) {
            id
        }
    }
`;

// 3
export default async (input) => {
	const {
		acquisition_date,
		vendor,
		acquisition_value,
		warranty_expiry,
		reference_num,
		warranty_certificate,
	} = input;

	return await createMutationImpl({mutation, input}).
    then(res => res && findByIdAssetPurchaseInfo(res.id));
};
