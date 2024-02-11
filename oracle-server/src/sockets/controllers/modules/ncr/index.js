const findByIdImpl = require("./findByIdImpl");
const listImpl = require('./listImpl');
const findByIdDashboardImpl = require("./findByIdDashboardImpl");

eventManager.on("ncr/findById", findByIdImpl);

eventManager.on("ncr/listByLogged", listImpl);

eventManager.on("ncr/dashboard", findByIdDashboardImpl);
