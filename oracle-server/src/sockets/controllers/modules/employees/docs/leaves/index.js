const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("employees/docs/leaves/findById", findByIdImpl);

eventManager.on("employees/docs/leaves/listByLogged", listImpl);
