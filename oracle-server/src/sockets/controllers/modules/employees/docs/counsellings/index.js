const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("employees/docs/counsellings/findById", findByIdImpl);

eventManager.on("employees/docs/counsellings/listByLogged", listImpl);
