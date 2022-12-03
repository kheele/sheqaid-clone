// <editor-fold defaultstate="collapsed" desc="imports">
const {sendContractorOTP, confirmContractorOTP, onReAuthContractorUser} = require('./contractor');

const {onLogin, onResetPassword} = require('./accounts');
const {onLoginBiometric, onSetupBiometric} = require('./biometric');

const {sendUserOTP, confirmUserOTP, sendForgotPass, sendForgotPassAdmin} = require('./send');
const {getUserUidByUsername, getUserUidByEmail, getUserUidByPhone, getUserUidAndPasswordByEmail} = require('./get');
// </editor-fold>

exports.sendContractorOTP = sendContractorOTP;
exports.confirmContractorOTP = confirmContractorOTP;
exports.onReAuthContractorUser = onReAuthContractorUser;

exports.onLogin = onLogin;
exports.onResetPassword = onResetPassword;

exports.onLoginBiometric = onLoginBiometric;
exports.onSetupBiometric = onSetupBiometric;

exports.sendUserOTP = sendUserOTP;
exports.confirmUserOTP = confirmUserOTP;
exports.sendForgotPass = sendForgotPass;
exports.sendForgotPassAdmin = sendForgotPassAdmin;

exports.getUserUidByUsername = getUserUidByUsername;
exports.getUserUidByEmail = getUserUidByEmail;
exports.getUserUidByPhone = getUserUidByPhone;
exports.getUserUidAndPasswordByEmail = getUserUidAndPasswordByEmail;