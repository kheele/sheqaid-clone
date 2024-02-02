require('./categories');

const findByIdImpl = require('../findByIdImpl');
const listImpl = require('../listImpl');
const {company_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

// const args = {
// 	name: "Company",
// 	tbl: "default_companies",
// 	details_fragment,
// };
//
// eventManager.on("companies/findById", findByIdImpl(args));
//
// eventManager.on("companies/listByLogged", listImpl({
// 	...args,
// 	details_fragment,
// 	ord
// //er_by: "order_by: {name: asc}",
// 	getVariablesAndQueryConfig,
// }));
