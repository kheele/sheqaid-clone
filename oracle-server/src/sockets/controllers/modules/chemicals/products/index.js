const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("chemicals/products/findById", findByIdImpl);

eventManager.on("chemicals/products/listByLogged", listImpl);
//