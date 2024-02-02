const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('./listImpl');

const {hira_swp_details_fragment: details_fragment} = require('./commons');

eventManager.on("hira-and-opportunities/swp/findById", findByIdImpl({
	name: "SWP", tbl: "hira_swp", details_fragment,
}));

eventManager.on("hira-and-opportunities/swp/listByLogged", listImpl);
//
