const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');
const findByIdDashboardImpl = require("./findByIdDashboardImpl");

eventManager.on("employees/documents/prdp/findById", findByIdImpl);

eventManager.on("employees/documents/prdp/listByLogged", listImpl);

eventManager.on("employees/documents/prdp/dashboard", findByIdDashboardImpl);