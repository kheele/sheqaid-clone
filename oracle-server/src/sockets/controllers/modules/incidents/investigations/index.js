const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("incidents/investigations/findById", findByIdImpl);

eventManager.on("incidents/investigations/listByLogged", listImpl);
//