// <editor-fold defaultstate="collapsed" desc="imports">
const {CONTRACTORS_ENDPOINT, HR_ENDPOINT} = process.env;
// </editor-fold>

//<editor-fold desc="addCustomUserClaims">
global.addCustomUserClaims = (uid, claims, access_type) => {
    if (access_type === 'ContractorUser') {
        return fetch(`${CONTRACTORS_ENDPOINT}api/callables/accounts/sign/addCustomUserClaims`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({uid, claims}),
        }).then(res => res.text());
    }
    if (access_type === 'Staff') {
        return fetch(`${HR_ENDPOINT}api/callables/accounts/sign/addCustomUserClaims`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({uid, claims}),
        }).then(res => res.text());
    }

    const _auth = admin.auth();
    return _auth.getUser(uid).then(({customClaims = {}}) => {
        return _auth.setCustomUserClaims(uid, {...customClaims, ...claims});
    });
};
//</editor-fold>

//<editor-fold desc="setCustomUserClaims">
global.setCustomUserClaims = (uid, claims, access_type) => {
    if (access_type === 'ContractorUser') {
        return fetch(`${CONTRACTORS_ENDPOINT}api/callables/accounts/sign/setCustomUserClaims`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({uid, claims}),
        }).then(res => res.text());
    }
    if (access_type === 'Staff') {
        return fetch(`${HR_ENDPOINT}api/callables/accounts/sign/setCustomUserClaims`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({uid, claims}),
        }).then(res => res.text());
    }

    const _auth = admin.auth();
    return _auth.getUser(uid).then(({customClaims}) =>
        _auth.setCustomUserClaims(uid, claims));
}
//</editor-fold>

//<editor-fold desc="createCustomToken">
global.createCustomToken = (uid, data) => {
    const {access_type} = data;
    if (access_type === 'ContractorUser') {
        return fetch(`${CONTRACTORS_ENDPOINT}api/callables/accounts/sign/createCustomToken`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({uid}),
        }).then(res => res.text());
    }
    if (access_type === 'Staff') {
        return fetch(`${HR_ENDPOINT}api/callables/accounts/sign/createCustomToken`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({uid}),
        }).then(res => res.text());
    }

    return admin.auth().createCustomToken(uid, {access_type});
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