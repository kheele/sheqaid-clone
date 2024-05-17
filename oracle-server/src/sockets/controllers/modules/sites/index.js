const findByIdImpl = require('../findByIdImpl');
const listImpl = require('../listImpl');
const {site_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "Sites",
	tbl: "default_sites",
	details_fragment,
	orgs_fragment: `
		company {
			id
			name
		}
		client {
			id
			name
		}
		project {
			id
			name
		}
	`,
};

eventManager.on("sites/findById", findByIdImpl(args));

eventManager.on("sites/listByLogged", listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
}));
//
