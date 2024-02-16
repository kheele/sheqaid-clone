
const {
	onSetCustomUserClaims,
} = require('./api.js');

global.onSetCustomUserClaims = async (data) => {
	let res = await loginSession(data);//{idToken, csrfToken}
	// console.log(`/ContractorUser decodedIdToken`, decodedIdToken)
	if (!res) return;
	const {sessionCookie, options, decodedIdToken} = res;

	res = await onSetCustomUserClaims(data, decodedIdToken);
	// console.log('/User data', data)
	return {sessionCookie, options, ...res};
};
