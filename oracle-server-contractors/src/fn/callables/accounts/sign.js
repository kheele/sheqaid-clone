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

	const access_type = 'ContractorUser';

	admin.auth().getUser(uid).then(async (userRecord) => {
		if (!userRecord) {
			return "NO_USER_AUTH";
		}

		const {uid, email, phoneNumber} = userRecord;

		try {
			const token = await admin.auth().createCustomToken(uid, {access_type});
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
	const access_type = 'ContractorUser';
	try {
		const token = await admin.auth().createCustomToken(uid, {access_type});
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

global.loginSession = async ({req, res}) => {
	// Get the ID token passed and the CSRF token.
	// console.log('loginSession', req)
	const {idToken, csrfToken} = req.body;
	// Guard against CSRF attacks.
	// if (csrfToken !== req.cookies.csrfToken) {
	//     res.status(401).send('UNAUTHORIZED REQUEST!');
	//     return false;
	// }
	// Set session expiration to 5 days.
	const expiresIn = 60 * 60 * 24 * 5 * 1000;
	// Create the session cookie. This will also verify the ID token in the process.
	// The session cookie will have the same claims as the ID token.
	// To only allow session cookie setting on recent sign-in, auth_time in ID token
	// can be checked to ensure user was recently signed in before creating a session cookie.
	const _auth = admin.auth();

	return _auth.verifyIdToken(idToken).then((decodedIdToken) => {
		// Only process if the user just signed in in the last 60 minutes.
		// if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 60 * 60) {
		// Create session cookie and set it.
		return _auth.createSessionCookie(idToken, {expiresIn}).then((sessionCookie) => {
			// Set cookie policy for session cookie.
			const options = {maxAge: expiresIn, httpOnly: true, secure: true};
			console.log("session", sessionCookie, decodedIdToken)
			res.cookie('session', sessionCookie, options);
			return decodedIdToken;
		}).catch(err => {
			console.error(err)
			res.status(401).send('UNAUTHORIZED REQUEST!');
			return false;
		});
		// }
		// A user that was not recently signed in is trying to set a session cookie.
		// To guard against ID token theft, require re-authentication.
		// res.status(401).send('Recent sign in required!');
		// return false;
	});
};

global.verifySession = ({req, res}) => {
	const sessionCookie = req.cookies.session || '';
	// Verify the session cookie. In this case an additional check is added to detect
	// if the user's Firebase session was revoked, user deleted/disabled, etc.

	// returns decodedClaims
	return admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */);
};

module.exports = router;

