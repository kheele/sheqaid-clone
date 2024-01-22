
const findByIdImpl = require("./findByIdImpl");
const listImpl = require('./listImpl');
const findByIdDashboardImpl = require("./findByIdDashboardImpl");

eventManager.on("audits/findById", findByIdImpl);

eventManager.on("audits/listByLogged", listImpl);

eventManager.on("audits/dashboard", findByIdDashboardImpl);
