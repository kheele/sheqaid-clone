const findByIdImpl = require("./findByIdImpl");
const listImpl = require("./listImpl");

eventManager.on("departments/findById", findByIdImpl);

eventManager.on("departments/listByLogged", listImpl);

