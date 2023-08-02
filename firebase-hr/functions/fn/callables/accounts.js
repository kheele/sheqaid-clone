// <editor-fold defaultstate="collapsed" desc="imports">
const funs = require('./funs');
const {onSetCustomUserClaims, onLogin, onResetPassword} = require('./accounts_impl');
const {query} = require("./graphql/loginEmployeeQuery");
// </editor-fold>

const access_type = 'Staff';
const tbl = 'employees';

// <editor-fold defaultstate="collapsed" desc="onSetCustomUserClaims">
exports.onSetCustomUserClaims = functions.runWith({timeoutSeconds: 300, memory: '1GB'}).https.onCall(onSetCustomUserClaims({
    access_type,
    query,
    operationName: 'loginEmployeeQuery',
    connection: 'hr_employees_connection',
}));
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onLogin">
exports.onLogin = functions.runWith({timeoutSeconds: 300, memory: '1GB'}).https.onCall(onLogin({
    funs,
    access_type
}));
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onResetPassword">
exports.onResetPassword = functions.runWith({timeoutSeconds: 300, memory: '1GB'}).https.onCall(onResetPassword({
    access_type, 
    tbl
}));
// </editor-fold>
