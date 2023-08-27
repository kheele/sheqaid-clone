/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import {Dates} from "utils/Dates";
import createMutationImpl from "mutations/createMutationImpl";

// 2
const mutation = graphql`
    mutation insertAssetCalibrationRecordMutation($object: asset_calibration_record_insert_input!) {
        insert_asset_calibration_record_one(
            object: $object
        ) {
            id
            asset_id
            next_calibration_interval
            next_calibration_date
            calibration_list {
		            id
                calibration_record_id
                calibrating_company
                reference_standard
                certificate_num
                calibration_date
            }
        }
    }
`;

// 3
export default async (input) => {
	const {
		asset_id,
		next_calibration_interval,
		next_calibration_date,
		calibration_list,
	} = input;

	return await createMutationImpl({mutation, input});
};
