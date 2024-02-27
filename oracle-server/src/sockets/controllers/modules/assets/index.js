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
const listImpl = require('../listImpl');
const findByIdDashboardImpl = require("./findByIdDashboardImpl");
const {
	asset_details_fragment: details_fragment,
	asset_export_details_fragment,
	asset_basic_details_fragment,
	getVariablesAndQueryConfig,
} = require('./commons');

const args = {
	name: "Assets",
	tbl: "assets",
};

eventManager.on("assets/findById", findByIdImpl({
	...args,
	details_fragment,
}));

eventManager.on("assets/listByLogged", listImpl({
	...args,
	details_fragment: data => {
		const {data_export} = data;
		return data_export ? asset_export_details_fragment : asset_basic_details_fragment;
	},
	order_by: "order_by: [{asset_detail:{asset_type: asc}}, {asset_detail:{name: asc}},]",
	getVariablesAndQueryConfig,
}));

eventManager.on("assets/dashboard", findByIdDashboardImpl);
