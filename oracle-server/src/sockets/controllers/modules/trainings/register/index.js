const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("trainings/register/findById", findByIdImpl);

eventManager.on("trainings/register/listByLogged", listImpl);
//