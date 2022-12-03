// <editor-fold defaultstate="collapsed" desc="imports">
const {sendUserOTP, confirmUserOTP, sendForgotPass} = require("./send_impl");
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="sendUserOTP">
exports.sendUserOTP = functions.runWith({timeoutSeconds: 300, memory: '1GB'}).https.onCall(sendUserOTP);
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="confirmUserOTP">
exports.confirmUserOTP = functions.runWith({timeoutSeconds: 300, memory: '1GB'}).https.onCall(confirmUserOTP({
    access_type: 'ContractorUser'
}));
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="sendForgotPass">
exports.sendForgotPass = functions.runWith({timeoutSeconds: 300, memory: '1GB'}).https.onCall(sendForgotPass({
    type: 'contractor',
    tbl: 'plugin_sheq_assist_contractors_users'
}));
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="sendForgotPassAdmin">
exports.sendForgotPassAdmin = functions.runWith({timeoutSeconds: 300, memory: '1GB'}).https.onCall(sendForgotPass({
    type: 'admin',
    tbl: 'admin_users'
}));
// </editor-fold>