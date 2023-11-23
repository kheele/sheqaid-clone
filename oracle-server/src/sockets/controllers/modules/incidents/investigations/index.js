const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("investigations/findById", findByIdImpl);

eventManager.on("investigations/listByLogged", listImpl);
//