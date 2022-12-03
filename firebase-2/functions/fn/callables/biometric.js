// <editor-fold defaultstate="collapsed" desc="imports">
const funs = require('./funs');
const {onLoginBiometric, onSetupBiometric} = require('./biometric_impl');
// </editor-fold>

const access_type = 'ContractorUser';
const tbl = 'plugin_sheq_assist_contractors_users';

// <editor-fold defaultstate="collapsed" desc="onLoginBiometric">
exports.onLoginBiometric = functions.runWith({timeoutSeconds: 300, memory: '1GB'}).https.onCall(onLoginBiometric({
    funs,
    access_type, 
    tbl
}));
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onSetupBiometric">
exports.onSetupBiometric = functions.runWith({timeoutSeconds: 300, memory: '1GB'}).https.onCall(onSetupBiometric({
    funs,
    access_type, 
    tbl
}));
// </editor-fold>