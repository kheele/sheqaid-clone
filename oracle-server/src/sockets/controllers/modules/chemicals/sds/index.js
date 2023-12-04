const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("chemicals/sds/findById", findByIdImpl);

eventManager.on("chemicals/sds/listByLogged", listImpl);
//