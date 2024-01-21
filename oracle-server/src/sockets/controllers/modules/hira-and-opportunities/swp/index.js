const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("hira-and-opportunities/swp/findById", findByIdImpl);

eventManager.on("hira-and-opportunities/swp/listByLogged", listImpl);
//
