// <editor-fold defaultstate="collapsed" desc="imports">
const {onLogin, onResetPassword} = require('./accounts');
const {onLoginBiometric, onSetupBiometric} = require('./biometric');

const {sendUserOTP, confirmUserOTP, sendForgotPass} = require('./send');
const {getUserUidByUsername, getUserUidByEmail, getUserUidByPhone, getUserUidAndPasswordByEmail} = require('./get');
// </editor-fold>

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
