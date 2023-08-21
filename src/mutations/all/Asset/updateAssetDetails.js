/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import findByIdAssetDetails from "./findByIdAssetDetails";

// 2
const mutation = graphql`
    mutation updateAssetDetailsMutation($id: asset_details_pk_columns_input!, $_set: asset_details_set_input!) {
        update_asset_details_by_pk(pk_columns: $id, _set: $_set) {
            id
            owning_company
            name
            asset_type
            desc
            manufacturer
            model
            reg_num
            serial_num
            location
            toolkit
            condition
            barcode
            qr_code
            notes
        }
    }
`;

// 3
export default async (attrs, exists = false) => {
	const {
		id,
		owning_company,
		name,
		asset_type,
		desc,
		manufacturer,
		model,
		reg_num,
		serial_num,
		location,
		toolkit,
		condition,
		barcode,
		qr_code,
		notes,
	} = attrs;

	if(!exists && id) {
		const item = await findByIdAssetDetails(id);
		if (!item) return;
	}

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	});
};
