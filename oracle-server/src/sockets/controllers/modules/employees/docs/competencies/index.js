const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("employees/docs/competencies/findById", findByIdImpl);

eventManager.on("employees/docs/competencies/listByLogged", listImpl);
