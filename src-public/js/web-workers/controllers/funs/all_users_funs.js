
class AllUserFuns {

    static async createOrGetUserID(authGeneral, username, password, onSave) {
        try {
            return await authGeneral.
                    createUserWithEmailAndPassword(username, password).
                    then(userCredential => userCredential.user.uid).
                    then(onSave);
        } catch (err) {
            if (err.code === "auth/email-already-in-use") {
                const getUserUidByUsername = functions.httpsCallable('callables-getUserUidByUsername');
                const res = await getUserUidByUsername(username);
                if (res && res.data) {
                    const {data: uid} = res;
                    return onSave(uid, false);
                }
//                        return await authGeneral.signInWithEmailAndPassword(username, password).then(save);
            } else {
                console.error(err);
                throw err;
            }
        }
    }

    static async sendCreationEmail(type, {username, password, fname, lname, contractorName, contractorUsername}) {
        const html = {
            UserCreate: () => `<h3><b>Dear ${fname + ' ' + lname}</b></h3>\n
                <p>Your account was recently created on SHEQ Aid.</p>\n
                <p>Your SHEQ Aid Username is <b>${username}</b>, Password is <b>${password}</b> and User Type is <b>System User</b></p>\n
                ${Utils.getAppDownloadOptionMsg()}`,
            UserSignup: () => `<h3><b>Dear ${fname + ' ' + lname}</b></h3>\n
                <p>Your account was recently created on SHEQ Aid.</p>\n
                <p>Your SHEQ Aid Username is <b>${username}</b> and User Type is <b>Administrator</b></p>\n
                <p>Kind Regards<br/>SHEQ Aid</p>`,
            ContractorUserCreate: () => `<h3><b>Dear ${fname + ' ' + lname}</b></h3>\n
                <p>Your account was recently created on SHEQ Aid.</p>\n
                <p>Your SHEQ Aid Username is <b>${username}</b>, Password is <b>${password}</b> and User Type is <b>System User</b></p>\n
                <p>Contractor Name: ${contractorName}</p>\n
                <p>Contractor Email Addess: ${contractorUsername}</p>\n
                ${Utils.getAppDownloadOptionMsg()}`,
            ContractorUserSignup: () => `<h3><b>Dear ${fname + ' ' + lname}</b></h3>\n
                <p>Your account was recently created on SHEQ Aid.</p>\n
                <p>Your SHEQ Aid Username is <b>${username}</b> and User Type is <b>Administrator</b></p>\n
                <p>Contractor Name: ${contractorName}</p>\n
                <p>Contractor Email Addess: ${contractorUsername}</p>\n
                <p>Kind Regards<br/>SHEQ Aid</p>`,
            ContractorCreate: () => `<h3><b>Dear ${contractorName}</b></h3>\n
                <p>Your account was recently created on SHEQ Aid.</p>\n
                <p>Please use <b>${username}</b> as your Username in order to set up your account.</p>\n
                ${Utils.getAppDownloadOptionMsg({isContractor: true})}`
        }[type];
        
        const opts = {
            from: '"SHEQ Aid" <support@sheqsolve.com>',
            to: username,
            subject: 'Welcome to SHEQ Aid',
            html: html()
        };

        console.log('callables-sendEmail', opts)
        const sendEmail = functions.httpsCallable('callables-sendEmail');
        const mailRes = await sendEmail(opts);
        console.log('mailRes', mailRes)
    }

}