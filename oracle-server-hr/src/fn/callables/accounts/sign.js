const express = require('express');
const CustomUserClaims = require("../graphql/CustomUserClaims");
const router = express.Router();

router.post('/out/:access_type', async (req, res) => {
	const {access_type} = req.params;

	if (isValidAccessType(access_type)) {
		const _auth = adminAuth(access_type);

		const sessionCookie = req.cookies.session || '';
		res.clearCookie('session');
		_auth
		.verifySessionCookie(sessionCookie)
		.then((decodedClaims) => {
			return _auth.revokeRefreshTokens(decodedClaims.sub);
		})
		.then(() => {
			res.json(true);
		})
		.catch((error) => {
			res.json(true);
		});
	} else {

	}
});

router.post('/onReAuthUser/:access_type', async (req, res) => {
	const {access_type} = req.params;

	if (!isValidAccessType(access_type)) {
		return null;
	}
	const {uid} = req.body;

	if (!uid) {
		return null;
	}

	const _auth = adminAuth(access_type);
	console.log('onReAuthUser', uid)
	return _auth.getUser(uid).then(async (userRecord) => {
		if (!userRecord) {
			return "NO_USER_AUTH";
		}

		const {uid, email, phoneNumber} = userRecord;

		const queryData = CustomUserClaims[access_type];
		if (!queryData) {
			return null;
		}

		const {query, operationName} = queryData;

		const item = await getRelayOne({
			query,
			operationName,
			variables: {auth_id: uid},
		});
		console.log('onReAuthUser item', item)
		if (!item) {
			return "NO_USER_DB";
		}

		try {
			const token = await _auth.createCustomToken(uid, {access_type});
			return {token};
		} catch (err) {
			console.error(err)
			return "ERR_CREATING_TOKEN";
		}
	});
});

module.exports = router;

