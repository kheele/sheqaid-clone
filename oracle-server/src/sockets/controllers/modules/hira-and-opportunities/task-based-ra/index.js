const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {hira_taskbased_ra_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "TaskBaseRiskAssessments",
	tbl: "hira_taskbased_ra",
	details_fragment,
};

eventManager.on("hira-and-opportunities/task-based-ra/findById", findByIdImpl(args));

eventManager.on("hira-and-opportunities/task-based-ra/listByLogged", listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {activity: asc}",
	getVariablesAndQueryConfig,
}));
