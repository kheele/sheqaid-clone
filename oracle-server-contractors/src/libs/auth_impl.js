
//<editor-fold desc="addCustomUserClaims">
global.addCustomUserClaims = (uid, claims) => {
	const _auth = admin.auth();
	return _auth.getUser(uid).then(({customClaims = {}}) => {
		return _auth.setCustomUserClaims(uid, {...customClaims, ...claims});
	});
};
//</editor-fold>

//<editor-fold desc="setCustomUserClaims">
global.setCustomUserClaims = (uid, claims) => {
	const _auth = admin.auth();
	return _auth.getUser(uid).then(({customClaims}) =>
		_auth.setCustomUserClaims(uid, claims));
}
//</editor-fold>

//<editor-fold desc="createCustomToken">
global.createCustomToken = (uid, claims) => {
	return admin.auth().createCustomToken(uid, claims);
}
//</editor-fold>

global.authorize = (retries = 10) => {
	// Please set the email and private key of service account.
	//authenticate request
	const auth = new google.auth.JWT(
		JWT_DEFAULT_SERVICE_ACCOUNT_CONTRACTOR,
		null,
		JWT_AUTH_KEY_CONTRACTOR,
		[
			"https://www.googleapis.com/auth/drive",
			"https://www.googleapis.com/auth/script.projects",
			"https://www.googleapis.com/auth/iam",
			"https://www.googleapis.com/auth/cloud-platform"
		]
	);
	
	return execWhen(() => new Promise((resolve, reject) => {
		auth.authorize((err, tokens) => {
			if (err) {
				resolve(auth);
				//TODO: fix jwt auth error
				
				// reject(err);
			} else {
				resolve(auth);
			}
		});
	}), retries);
};
