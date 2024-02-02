const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {chemical_sds_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "ChemicalSDS",
	tbl: "sheq_chemical_sds",
	details_fragment,
};

eventManager.on("chemicals/sds/findById", findByIdImpl(args));

eventManager.on("chemicals/sds/listByLogged", listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
}));
//
