/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import findByIdAssetCalibrationRecordListItem from "./findByIdAssetCalibrationRecordListItem";
import {Dates} from "utils/Dates";

// 2
const mutation = graphql`
    mutation updateAssetCalibrationRecordListItemMutation($id: asset_calibration_record_list_pk_columns_input!, $_set: asset_calibration_record_list_set_input!) {
        update_asset_calibration_record_list_by_pk(pk_columns: $id, _set: $_set) {
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
export default async (attrs) => {
	const {
		id,
		calibrating_company,
		reference_standard,
		certificate_num,
		calibration_date,
		calibration_record_id,
	} = attrs;

	const item = await findByIdAssetCalibrationRecordListItem(id);
	if (!item) return;

	if(calibration_date) {
		attrs.calibration_date = Dates.formatDateSQL(calibration_date);
	}

	return updateMutationImpl({
		mutation,
		id,
		attrs,
	});
};
