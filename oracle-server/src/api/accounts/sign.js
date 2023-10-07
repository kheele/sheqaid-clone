const CustomUserClaims = require("../../fn/callables/graphql/CustomUserClaims");
const {CONTRACTORS_ENDPOINT, HR_ENDPOINT} = process.env;

global.signOut = async ({session, sessionCookie, access_type}) => {
	if (access_type === 'ContractorUser') {
		return fetch(`${CONTRACTORS_ENDPOINT}api/callables/accounts/sign/out`, {
			method: "POST"
		}).then(res => res.json());
	}
	if (access_type === 'Staff') {
		return fetch(`${HR_ENDPOINT}api/callables/accounts/sign/out`, {
			method: "POST"
		}).then(res => res.json());
	}

	if (isValidAccessType(access_type)) {
		const _auth = adminAuth(access_type);

		// res.clearCookie('session');
		return _auth
		.verifySessionCookie(sessionCookie)
		.then((decodedClaims) => {
			return _auth.revokeRefreshTokens(decodedClaims.sub);
		}).then(() => {
			const sessionId = session.id;

			return new Promise((resolve, reject) => {
				session.destroy(() => {
					// disconnect all Socket.IO connections linked to this session ID
					io.in(sessionId).disconnectSockets();
					// res.status(204).end();
					resolve(true);
				});
			});
		});
	}
};

global.onReAuthUser = async ({uid, access_type}) => {
	if (!isValidAccessType(access_type)) {
		return;
	}

	if (!uid) {
		return;
	}

	{
		const queryData = CustomUserClaims[access_type];
		if (!queryData) {
			return;
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
	}

	let token;
	if (access_type === 'ContractorUser') {
		token = await fetch(`${CONTRACTORS_ENDPOINT}api/callables/accounts/sign/onReAuthUser`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({uid}),
		}).then(res => res.text()).catch(err => {
			console.error('onReAuthUser', err)
		});
	} else if (access_type === 'Staff') {
		token = await fetch(`${HR_ENDPOINT}api/callables/accounts/sign/onReAuthUser`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({uid}),
		}).then(res => res.text()).then(res => res.text()).catch(err => {
			console.error('onReAuthUser', err)
		});
	} else {
		console.log('onReAuthUser', uid)
		const _auth = adminAuth(access_type);
		token = await _auth.getUser(uid).then(async userRecord => {
			if (!userRecord) {
				return "NO_USER_AUTH";
			}

			const {uid, email, phoneNumber} = userRecord;

			try {
				const token = await _auth.createCustomToken(uid, {access_type});
				return token;
			} catch (err) {
				console.error(err)
				return "ERR_CREATING_TOKEN";
			}
		});
	}

	console.log('onReAuthUser res', token)
	return {token};
};

global.loginSession = async ({onSetCookie, data, access_type}) => {
	console.log('loginSession access_type', access_type)
	if (access_type === 'ContractorUser') {
		return fetch(`${CONTRACTORS_ENDPOINT}api/callables/accounts/sign/loginSession`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		}).then(res => res.json());
	}
	if (access_type === 'Staff') {
		return fetch(`${HR_ENDPOINT}api/callables/accounts/sign/loginSession`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		}).then(res => res.json());
	}

	// Get the ID token passed and the CSRF token.
	// console.log('loginSession', req)
	const {idToken, csrfToken} = data;
	// Guard against CSRF attacks.
	// if (csrfToken !== req.cookies.csrfToken) {
	//     return 'UNAUTHORIZED REQUEST!';
	// }
	// Set session expiration to 5 days.
	const expiresIn = 60 * 60 * 24 * 5 * 1000;
	// Create the session cookie. This will also verify the ID token in the process.
	// The session cookie will have the same claims as the ID token.
	// To only allow session cookie setting on recent sign-in, auth_time in ID token
	// can be checked to ensure user was recently signed in before creating a session cookie.
	const _auth = adminAuth(access_type);

	return _auth.verifyIdToken(idToken).then((decodedIdToken) => {
		// Only process if the user just signed in in the last 60 minutes.
		// if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 60 * 60) {
		// Create session cookie and set it.
		return _auth.createSessionCookie(idToken, {expiresIn}).then(sessionCookie => {
			// Set cookie policy for session cookie.
			const options = {maxAge: expiresIn, httpOnly: true, secure: true};
			console.log("session", sessionCookie)
			onSetCookie(sessionCookie, options);
			return decodedIdToken;
		}).catch(err => {
			console.error(err)
			return 'UNAUTHORIZED REQUEST!';
		});
		// }
		// A user that was not recently signed in is trying to set a session cookie.
		// To guard against ID token theft, require re-authentication.
		// return 'Recent sign in required!';
	});
};

global.verifySession = ({req, res, access_type}) => {
	if (access_type === 'ContractorUser') {
		return fetch(`${CONTRACTORS_ENDPOINT}api/callables/accounts/sign/verifySession`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(req.body),
		}).then(res => res.json());
	}
	if (access_type === 'Staff') {
		return fetch(`${HR_ENDPOINT}api/callables/accounts/sign/verifySession`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(req.body),
		}).then(res => res.json());
	}

	const sessionCookie = req.cookies.session || '';
	// Verify the session cookie. In this case an additional check is added to detect
	// if the user's Firebase session was revoked, user deleted/disabled, etc.

	// returns decodedClaims
	return adminAuth(access_type).verifySessionCookie(sessionCookie, true /** checkRevoked */);
};

global.getDecodedIdTokenFromSession = async ({req, access_type}) => {
	if (access_type === 'ContractorUser') {
		return fetch(`${CONTRACTORS_ENDPOINT}api/callables/get/getDecodedIdTokenFromSession`, {
			method: "GET",
		}).then(res => res.json());
	}
	if (access_type === 'Staff') {
		return fetch(`${HR_ENDPOINT}api/callables/get/getDecodedIdTokenFromSession`, {
			method: "GET",
		}).then(res => res.json());
	}

	if (isValidAccessType(access_type)) {
		const _auth = adminAuth(access_type);
		const sessionCookie = req.cookies.session || '';

		const decodedClaims = await _auth.verifySessionCookie(sessionCookie);
		return decodedClaims;
	}
};

