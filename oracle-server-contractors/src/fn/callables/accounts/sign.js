const express = require('express');
const router = express.Router();

router.post('/out', async (req, res) => {
	const _auth = admin.auth();

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
});

router.post('/onReAuthUser', async (req, res) => {
	const {uid} = req.body;
	console.log('onReAuthUser', uid)

	if (!uid) {
		res.end();
		return;
	}

	admin.auth().getUser(uid).then(async (userRecord) => {
		if (!userRecord) {
			return "NO_USER_AUTH";
		}

		const {uid, email, phoneNumber} = userRecord;

		try {
			const token = await createCustomToken(uid);
			return token;
		} catch (err) {
			console.error(err)
			return "ERR_CREATING_TOKEN";
		}
	}).then((data) => {
		res.end(data);
	});
});

router.post('/addCustomUserClaims', async (req, res) => {
	const {uid, claims} = req.body;
	console.log('addCustomUserClaims', uid, claims)
	try {
		const _auth = admin.auth();
		return _auth.getUser(uid).then(({customClaims = {}}) => {
			if (claims.access_type_list) {
				claims.access_type_list = {...(customClaims.access_type_list || {}), ...claims.access_type_list};
			}
			return _auth.setCustomUserClaims(uid, {...customClaims, ...claims});
		});

		res.end();
	} catch (err) {
		console.error(err)
		res.end();
	}
});

router.post('/setCustomUserClaims', async (req, res) => {
	const {uid, claims} = req.body;
	console.log('setCustomUserClaims', uid, claims)
	try {
		const _auth = admin.auth();
		await _auth.getUser(uid).then(({customClaims}) =>
			_auth.setCustomUserClaims(uid, claims));

		res.end();
	} catch (err) {
		console.error(err)
		res.end();
	}
});

router.post('/createCustomToken', async (req, res) => {
	const {uid} = req.body;
	try {
		const token = await createCustomToken(uid);
		res.end(token);
	} catch (err) {
		console.error(err)
		res.end("ERR_CREATING_TOKEN");
	}
});

router.post('/loginSession', async (req, res) => {
	const data = await loginSession({req, res});
	res.json(data);
});

router.post('/verifySession', async (req, res) => {
	const data = await verifySession({req, res});
	res.json(data);
});

module.exports = router;
