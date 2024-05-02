const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('./listImpl');
const {orgs_fragment} = require("../../../../../graphql/Fragments");

const details_fragment = `
	id
  removed
  next_calibration_interval
  next_calibration_date
  asset{
    id
    ${orgs_fragment}
  }
`;

eventManager.on("assets/calibration-records/findById", findByIdImpl({
	name: "AssetCalibrationRecordList", tbl: "asset_calibration_record", details_fragment,
}));

eventManager.on("assets/calibration-records/listByLogged", listImpl);
