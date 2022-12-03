
(function () {
    class Controller extends AAccountsCntr {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events, db) {
            super(events, db, {singular: "Contractor Administrator/User", plural: "Contractor Administrators/Users"}, "plugin_sheq_assist/contractors/users/", "plugin_sheq_assist_contractors_users");

            const {addAction} = this;
            addAction("signup", this.signup.bind(this));
            addAction("relogin", this.relogin.bind(this));

            this.setQueryWhere(company_id => {
                const loggedUser = self.session.getLoggedUser();
                let {
                    user: {data: {
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
        async create(evt, DATA) {
            return Events.whenLoggedIn(async loggedUser => {
                if (DATA.username) {
                    DATA.username = DATA.username.toLowerCase();
                }
                const {username} = DATA;

                const colRef = this.getDB().collection(this.tbl);
                // <editor-fold defaultstate="collapsed" desc="data collection">
                let snapshot = await colRef.where('username', '==', username).limit(1).get();
                if (!snapshot.empty) {
                    return "EMAIL_DUP";
                }

//                return auth2.getUserByEmail(username).catch(async err => {
//                    if (err.message === 'auth/user-not-found') {
                //
                const {user, user: {data: {client: my_client, project: my_project, contractor: my_contractor}}, company} = loggedUser;
                DATA.user_id = user.id;
                DATA.company_id = company.id;
                DATA.created_at = FBSettings.FieldValue.serverTimestamp();

                DATA.client = {id: my_client.id, name: my_client.name || my_client.data.name};
                DATA.client_id = my_client.id;

                DATA.project = {id: my_project.id, name: my_project.name || my_project.data.name};
                DATA.project_id = my_project.id;

                DATA.contractor_id = my_contractor.id;
                DATA.contractor = {id: my_contractor.id, name: my_contractor.data.name, username: my_contractor.data.username};

                //
                const {user_id, company_id, created_at} = DATA;

                const {project, client, profile_pic} = DATA;
                if (profile_pic) {
                    delete DATA.profile_pic;
                }

                let password;
                if (!DATA.password) {
                    password = uuidv4();
                    DATA.password = password.substring(0, password.indexOf('-'));
                } else {
                    password = DATA.password;
                }

                DATA.keywords = this.generateKeywords([DATA.lname, DATA.fname]);
                // </editor-fold>

                const save = async (uid, isNew = true) => {
                    if (isNew) {
                        DATA.password = password;
                        await auth2General.signOut();
                    }
                    console.log('users create userCredential', uid, DATA)

                    await colRef.doc(uid).set(DATA);//Promise < DocumentReference < T > >;
                    const doc_ref = await colRef.doc(uid);//Promise < DocumentReference < T > >;
                    const doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >;
                    if (DATA.linked_employee_id) {
                        const employees = await Events.get('plugin_sheq_assist/employees/');
                        const res = await employees.update(evt, DATA.linked_employee_id, {linked_user_id: doc_snapshot.id});
                    }

                    if (profile_pic) {
                        try {
                            const gcsUri = await files.upload.call(this, profile_pic, async (bucketFile) => {
                                const new_name = this.tbl + '/' + doc_snapshot.id + '/profile-pic.' + fileUtils.getExtension(bucketFile.name);
                                return new_name;
                            });
                            const updated = await doc_ref.update({profile_pic: gcsUri});//Promise < void >
                        } catch (err) {
                            console.log('users create', err)
//                            doc_ref.delete();//Promise < void >
//                            userCredential.delete();
//                            throw err;
                        }
                    }

                    DATA = doc_snapshot.data();
                    DATA.created_at = DATA.created_at.toDate();

                    await AllUserFuns.sendCreationEmail('ContractorUserCreate',
                            {username, password, fname: DATA.fname, lname: DATA.lname, contractorName: DATA.contractor.name, contractorUsername: DATA.contractor.username});

                    const item = await ContractorUserFuns.mapResults({id: doc_snapshot.id, data: DATA});
                    return item;
                };

                return AllUserFuns.createOrGetUserID(auth2General, username, password, save);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="signup">
        async signup(evt, data) {
            //console.log('signup data', data)
            if (data.username) {
                data.username = data.username.toLowerCase();
            }

            const colRef = this.getDB().collection(this.tbl);
            let snapshot = await colRef.where('username', '==', data.username).limit(1).get();
            if (!snapshot.empty) {
                return "EMAIL_DUP";
            }

            let {
                profile_pic, username, password, company,
                contractor, contractor: {
                    data: {
                        company_id, client: my_client, project: my_project,
                        name: contractorName,
                        username: contractorUsername
                    }
                }
            } = data;

            if (profile_pic) {
                delete data.profile_pic;
            }
//                return auth2.getUserByEmail(username).catch(async err => {
//                    if (err.message === 'auth/user-not-found') {
            data.created_at = FBSettings.FieldValue.serverTimestamp();
            data.company_id = company_id;
            data.contractor_id = contractor.id;
            data.contractor = {id: contractor.id, name: contractorName, username: contractorUsername};

            if (my_client) {
                data.client = {id: my_client.id, name: my_client.name || my_client.data.name};
                data.client_id = my_client.id;
            } else {

            }

            if (my_project) {
                data.project = {id: my_project.id, name: my_project.name || my_project.data.name};
                data.project_id = my_project.id;
            } else {

            }

            data.keywords = this.generateKeywords([data.lname, data.fname]);

            const save = async (uid, isNew = true) => {
                if (isNew) {
                    data.password = password;
                    await auth2General.signOut();
                }

                await colRef.doc(uid).set(data);//Promise < DocumentReference < T > >;
                const doc_ref = await colRef.doc(uid);//Promise < DocumentReference < T > >;
                const snapshot_user = await doc_ref.get();//Promise < DocumentSnapshot < T > >;

                if (profile_pic) {
                    try {
                        const gcsUri = await files.upload.call(this, profile_pic, async (bucketFile) => {
                            const new_name = this.tbl + '/' + snapshot_user.id + '/profile-pic.' + fileUtils.getExtension(bucketFile.name);
                            return new_name;
                        });
                        const updated = await doc_ref.update({profile_pic: gcsUri});//Promise < void >
                    } catch (err) {
                        console.log('contractors create', err)
                    }
                }

//                    console.log('company', company)

                const res = {
                    company,
                    user: {id: snapshot_user.id, data: snapshot_user.data()},
                    access_type: 'ContractorUser'
                };

                const {fname, lname, contractor} = res.user.data;

                await AllUserFuns.sendCreationEmail('ContractorUserSignup',
                        {username, fname, lname, contractorName: contractor.name, contractorUsername: contractor.username});

                const userCredential = await auth2.signInWithEmailAndPassword(username, password);

                self.session.loginUser(res);

                res.user = await ContractorUserFuns.mapResults(res.user);

                return res;
            };

            return AllUserFuns.createOrGetUserID(auth2General, username, password, save);
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
                        if(!password_conf) {
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
        
        // <editor-fold defaultstate="collapsed" desc="relogin">
        async relogin(evt, uid) {
            const onReAuthContractorUser = functions2.httpsCallable('callables-onReAuthContractorUser');
            const res = await onReAuthContractorUser(uid);
            if (!res || !res.data) {
                return null;
            }
            const {data} = res;
            if (isString(data)) {
                return data;
            } else {
                const {token: customToken} = data;
                console.log('relogin contractor customToken')
                const res = await auth2.signInWithCustomToken(customToken).then(async userCredential => {
                    if (!userCredential)
                        return null;
                    const {user} = userCredential;
                    await this.onLogin();
                    return this.loginImpl(user.uid);
                });
                return res;
            }
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="@override getByUsername">
        async getByUsername(evt, username) {
            console.log('getByUsername contractor user')
            username = username.toLowerCase();

            const key = username.isEmailAddress() ? 'username' : 'phone';
            let snapshot = await this.getDB().collection(this.tbl).where(key, '==', username).limit(1).get();
            if (!snapshot || snapshot.empty) {
                const contractors = await Events.get('plugin_sheq_assist/contractors/');
                const contractor = await contractors.find_by_username(username, false);
                if (!contractor) {
                    return "NO_USER_DB";
                }

                snapshot = await this.getDB().collection(this.tbl).where('contractor_id', '==', contractor.id).limit(1).get();
                if (!snapshot.empty) {
                    return {contractor, message: "CONTRACTOR_EMAIL_RESTRICTION"};//setup user account
                }
                return {contractor};//setup user account
            }
            const doc = snapshot.docs[0];
            return {id: doc.id, data: doc.data()};
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

                const {user, user: {data: {client: my_client, project: my_project, site: my_site}}, company, client_id, project_id, site_id} = loggedUser;

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

    const userCntr = new Controller(events, db2);

    // <editor-fold defaultstate="collapsed" desc="auth2.onAuthStateChanged">
    auth2.onAuthStateChanged((user) => {
        const {selfLogin} = userCntr;
    });
    // </editor-fold>

})();//627