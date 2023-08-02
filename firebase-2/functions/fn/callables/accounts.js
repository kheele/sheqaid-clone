// <editor-fold defaultstate="collapsed" desc="imports">
const funs = require('./funs');
const {onSetCustomUserClaims, onLogin, onResetPassword} = require('./accounts_impl');
const {query} = require("./graphql/loginContractorUserQuery");
// </editor-fold>

const access_type = 'ContractorUser';
const tbl = 'plugin_sheq_assist_contractors_users';

// <editor-fold defaultstate="collapsed" desc="onSetCustomUserClaims">
exports.onSetCustomUserClaims = functions.runWith({timeoutSeconds: 300, memory: '1GB'}).https.onCall(onSetCustomUserClaims({
    access_type,
    query,
    operationName: 'loginContractorUserQuery',
    connection: 'default_contractor_users_connection',
}));
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onLogin">
exports.onLogin = functions.runWith({timeoutSeconds: 300, memory: '1GB'}).https.onCall(onLogin({
    funs,
    access_type,
    tbl
}));
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onResetPassword">
exports.onResetPassword = functions.runWith({timeoutSeconds: 300, memory: '1GB'}).https.onCall(onResetPassword({
    access_type, 
    tbl
}));
// </editor-fold>
