// <editor-fold defaultstate="collapsed" desc="imports">
const {sendUserOTP, confirmUserOTP, sendForgotPass} = require("./send_impl");
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="sendUserOTP">
exports.sendUserOTP = functions.runWith({timeoutSeconds: 300, memory: '1GB'}).https.onCall(sendUserOTP);
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="confirmUserOTP">
exports.confirmUserOTP = functions.runWith({timeoutSeconds: 300, memory: '1GB'}).https.onCall(confirmUserOTP({
    access_type: 'Staff'
}));
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="sendForgotPass">
exports.sendForgotPass = functions.runWith({timeoutSeconds: 300, memory: '1GB'}).https.onCall(sendForgotPass({
    type: 'staff',
    tbl: 'employees'
}));
// </editor-fold>
