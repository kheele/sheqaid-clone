const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("employees/docs/warnings/findById", findByIdImpl);

eventManager.on("employees/docs/warnings/listByLogged", listImpl);
