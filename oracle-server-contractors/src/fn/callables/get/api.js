const getUserUidByUsername = async (username) => {
	const fnName = username.isEmailAddress() ? 'getUserByEmail' : 'getUserByPhoneNumber';
	try {
		const userRecord = await admin.auth()[fnName](username);
		if (!userRecord)
			return null;
		const {uid, email, phoneNumber} = userRecord;
		return uid;
	} catch (err) {
		// console.error('getUserUidByUsername', err);
		switch (err.code) {
			case 'auth/user-not-found':
				return null;
			default:
				return null;//TODO: Return correct response
		}
	}
};

// <editor-fold defaultstate="collapsed" desc="getUserUidByUsername">
exports.getUserUidByUsername = async (username) => {
	await authorize();
	return getUserUidByUsername(username);
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="getDecodedIdTokenFromSession">
exports.getDecodedIdTokenFromSession = async (req) => {
	const sessionCookie = req.cookies.session || '';

	const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie);
	return decodedClaims;
};
// </editor-fold>
