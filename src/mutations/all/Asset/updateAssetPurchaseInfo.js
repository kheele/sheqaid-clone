/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import findByIdAssetPurchaseInfo from "./findByIdAssetPurchaseInfo";

// 2
const mutation = graphql`
    mutation updateAssetPurchaseInfoMutation($id: asset_purchase_info_pk_columns_input!, $_set: asset_purchase_info_set_input!) {
        update_asset_purchase_info_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs, exists = false) => {
	const {
		id,
		acquisition_date,
		vendor,
		acquisition_value,
		warranty_expiry,
		reference_num,
		warranty_certificate,
	} = attrs;

	if(!exists && id) {
		const item = await findByIdAssetPurchaseInfo(id);
		if (!item) return;
	}

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdAssetPurchaseInfo(res.id));
};
