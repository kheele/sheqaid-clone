const findByIdImpl = require("./findByIdImpl");
const listImpl = require("./listImpl");

eventManager.on("employees/findById", findByIdImpl);

eventManager.on("employees/listByLogged", listImpl);

