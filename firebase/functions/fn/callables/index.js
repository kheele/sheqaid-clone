// <editor-fold defaultstate="collapsed" desc="imports">
const excel_utils = require('./excel_utils');
const covidSubmissionApi = require('./covid-submission-api');

const {onLogin, onResetPassword} = require('./accounts');
const {onLoginBiometric, onSetupBiometric} = require('./biometric');

const {sendUserOTP, confirmUserOTP, sendForgotPass} = require('./send');
const {getUserUidByUsername, getUserUidByEmail, getUserUidByPhone, getUserUidAndPasswordByEmail} = require('./get');
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="exports">
exports.excel_utils = excel_utils;
exports.covidSubmissionApi = covidSubmissionApi;

exports.onLogin = onLogin;
exports.onResetPassword = onResetPassword;

exports.onLoginBiometric = onLoginBiometric;
exports.onSetupBiometric = onSetupBiometric;

exports.sendUserOTP = sendUserOTP;
exports.confirmUserOTP = confirmUserOTP;
exports.sendForgotPass = sendForgotPass;

exports.getUserUidByUsername = getUserUidByUsername;
exports.getUserUidByEmail = getUserUidByEmail;
exports.getUserUidByPhone = getUserUidByPhone;
exports.getUserUidAndPasswordByEmail = getUserUidAndPasswordByEmail;

// <editor-fold defaultstate="collapsed" desc="sendEmail">
exports.sendEmail = functions.https.onCall(async (data, ctx) => {
    await authorize();
    return await EmailUtils.send(data);
});
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="wordToPDF">
exports.wordToPDF = functions.https.onCall(async (dataUrl, ctx) => {
    await authorize();
    return wordToPDF(dataUrl);
});
// </editor-fold>
// </editor-fold>