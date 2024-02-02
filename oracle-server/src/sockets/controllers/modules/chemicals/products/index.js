const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {chemical_product_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "ChemicalInventoryProduct",
	tbl: "sheq_chemical_products",
	details_fragment,
};

eventManager.on("chemicals/products/findById", findByIdImpl(args));

eventManager.on("chemicals/products/listByLogged", listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
}));
//
