const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');
const findByIdDashboardImpl = require('./findByIdDashboardImpl');

eventManager.on("incidents-quick/findById", findByIdImpl);

eventManager.on("incidents-quick/listByLogged", listImpl);

eventManager.on("incidents-quick/dashboard", findByIdDashboardImpl);
//