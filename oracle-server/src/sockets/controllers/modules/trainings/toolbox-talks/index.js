const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("trainings/toolbox-talks/findById", findByIdImpl);

eventManager.on("trainings/toolbox-talks/listByLogged", listImpl);
//