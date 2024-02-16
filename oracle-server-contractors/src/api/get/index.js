
const getUserUidByUsername = async (username) => {
    const fnName = username.isEmailAddress() ? 'getUserByEmail' : 'getUserByPhoneNumber';
    try {
        const userRecord = await admin.auth()[fnName](username);
        if (!userRecord)
            return null;
        const {uid, email, phoneNumber} = userRecord;
        return uid;
    } catch (err) {
        console.error('getUserUidByUsername', err);
        switch (err.code) {
            case 'auth/user-not-found':
                return null;
            default:
                return null;//TODO: Return correct response
        }
    }
};

// <editor-fold defaultstate="collapsed" desc="getUserUidByUsername">
global.getUserUidByUsername = async (username) => {
    await authorize();
    return getUserUidByUsername(username);
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="getUserUidByEmail">
global.getUserUidByEmail = async (email) => {
    await authorize();
    if (!email.isEmailAddress()) {
        return null;
    }
    return getUserUidByUsername(email);
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="getUserUidByPhone">
global.getUserUidByPhone = async (phone) => {
    await authorize();
    if (phone.isEmailAddress()) {
        return null;
    }
    return getUserUidByUsername(phone);
};
// </editor-fold>
