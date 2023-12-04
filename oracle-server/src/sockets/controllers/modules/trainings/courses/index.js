const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("trainings/courses/findById", findByIdImpl);

eventManager.on("trainings/courses/listByLogged", listImpl);
//