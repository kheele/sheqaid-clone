const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("corrective-actions/findById", findByIdImpl);

eventManager.on("corrective-actions/listByLogged", listImpl);
//