const findByIdImpl = require("./findByIdImpl");
const listImpl = require("./listImpl");

eventManager.on("ppe/findById", findByIdImpl);

eventManager.on("ppe/listByLogged", listImpl);
