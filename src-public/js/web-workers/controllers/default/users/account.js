(function () {
    class Controller extends AAccountsCntr {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events) {
            super(events, {singular: "Administrator / User", plural: "Administrators / Users"}, "users/accounts/");

            this.tbl = 'default_users';

            const {addAction} = this;
            addAction("signup", this.signup.bind(this));
        }

        // </editor-fold>

        get isUser() {
            return true;
        }

        get access_type() {
            return 'User';
        }

        get auth() {
            return auth;
        }

        get functions() {
            return functions;
        }

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, {newUser, profile_pic}) {
            return Events.whenLoggedIn(async loggedUser => {
                console.log('create newUser', newUser)

                const {data: {username, fname, lname, company}} = newUser;

                let password = uuidv4();
                password = password.substring(0, password.indexOf('-'));

                const onComplete = async (uid, isNew = true) => {
                    if (isNew) {
                        await authGeneral.signOut();
                    }

                    if (profile_pic) {
                        try {
                            profile_pic = await files.upload.call(this, profile_pic, async (bucketFile) => {
                                const new_name = this.tbl + '/' + uid + '/profile-pic.' + fileUtils.getExtension(bucketFile.name);
                                return new_name;
                            });
                        } catch (err) {
                            profile_pic = null;
                            console.log('users create', err)
//                            doc_ref.delete();//Promise < void >
//                            userCredential.delete();
//                            throw err;
                        }
                    }

                    newUser = await Events.emit("updateNewUser", {id: newUser.id, auth_id: uid, profile_pic});

                    await AllUserFuns.sendCreationEmail('UserCreate',
                        {companyName: company.name, username, password, fname, lname});

                    return newUser;
                };

                try {
                    return await AllUserFuns.createOrGetUserID(authGeneral, username, password, onComplete);
                } catch (err) {
                    if (err.code === "auth/email-already-in-use") {
                        const uid = await this.getUserUID(evt, username);
                        if (uid) {
                            return onComplete(uid, false);
                        }
//                        return await authGeneral.signInWithEmailAndPassword(username, password).then(save);
                    } else {
                        console.error(err);
                        throw err;
                    }
                }
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="signup">
        async signup(evt, {newUser, password, uid, customToken}) {
            console.log('signup newUser', newUser, password, uid, customToken)

            const {data: {username, fname, lname, company}} = newUser;

            const onComplete = async (uid, isNew = true) => {
                if (isNew) {
                    await authGeneral.signOut();
                }

                await Events.emit("updateNewUser", {id: newUser.id, auth_id: uid});

                await AllUserFuns.sendCreationEmail(
                    'UserSignup',
                    {companyName: company.name, username, fname, lname}
                );

                let userCredential;
                if (customToken) {
                    userCredential = await this.auth.signInWithCustomToken(customToken);
                } else {
                    userCredential = await this.auth.signInWithEmailAndPassword(username, password);
                }

                let loggedUser = await this.onSetCustomUserClaims(userCredential.user);
                return this.loginImpl(loggedUser);
            };

            if (uid) {
                return onComplete(uid);
            }

            try {
                return await AllUserFuns.createOrGetUserID(authGeneral, username, password, onComplete);
            } catch (err) {
                if (err.code === "auth/email-already-in-use") {
                    const uid = await this.getUserUID(evt, username);
                    if (uid) {
                        return onComplete(uid, false);
                    }
//                        return await authGeneral.signInWithEmailAndPassword(username, password).then(save);
                } else {
                    console.error(err);
                    throw err;
                }
            }
        }

        // </editor-fold>

    }

    new Controller(events);
})();//585