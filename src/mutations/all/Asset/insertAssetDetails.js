/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";

// 2
const mutation = graphql`
    mutation insertAssetDetailsMutation($object: asset_details_insert_input!) {
        insert_asset_details_one(
            object: $object
        ) {
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
export default async (input) => {
	const {
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
	} = input;

	return await createMutationImpl({mutation, input});
};
