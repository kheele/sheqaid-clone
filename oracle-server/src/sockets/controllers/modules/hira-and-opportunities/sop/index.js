const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('./listImpl');

const {hira_sop_details_fragment: details_fragment} = require('./commons');

eventManager.on("hira-and-opportunities/sop/findById", findByIdImpl({
	name: "SOP", tbl: "hira_sop", details_fragment,
}));

eventManager.on("hira-and-opportunities/sop/listByLogged", listImpl);
//
