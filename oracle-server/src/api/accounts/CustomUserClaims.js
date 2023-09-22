
const {
	onSetCustomUserClaims,
} = require('./api.js');

global.onSetCustomUserClaims = async ({session, data, access_type, onSetCookie}) => {
	const decodedIdToken = await loginSession({session, data, access_type, onSetCookie});
	// console.log(`/${access_type} decodedIdToken`, decodedIdToken)
	if (!decodedIdToken) return;

	const res = await onSetCustomUserClaims(data, decodedIdToken, access_type);
	// console.log('/User data', data)
	return res;
};