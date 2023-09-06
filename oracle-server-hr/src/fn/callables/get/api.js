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

// <editor-fold defaultstate="collapsed" desc="getUserUidByEmail">
exports.getUserUidByEmail = async (email) => {
    await authorize();
    if (!email.isEmailAddress()) {
        return null;
    }
    return getUserUidByUsername(email);
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="getUserUidByPhone">
exports.getUserUidByPhone = async (phone) => {
    await authorize();
    if (phone.isEmailAddress()) {
        return null;
    }
    return getUserUidByUsername(phone);
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="getUserUidAndPasswordByEmail">
exports.getUserUidAndPasswordByEmail = async (email) => {
    await authorize();

    const {currentUser} = admin.auth();
    if (!currentUser) return null;

    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        if (!userRecord)
            return null;
        const {uid} = userRecord;
        return {uid};
    } catch (err) {
        return null;
    }
};
// </editor-fold>