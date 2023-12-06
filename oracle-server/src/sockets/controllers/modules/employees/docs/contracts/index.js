const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("employees/docs/contracts/findById", findByIdImpl);

eventManager.on("employees/docs/contracts/listByLogged", listImpl);
