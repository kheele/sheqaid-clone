require('./calibration-record-list');
require('./depreciation');
require('./details');
require('./docs');
require('./maintenance-plan-list');
require('./monitoring-plan-fuel-usage-list');
require('./monitoring-plan-working-hrs-or-km-list');
require('./photos');
require('./purchase-info');
require('./vehicle-forms');

const findByIdImpl = require("../findByIdImpl");
const listImpl = require('./listImpl');
const findByIdDashboardImpl = require("./findByIdDashboardImpl");
const {asset_details_fragment: details_fragment} = require('./commons');

eventManager.on("assets/findById", findByIdImpl({
	name: "Asset", tbl: "assets", details_fragment,
}));

eventManager.on("assets/listByLogged", listImpl);

eventManager.on("assets/dashboard", findByIdDashboardImpl);
