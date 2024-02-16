(function () {
    class Controller extends AAccountsCntr {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events) {
            super(events, {
                singular: "Contractor Administrator/User",
                plural: "Contractor Administrators/Users"
            }, "plugin_sheq_assist/contractors/users/", "plugin_sheq_assist_contractors_users");

            const {addAction} = this;
            addAction("signup", this.signup.bind(this));
            addAction("relogin", this.relogin.bind(this));

            this.setQueryWhere(company_id => {
                const loggedUser = self.session.getLoggedUser();
                let {
                    user: {
                        data: {
                            client: my_client, project: my_project, site: my_site,
                            contractor_id
                        }
                    },
                    client_id, project_id, site_id,
                    contractor_id: logged_contractor_id
                } = loggedUser;
                contractor_id = logged_contractor_id || contractor_id;

                const list = [
                    ['company_id', '==', company_id],
                    ['contractor_id', '==', contractor_id]
                ];
                if (my_client) {
                    list.push(['client_id', '==', my_client.id]);
                } else if (client_id) {
                    list.push(['client_id', '==', client_id]);
                }
                return list;
            });

            const fn = async () => {
                const doc_ref = await db.collection(this.tbl);//Promise < DocumentReference < T > >
                const querySnapshot = await doc_ref.get();
                const list = [];
                querySnapshot.forEach((doc) => {
                    list.push(doc);
                });
                console.log(`${this.tbl} test`);

                await Promise.all(list.map(async (doc) => {
                    const ref = this.getDB().collection(this.tbl).doc(doc.id);
                    const updated = await ref.set(doc.data(), {merge: true});//Promise < void >
                    console.log(`${this.tbl} done`, doc.id);
                }));
                console.log(`${this.tbl} final`);
            };
            //fn();
        }

        // </editor-fold>

        getDB() {
            return db2;
        }

        get isContractorUser() {
            return true;
        }

        get access_type() {
            return 'ContractorUser';
        }

        get auth() {
            return auth2;
        }

        get functions() {
            return functions2;
        }

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, {newUser, profile_pic}) {
            return Events.whenLoggedIn(async loggedUser => {
                console.log('create newUser', newUser)

                const {data: {username, fname, lname, contractor}} = newUser;

                let password = uuidv4();
                password = password.substring(0, password.indexOf('-'));

                const onComplete = async (uid, isNew = true) => {
                    if (isNew) {
                        await auth2General.signOut();
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

                    newUser = await Events.emit("updateContractorUser", {id: newUser.id, auth_id: uid, profile_pic});

                    await AllUserFuns.sendCreationEmail('ContractorUserCreate',
                        {
                            username,
                            password,
                            fname,
                            lname,
                            contractorName: contractor.name,
                            contractorUsername: contractor.username
                        });

                    return newUser;
                };

                try {
                    return await AllUserFuns.createOrGetUserID(auth2General, username, password, onComplete);
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
        async signup(evt, {newUser, password}) {
            console.log('signup newUser', newUser, password)

            const {data: {username, fname, lname, contractor}} = newUser;

            const onComplete = async (uid, isNew = true) => {
                if (isNew) {
                    await auth2General.signOut();
                }

                await Events.emit("updateNewContractorUser", {id: newUser.id, auth_id: uid});

                await AllUserFuns.sendCreationEmail(
                  'ContractorUserSignup',
                  {username, fname, lname, contractorName: contractor.name, contractorUsername: contractor.username,}
                );

                let userCredential = await this.auth.signInWithEmailAndPassword(username, password);

                let loggedUser = await this.onSetCustomUserClaims(userCredential.user);
                return this.loginImpl(loggedUser);
            };

            try {
                return await AllUserFuns.createOrGetUserID(auth2General, username, password, onComplete);
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

        // <editor-fold defaultstate="collapsed" desc="update">
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
                    const {email: old_username, phoneNumber: old_phone} = this.auth.currentUser;
                    const {username: new_username, phone: new_phone} = updateAttrs;
                    console.log('users update new_username new_phone', new_username, new_phone)

                    if (loggedUser.user.id === id) {
                        if (!password_conf) {
                            return "PASSWORD_CONF_REQUIRED";
                        }

                        const updateUsernameImpl = async (fnName, new_value, credental) => {
                            try {
                                await this.auth.currentUser.reauthenticateWithCredential(credental);
                                try {
                                    await this.auth.currentUser[fnName](new_value);
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

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="@override getByUsername">
        async getByUsername(evt, username) {
            console.log('getByUsername contractor user')
            username = username.toLowerCase();

            // const key = username.isEmailAddress() ? 'username' : 'phone';
            // let snapshot = await this.getDB().collection(this.tbl).where(key, '==', username).limit(1).get();
            let res = await Events.emit('findByUsernameContractorUser', username);
            console.log('getByUsername, findByUsernameContractorUser res', res);
            if (res && res.data && res.data.auth_id) {
                // const doc = snapshot.docs[0];
                // return {id: doc.id, data: doc.data()};
                return res.data;//{id, auth_id}
            }

            // const contractors = await Events.get('plugin_sheq_assist/contractors/');
            // const contractor = await contractors.find_by_username(username, false);
            const contractor = await Events.emit('findByUsernameContractor', username);
            if (!contractor) {
                return "NO_USER_DB";
            }

            // snapshot = await this.getDB().collection(this.tbl).where('contractor_id', '==', contractor.id).limit(1).get();
            res = await Events.emit('findByContractorIdContractorUser', contractor.id);
            // if (!snapshot.empty) {
            if (res) {
                return {contractor, message: "CONTRACTOR_EMAIL_RESTRICTION"};//setup user account
            }
            return {contractor};//setup user account
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            let {searchText = ""} = opts;
            searchText = searchText.toLowerCase();
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.loadOnSnapshot.call(this, evt, function onChange() {

                });

                list = list.filter(({data: {fname, lname}}) => {
                    return lname.toLowerCase().startsWith(searchText) || fname.toLowerCase().startsWith(searchText);
                });

                list = await Promise.all(list.map(ContractorUserFuns.mapResults));

                this.sortBy(list);

                const {
                    user,
                    user: {data: {client: my_client, project: my_project, site: my_site}},
                    company,
                    client_id,
                    project_id,
                    site_id
                } = loggedUser;

                if (my_client) {
                    list = list.filter(val => {
                        return my_client.id === getClientId(val);
                    });
                } else if (client_id) {
                    list = list.filter(val => {
                        const {client} = val.data;
                        if (!client || client === "All" || !client)
                            return true;
                        return client_id === client.id;
//                        return client_id === getClientId(val);
                    });
                }

                if (my_project) {
                    list = list.filter(({data, data: {project}}) => {
                        return my_project.id === getProjectId(project, data);
                    });
                } else if (project_id) {
                    list = list.filter(({data, data: {project}}) => {
                        return project_id === getProjectId(project, data);
                    });
                }

                return list;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name = "", user_type} = filterData;
                const q = [
                    {key: 'name', comp: 'LIKE', val: name},
                    {key: 'user_type', comp: '=', val: user_type}
                ];
                return this.filter_impl(evt, q);
            });
        }

        // </editor-fold>

        sortBy(list) {
            list.sortBy("data.lname");
        }
    }

    const userCntr = new Controller(events);

    // <editor-fold defaultstate="collapsed" desc="auth2.onAuthStateChanged">
    auth2.onAuthStateChanged((user) => {
        const {selfLogin} = userCntr;
    });
    // </editor-fold>

})();//627
