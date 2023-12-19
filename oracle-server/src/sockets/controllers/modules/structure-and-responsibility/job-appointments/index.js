const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("structure-and-responsibility/job-appointments/findById", findByIdImpl);

eventManager.on("structure-and-responsibility/job-appointments/listByLogged", listImpl);
