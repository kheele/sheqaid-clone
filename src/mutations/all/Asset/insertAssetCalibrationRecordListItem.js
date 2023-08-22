/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import {Dates} from "utils/Dates";
import createMutationImpl from "mutations/createMutationImpl";

// 2
const mutation = graphql`
    mutation insertAssetCalibrationRecordListItemMutation($object: asset_calibration_record_list_insert_input!) {
        insert_asset_calibration_record_list_one(
            object: $object
        ) {
            id
            calibration_record_id
		        calibrating_company
		        reference_standard
		        certificate_num
		        calibration_date
        }
    }
`;

// 3
export default async (input) => {
	const {
		calibrating_company,
		reference_standard,
		certificate_num,
		calibration_date,
		calibration_record_id,
	} = input;

	if(calibration_date) {
		input.calibration_date = Dates.formatDateSQL(calibration_date);
	}

	return await createMutationImpl({mutation, input});
};
