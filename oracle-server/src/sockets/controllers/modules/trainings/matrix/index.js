const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("trainings/matrix/findById", findByIdImpl);

eventManager.on("trainings/matrix/listByLogged", listImpl);
//