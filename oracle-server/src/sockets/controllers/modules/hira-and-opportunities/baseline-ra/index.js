const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {hira_baseline_ra_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "BaselineRiskAssessments",
	tbl: "hira_baseline_ra",
	details_fragment,
};

eventManager.on("hira-and-opportunities/baseline-ra/findById", findByIdImpl(args));

eventManager.on("hira-and-opportunities/baseline-ra/listByLogged", listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {activity: asc}",
	getVariablesAndQueryConfig,
}));
