const fetch = require('node-fetch');

const USERNAME = 'apinioh.sheq';
//'apinioh.festo';
const PASSWORD = 'X#wQmP5bW3';
//'%Sojsi6dC6Zy';
const ENDPOINT = 'https://api.nioh.ac.za/api/DataSubmission/';
//'https://apitest.nioh.ac.za/api/DataSubmission/';
const API_KEY = 'F0F4FB3D-2AAD-4360-9118-A838E0042606';
//'464BA93B-956F-419D-AB8A-157E26630FEB';

const login = () => {
    const path = `${ENDPOINT}Login`;
    const data = {'password': PASSWORD, 'username': USERNAME};
    return fetch(path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'apiKey': API_KEY
        },
        body: JSON.stringify(data)
    }).then(async res => {
        if (res.ok) {
            const json = await res.json();
            const {status, message, token} = json;
            if (status === "1") {
                return token;
            }
        }
        return null;
    });
};

const logout = token => {
    const path = `${ENDPOINT}Logout`;
    const data = {'token': token, 'username': USERNAME};
    return fetch(path, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'apiKey': API_KEY
        },
        body: JSON.stringify(data)
    }).then(async res => {
        if (res.ok) {
            const json = await res.json();
            const {status, message} = json;
            if (status === "1") {
                return true;
            }
        }
        return null;
    });
};

exports.submitScreening = functions.https.onCall(async (req, ctx) => {
    return submitImpl('SubmitScreening', 'screeningData', req, ctx);
});
exports.submitTestData = functions.https.onCall(async (req, ctx) => {
    return submitImpl('SubmitTestData', 'testData', req, ctx);
});
exports.submitReturnToWork = functions.https.onCall(async (req, ctx) => {
    return submitImpl('SubmitReturnToWork', 'returnData', req, ctx);
});
exports.submitVulnerability = functions.https.onCall(async (req, ctx) => {
    return submitImpl('SubmitVulnerability', 'vulnerabilityData', req, ctx);
});

const submitImpl = async (type, listKey, req, ctx) => {
    await authorize();
    if (!req)
        return null;

    const {uid} = ctx.auth;
    if (uid) {
        let token;
        try {
            token = await login();
            if (!token) {
                return "LOGIN_FAILED";
            }
        } catch (err) {
            console.error(err);
            return "LOGIN_ERR";
        }

        let {businessid, list} = req;

        const idList = list.map(v => v.id);

        list = list.map(v => {
            delete v.id;
            v.SAIDorPassportNumber = v.SAIDorPassportNumber.replaceAll(' ', '').
                    replaceAll(',', '').
                    replaceAll('.', '').
                    replaceAll('-', '').
                    replaceAll('/', '').
                    replaceAll('\\', '');
            let {SAIDorPassportNumber: id_num} = v;
            if (id_num.length < 13) {
                for (let n = id_num.length; n < 13; n++) {
                    v.SAIDorPassportNumber += '0';
                }
            }
            return v;
        });

        const path = `${ENDPOINT}${type}`;
        const data = {
            [listKey]: list,
            'businessid': businessid,
            'username': USERNAME,
            'token': token
        };

        return fetch(path, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'apiKey': API_KEY
            },
            body: JSON.stringify(data)
        }).then(async res => {
            if (res.ok) {
                const json = await res.json();
                const {status, message} = json;
                if (status === "1") {
                    try {
                        const resLogout = await logout(token);
                        if (!resLogout) {
                            return "LOGOUT_FAILED";
                        }
                    } catch (err) {
                        console.error(err);
                        return "LOGOUT_ERR";
                    }

                    return updateSubmittedList(listKey, idList);
                }
            }
            return null;
        });
    } else {
        return "NOT_AUTHORISED";
    }
};

const updateSubmittedList = async (listKey, idList) => {
    const tables = {
        screeningData: 'plugin_sheq_assist_COVID_Management_screening',
        testData: 'plugin_sheq_assist_COVID_Management_positive',
        returnData: 'plugin_sheq_assist_COVID_Management_return-to-work',
        vulnerabilityData: 'plugin_sheq_assist_COVID_Management_vulnerable'
    };

    try {
        await Promise.all(idList.filter(id => !!id).map(async id => {
            const doc_ref = await db.collection(tables[listKey]).doc(id);
            let snapshot = await doc_ref.get();
            if (!snapshot.exists) {
                return null;
            }
            const updated = await doc_ref.set({api_submitted: true}, {merge: true});//Promise < void >
        }));
        return true;
    } catch (err) {
        console.error(err);
        return 'FAILED_API_UPDATE';
    }
};