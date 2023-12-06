const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("employees/docs/medicals/findById", findByIdImpl);

eventManager.on("employees/docs/medicals/listByLogged", listImpl);
