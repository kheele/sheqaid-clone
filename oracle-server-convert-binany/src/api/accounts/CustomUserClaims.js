const {
    onSetCustomUserClaims,
} = require('./api.js');

global.onSetCustomUserClaims = async ({data, access_type}) => {
    const socketClient = {
        'ContractorUser': socketClientContractor, 'Staff': socketClientHR,
    }[access_type];

    if (socketClient) {
        return socketClient.emit('emit', {
            path: 'accounts/onSetCustomUserClaims',
            data,
        }).catch(err => {
            console.error('onSetCustomUserClaims', err)
            throw err;
        });
    }

    let res = await loginSession({data, access_type});
    // console.log(`/${access_type} decodedIdToken`, decodedIdToken)
    if (!res) return;
    const {sessionCookie, options, decodedIdToken} = res;

    res = await onSetCustomUserClaims(data, decodedIdToken, access_type);
    // console.log('/User data', data)
    return {sessionCookie, options, ...res};
};