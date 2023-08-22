/* eslint-disable camelcase */

import findByIdAssetCalibrationRecordListItem from "./findByIdAssetCalibrationRecordListItem";
import updateAssetCalibrationRecordListItem from "./updateAssetCalibrationRecordListItem";
import insertAssetCalibrationRecordListItem from "./insertAssetCalibrationRecordListItem";

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

	if(id) {
		const item = await findByIdAssetCalibrationRecordListItem(id);
		if (!item) return;

		return updateAssetCalibrationRecordListItem(attrs, true);
	}

	delete attrs.id;

	return insertAssetCalibrationRecordListItem(attrs);
};
