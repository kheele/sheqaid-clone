// <editor-fold defaultstate="collapsed" desc="imports">
const funs = require('./funs');
const {onLogin, onResetPassword} = require('./accounts_impl');
// </editor-fold>

const access_type = 'Staff';
const tbl = 'employees';

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
