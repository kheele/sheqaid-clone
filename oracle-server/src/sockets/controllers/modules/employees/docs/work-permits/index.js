const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("employees/docs/work-permits/findById", findByIdImpl);

eventManager.on("employees/docs/work-permits/listByLogged", listImpl);
