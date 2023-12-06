const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');
const findByIdDashboardImpl = require("./findByIdDashboardImpl");

eventManager.on("employees/documents/id-or-passports/findById", findByIdImpl);

eventManager.on("employees/documents/id-or-passports/listByLogged", listImpl);

eventManager.on("employees/documents/id-or-passports/dashboard", findByIdDashboardImpl);