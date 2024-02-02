const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {chemical_hazchem_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "ChemicalHazchemSheet",
	tbl: "sheq_chemical_hazchem_sheets",
	details_fragment,
};

eventManager.on("chemicals/hazchem-sheets/findById", findByIdImpl(args));

eventManager.on("chemicals/hazchem-sheets/listByLogged", listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
}));
//
