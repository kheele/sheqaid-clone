const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("hira-and-opportunities/sop/findById", findByIdImpl);

eventManager.on("hira-and-opportunities/sop/listByLogged", listImpl);
//
