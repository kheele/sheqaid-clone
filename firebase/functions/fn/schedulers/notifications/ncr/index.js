
//{sendExpiryEmails, removeNotificationOfRemoved}
const {sendExpiryEmails, removeNotificationOfRemoved} = require('./employee_docs-old');
//{notifyForEmployeesNotLocated}
const {notifyForEmployeesNotLocated} = require('./employee_profile');

exports.sendExpiryEmails = sendExpiryEmails;
exports.removeNotificationOfRemoved = removeNotificationOfRemoved;

exports.notifyForEmployeesNotLocated = notifyForEmployeesNotLocated;