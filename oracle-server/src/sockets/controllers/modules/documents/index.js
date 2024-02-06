require('./categories');

const findByIdImpl = require('../findByIdImpl');
const listImpl = require('../listImpl');
const {document_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "Documents",
	tbl: "sheq_documents",
	details_fragment,
};

eventManager.on("documents/findById", findByIdImpl(args));

eventManager.on("documents/listByLogged", listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {title: asc}",
	getVariablesAndQueryConfig,
}));
