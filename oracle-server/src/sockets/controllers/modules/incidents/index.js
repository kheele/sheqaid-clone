require('./incidents-quick');
require('./cause-analysis');
require('./corrective-actions');
require('./investigations');

const findByIdImpl = require("./findByIdImpl");
const listImpl = require("./listImpl");
const findByIdDashboardImpl = require("./findByIdDashboardImpl");

eventManager.on("incidents/findById", findByIdImpl);

eventManager.on("incidents/listByLogged", listImpl);

eventManager.on("incidents/dashboard", findByIdDashboardImpl);
