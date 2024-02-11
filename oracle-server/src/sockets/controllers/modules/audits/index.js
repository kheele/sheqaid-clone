require('./definitions');
require('./items');

const findByIdImpl = require("./findByIdImpl");
const listImpl = require('./listImpl');

eventManager.on("audits/findById", findByIdImpl);

eventManager.on("audits/listByLogged", listImpl);
