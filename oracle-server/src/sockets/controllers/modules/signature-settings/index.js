const createImpl = require("./createImpl");
const findByIdImpl = require("./findByIdImpl");
const listImpl = require('./listImpl');
const findByIdDashboardImpl = require("./findByIdDashboardImpl");

eventManager.on("signature-settings/create", createImpl);

eventManager.on("signature-settings/findById", findByIdImpl);

eventManager.on("signature-settings/listByLogged", listImpl);

eventManager.on("signature-settings/dashboard", findByIdDashboardImpl);
