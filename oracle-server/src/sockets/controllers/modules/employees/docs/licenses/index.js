const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("employees/docs/licenses/findById", findByIdImpl);

eventManager.on("employees/docs/licenses/listByLogged", listImpl);
