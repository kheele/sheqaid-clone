// <editor-fold defaultstate="collapsed" desc="imports">
const {getDBUser} = require('./funs');

const uuidv4 = require("uuid/v4");
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="sendContractorOTP">
exports.sendContractorOTP = functions.runWith({timeoutSeconds: 300, memory: '1GB'}).https.onCall(async (id, ctx) => {
    await authorize();

    const doc_ref = await db.collection('plugin_sheq_assist_contractors').doc(id);
    const snapshot = await doc_ref.get();
    if (!snapshot.exists) {
        return "NO_USER_DB";
    }

    const otp = uuidv4().substring(0, 5);

    await doc_ref.update({password_otp: otp});

    const email = snapshot.get('username');

    //send otp with email
    await EmailUtils.send({
        from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
        to: email,
        subject: 'SHEQ Aid Notifications',
        html: `<h3><b>Hello,</b></h3>\n
            <p>Please use the One-Time Password provided below on SHEQ Aid application:</p>\n
            <p style="font-size: 20px"><b>${otp}</b></p>\n
            <p>If you didn't request this, you can ignore this email or let us know.</p>\n
            <p>Kind Regards<br/>SHEQ Aid</p>`
    });

    return true;
});
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="confirmContractorOTP">
exports.confirmContractorOTP = functions.runWith({timeoutSeconds: 300, memory: '1GB'}).https.onCall(async (data, ctx) => {
    await authorize();
    if (!data)
        return;

    const {uid, code} = data;
    if (!uid)
        return;
    if (!code)
        return;

    let tbl = 'plugin_sheq_assist_contractors';

    const user_res = await getDBUser(tbl, uid);
    if (!user_res) {
        return "NO_USER_DB";
    }

    const {doc_ref, db_user} = user_res;
    const {password_otp} = db_user.data;

    if (password_otp !== code) {
        return "NO_OTP_MATCH";
    }

    try {
        await doc_ref.set({password_otp: null}, {merge: true});
        return db_user;
    } catch (err) {
        return "ERR_UPDATE_USER";
    }
});
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onReAuthContractorUser">
exports.onReAuthContractorUser = functions.runWith({timeoutSeconds: 300, memory: '1GB'}).https.onCall(async (uid, ctx) => {
    await authorize();
    if (uid) {
        console.log('onReAuthContractorUser', uid)
        return admin.auth().getUser(uid).then(async (userRecord) => {
            if (!userRecord) {
                return "NO_USER_AUTH";
            }

            const {uid, email, phoneNumber} = userRecord;

            const access_type = 'ContractorUser';
            let tbl = 'plugin_sheq_assist_contractors_users';

            const user_res = await getDBUser(tbl, uid);
            if (!user_res) {
                return "NO_USER_DB";
            }

            try {
                const token = await admin.auth().createCustomToken(uid, {access_type});
                return {token};
            } catch (err) {
                console.error(err)
                return "ERR_CREATING_TOKEN";
            }
        });
    } else {
        return null;
    }
});
// </editor-fold>