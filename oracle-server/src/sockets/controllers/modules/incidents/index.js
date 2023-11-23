require('./incidents-quick');
require('./corrective-actions');
require('./investigations');

const findByIdImpl = require("./findByIdImpl");
const listImpl = require("./listImpl");

eventManager.on("incidents/findById", findByIdImpl);

eventManager.on("incidents/listByLogged", listImpl);

