// <editor-fold defaultstate="collapsed" desc="imports">
const {CONTRACTORS_ENDPOINT, HR_ENDPOINT} = process.env;
// </editor-fold>

//<editor-fold desc="addCustomUserClaims">
global.addCustomUserClaims = (uid, claims, access_type) => {
    const _auth = admin.auth();
    return _auth.getUser(uid).then(({customClaims = {}}) => {
        return _auth.setCustomUserClaims(uid, {...customClaims, ...claims});
    });
};
//</editor-fold>

//<editor-fold desc="setCustomUserClaims">
global.setCustomUserClaims = (uid, claims, access_type) => {
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

global.isValidAccessType = (access_type) => access_type === "User" || access_type === "ContractorUser" || access_type === "Staff";

global.adminAuth = (access_type) => {
    return {
        "User": admin,
        "ContractorUser": admin2,
        "Staff": admin_hr
    }[access_type].auth();
}

global.authorize = (retries = 10) => {
    // Please set the email and private key of service account.
    //authenticate request
    const auth = new google.auth.JWT(
        JWT_DEFAULT_SERVICE_ACCOUNT,
        null,
        JWT_AUTH_KEY,
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
                reject(err);
            } else {
                resolve(auth);
            }
        });
    }), retries);
};