const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('./listImpl');

const details_fragment = `
	id
  calibration_record_id
  calibrating_company
  reference_standard
  certificate_num
  calibration_date
`;

eventManager.on("assets/calibration-record-list/findById", findByIdImpl({
	name: "AssetCalibrationRecordList", tbl: "asset_calibration_record_list", details_fragment,
}));

eventManager.on("assets/calibration-record-list/listByLogged", listImpl);
