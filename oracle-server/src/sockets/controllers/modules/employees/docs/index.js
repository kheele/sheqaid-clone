const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("assets/docs/findById", findByIdImpl);

eventManager.on("assets/docs/listByLogged", listImpl);
