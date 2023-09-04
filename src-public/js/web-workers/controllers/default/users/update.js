(function () {
    class Controller extends AControllerRead {
        constructor(events, db) {
            super(events, db, {singular: "Administrator / User", plural: "Administrators / Users"}, "users/update/");

            this.tbl = 'default_users';

            this.update_profile_company = this.update_profile_company.bind(this);
            this.upload_profile_user = this.upload_profile_user.bind(this);
            this.upload_profile_company = this.upload_profile_company.bind(this);

            const {addAction, update_profile_company, upload_profile_user, upload_profile_company} = this;
            addAction("profile/company", update_profile_company);

            addAction("upload/profile-pic/user", upload_profile_user);
            addAction("upload/profile-pic/company", upload_profile_company);
        }

        async update(evt, id, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const colRef = this.getDB().collection(this.tbl);

                const doc_ref = await colRef.doc(id);
                const snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                let {username, phone, password_conf} = updateAttrs;
                delete updateAttrs.password_conf;

                if (username) {
                    updateAttrs.username = username = username.toLowerCase().trim();

                    const docIdKey = FBSettings.FieldPath.documentId();
                    let snapshot = await colRef.where(docIdKey, '!=', id).where('username', '==', username).limit(1).get();
                    if (!snapshot.empty) {
                        return "EMAIL_DUP";
                    }
                }
                if (phone) {
                    updateAttrs.phone = phone = phone.trim();

                    const docIdKey = FBSettings.FieldPath.documentId();
                    let snapshot = await colRef.where(docIdKey, '!=', id).where('phone', '==', phone).limit(1).get();
                    if (!snapshot.empty) {
                        return "PHONE_DUP";
                    }
                }

                console.log('users update', updateAttrs)

                if (username || phone) {
                    const {email: old_username, phoneNumber: old_phone} = self.session.auth.currentUser;
                    const {username: new_username, phone: new_phone} = updateAttrs;
                    console.log('users update new_username new_phone', new_username, new_phone)

                    if (loggedUser.user.id === id) {
                        if(!password_conf) {
                            return "PASSWORD_CONF_REQUIRED";
                        }
                        
                        const updateUsernameImpl = async (fnName, new_value, credental) => {
                            try {
                                await self.session.auth.currentUser.reauthenticateWithCredential(credental);
                                try {
                                    await self.session.auth.currentUser[fnName](new_value);
                                    return new_value;
                                } catch (err) {
                                    throw err;
                                }
                            } catch (err) {
                                throw err;
                            }
                        };

                        if (username) {
                            try {
                                const new_username_res = await updateUsernameImpl(
                                        'updateEmail',
                                        new_username,
                                        firebase.auth.EmailAuthProvider.credential(old_username, password_conf)
                                        );
                                loggedUser.user.data.username = new_username_res;
                            } catch (err) {
                                console.error(err);
                                throw err;
                            }
                        }
                        if (phone) {
                            try {
                                const new_phone_res = await updateUsernameImpl(
                                        'updatePhoneNumber',
                                        new_phone,
                                        firebase.auth.EmailAuthProvider.credential(old_username, password_conf)
                                        );
                                loggedUser.user.data.phone = new_phone_res;
                            } catch (err) {
                                console.error(err);
                                throw err;
                            }
                        }
                    } else {
                        //cant update other user email
                        return 'CANT_UPDATE_OTHER_USER_EMAIL_OR_PHONE';
                    }
                }

                const res = await AControllerRead.prototype.update.call(this, evt, id, updateAttrs);
                delete res.password;
                console.log('users update', res)
                return res;
            });
        }

        async update_profile_company(evt, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const {company} = loggedUser;
                const doc_ref = await this.getDB().collection('default_companies').doc(company.id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                const {
                    company_name
                } = updateAttrs;

                if (company_name) {
                    updateAttrs.keywords = this.generateKeywords([company_name]);
                }

                const updated = await doc_ref.update(updateAttrs);//Promise < void >

                return true;
            });
        }

        async upload_profile_user(evt, id, path) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                let {profile_pic: profile_pic_old} = doc_snapshot.data();

                const profile_pic = await files.upload.call(this, path, async function (bucketFile) {
                    const new_name = this.tbl + '/' + id + '/profile-pic.' + fileUtils.getExtension(bucketFile.name);
                    console.log('fileUtils', new_name)
                    return new_name;
                }.bind(this));

                if (profile_pic_old) {
                    files.remove(profile_pic_old);
                }

                const updated = await doc_ref.update({profile_pic});//Promise < void >

                const {user} = loggedUser;
                if (user.id === id) {
                    user.data.profile_pic = profile_pic;
                }
                return profile_pic;
            });
        }

        async upload_profile_company(evt, path) {
            return Events.whenLoggedIn(async loggedUser => {
                const {company} = loggedUser;
                const doc_ref = await this.getDB().collection('default_companies').doc(company.id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                let {profile_pic: profile_pic_old} = doc_snapshot.data();

                const profile_pic = await files.upload.call(this, path, async bucketFile => {
                    const new_name = 'default_companies/' + company.id + '/profile-pic.' + fileUtils.getExtension(bucketFile.name);
                    return new_name;
                });

                if (profile_pic_old) {
                    files.remove(profile_pic_old);
                }

                const updated = await doc_ref.update({profile_pic});//Promise < void >

                company.data.profile_pic = profile_pic;
                return profile_pic;
            });
        }
    }

    new Controller(events, db);
})();