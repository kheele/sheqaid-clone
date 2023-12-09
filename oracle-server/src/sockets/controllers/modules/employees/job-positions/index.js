const findByIdImpl = require("./findByIdImpl");
const listImpl = require("./listImpl");

eventManager.on("job-positions/findById", findByIdImpl);

eventManager.on("job-positions/listByLogged", listImpl);

