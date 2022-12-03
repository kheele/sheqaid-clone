// <editor-fold defaultstate="collapsed" desc="imports">
const uuidv4 = require("uuid/v4");
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="sendUserOTP">
exports.sendUserOTP = async (username, ctx) => {
    await authorize();
    if (!username)
        return;

    username = username.toLowerCase();

    return admin.auth().getUserByEmail(username).then(async (userRecord) => {
        if (!userRecord) {
            return "NO_USER_AUTH";
        }

        const {uid, email, phoneNumber} = userRecord;

        const otp = uuidv4().substring(0, 5);

        const now = admin.firestore.Timestamp.now();
        await db.collection('users_otp').doc(uid).set({otp, date: now});

        //send otp with email
        await EmailUtils.send({
            from: '"SHEQ Aid" <support@sheqsolve.com>',
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
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="confirmUserOTP">
exports.confirmUserOTP = ({access_type}) => {
    return async (data, ctx) => {
        await authorize();
        if (!data)
            return;

        const {username, code} = data;
        return admin.auth().getUserByEmail(username).then(async (userRecord) => {
            if (!userRecord) {
                return "NO_USER_AUTH";
            }

            const {uid, email, phoneNumber, customClaims} = userRecord;

            const doc_ref = await db.collection('users_otp').doc(uid);
            const snapshot = await doc_ref.get();
            if (!snapshot.exists) {
                return "NO_USER_DB";
            }

            const {otp, date} = snapshot.data();

            if (otp !== code) {
                return "NO_OTP_MATCH";
            }

            const now = admin.firestore.Timestamp.now().toMillis();
            const addTime = 1800000;//miliseconds = 30 minutes
            const comparedTime = date.toMillis() + addTime;
            if (comparedTime < now) {
                return "CODE_EXPIRED";
            }

            try {
                await doc_ref.set({otp: null});
            } catch (err) {
                return "ERR_UPDATE_USER";
            }

            try {
                const token = await admin.auth().createCustomToken(uid, {access_type});
                return {uid, token};
            } catch (err) {
                console.error(err)
                return "ERR_CREATING_TOKEN";
            }
        });
    };
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="sendForgotPass">
exports.sendForgotPass = ({type, tbl}) => {
    return async (username, ctx) => {
        await authorize();
        if (!username)
            return;

        username = username.toLowerCase();

        const queryRef = db.collection(tbl);
        const col_ref = await queryRef.where('username', '==', username).limit(1);
        const col_snapshot = await col_ref.get();
        if (col_snapshot.empty) {
            return 'NO_DB_USER';
        } else {
            const reset_password_id = uuidv4();
            const {ref: doc_ref} = col_snapshot.docs[0];

            await doc_ref.update({reset_password_id});

            const url = `https://web.sheqaid.com/accounts/pass-recovery.html?id=${reset_password_id}&type=${type}`;// -H "Content-Type:application/json" --data '{"name":"Keyboard Cat"}';
            await EmailUtils.send({
                from: '"SHEQ Aid" <support@sheqsolve.com>',
                to: username,
                subject: 'SHEQ Aid - Recover Password',
                html: '<h3><b>Recover Password</b></h3>\n\
                    <hr />\n\
                    <p>Need to reset your password? No problem. Just click the button below and you will be on your way.</p>\n\
                    <p><b>Note: You MUST have opened the software before clicking the button below.</b></p>\n\
                    <p>If you did not make this request, please ignore this email.</p><br />\n\
                    <p><a href="' + url + '" style="font-size: 20px; color: #ddd; text-decoration: none; padding: 15px; border-radius: 3px; box-shadow: 0 0 3px #eee; background: rgb(2, 168, 168);">Reset Your Password</a></p>'
            });

            return true;
        }
    };
};
// </editor-fold>
