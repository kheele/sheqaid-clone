const {
    onSetCustomUserClaims,
} = require('./api.js');

global.onSetCustomUserClaims = async ({idToken, csrfToken, access_type}) => {
    const socketClient = {
        'ContractorUser': socketClientContractor, 'Staff': socketClientHR,
    }[access_type];

    if (socketClient) {
        return socketClient.emit('emit', {
            path: 'accounts/onSetCustomUserClaims',
            data: {idToken, csrfToken},
        }).catch(err => {
            console.error('onSetCustomUserClaims', err)
            throw err;
        });
    }

    let res = await loginSession({idToken, csrfToken, access_type});
    // console.log(`/${access_type} decodedIdToken`, decodedIdToken)
    if (!res) return;
    const {sessionCookie, options, decodedIdToken} = res;

    res = await onSetCustomUserClaims({idToken, csrfToken}, decodedIdToken, access_type);
    // console.log('/User data', data)
    return {sessionCookie, options, ...res};
};
