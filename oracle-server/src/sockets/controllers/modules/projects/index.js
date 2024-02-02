const findByIdImpl = require('../findByIdImpl');
const listImpl = require('../listImpl');
const {project_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "Projects",
	tbl: "default_projects",
	details_fragment,
};

eventManager.on("projects/findById", findByIdImpl(args));

eventManager.on("projects/listByLogged", listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
}));
//
