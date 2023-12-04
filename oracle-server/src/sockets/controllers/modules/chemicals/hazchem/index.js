const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("chemicals/hazchem/findById", findByIdImpl);

eventManager.on("chemicals/hazchem/listByLogged", listImpl);
//