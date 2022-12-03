
(() => {
    class Controller extends AController {
        //fname, lname, id_num, passport_num
        constructor(events, db) {
            super(events, db, {singular: "Contractor Document", plural: "Contractor Documents"}, "default/contractor-docs/", "plugin_sheq_assist_contractors_docs");

            const {addAction} = this;

            addAction("answer", this.answer.bind(this));
            addAction("answer/ques", this.answer_ques.bind(this));
//            addAction("list/filter", this.filter.bind(this));
        }

        async answer(evt, id, form) {
            return db.whenLoggedIn(async loggedUser => {
                const doc_ref = await db.collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();
                if (!doc_snapshot.exists) {
                    return null;
                }

                let {title_page_list, questions} = form;
                if (!!title_page_list && title_page_list.anyMatch(v => (!!v.answer && (v.questionType === 'Photo' || v.questionType === 'Document')))) {
                    delete form.title_page_list;
                }
                if (!!questions && questions.anyMatch(v => (!!v.answer && (v.questionType === 'Photo' || v.questionType === 'Document')))) {
                    delete form.questions;
                }

                const upload = (list, path) => {
                    return Promise.all(list.map(async (q, n) => {
                        if (!!q.answer && (q.questionType === 'Photo' || q.questionType === 'Document')) {
                            const gcsUri = await files.upload.call(this, q.answer, async (bucketFile) => {
                                let new_name = this.tbl + '/' + doc_snapshot.id + '/' + path + '-' + n + '/';
                                if (q.questionType === 'Document') {
                                    new_name += 'answers-doc/';
                                } else if (q.questionType === 'Photo') {
                                    new_name += 'answers-photo/';
                                }
                                return new_name + bucketFile.name;
                            }).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                                    throw e;
                            });
                            q.answer = gcsUri;
                        }
                        return q;
                    }));
                };

                if (!form.title_page_list && !!title_page_list) {
                    title_page_list = await upload(title_page_list, 'title_page_list');
                }
                if (!form.questions && !!questions) {
                    questions = await upload(questions, 'questions');
                }

                await doc_ref.set({answered: true, form: {title_page_list, questions}}, {merge: true});//Promise < void >

                doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                form = doc_snapshot.get('form');
                title_page_list = form.title_page_list;
                questions = form.questions;
                return {title_page_list, questions};
            });
        }

        async answer_ques(evt, id, data) {
            return db.whenLoggedIn(async loggedUser => {
                const doc_ref = await db.collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();
                if (!doc_snapshot.exists) {
                    return null;
                }

                const form = doc_snapshot.get('form');

                let {parentId, ques, idx} = data;
                
                const isFile = () => {
                    return !!ques.answer && (ques.questionType === 'Photo' || ques.questionType === 'Document');
                };

                const upload = async (path, q, idx) => {
                    if (!!q.answer && (q.questionType === 'Photo' || q.questionType === 'Document')) {
                        const gcsUri = await files.upload.call(this, q.answer, async (bucketFile) => {
                            let new_name = this.tbl + '/' + doc_snapshot.id + '/' + path + '-' + idx + '/';
                            if (q.questionType === 'Document') {
                                new_name += 'answers-doc/';
                            } else if (q.questionType === 'Photo') {
                                new_name += 'answers-photo/';
                            }
                            return new_name + bucketFile.name;
                        }).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                                    throw e;
                        });
                        q.answer = gcsUri;
                    }
                    return q;
                };

                if (parentId === 'TitlePage') {
                    if (isFile()) {
                        ques = await upload('title_page_list', ques, idx);
                    }
                    form.title_page_list[idx] = ques;
                } else if (parentId === 'Questions') {
                    if (isFile()) {
                        ques = await upload('questions', ques, idx);
                    }
                    form.questions[idx] = ques;
                }

                await doc_ref.set({status: "Unanswered", form}, {merge: true});//Promise < void >
                
                console.log({parentId, ques, idx})

                return {parentId, ques, idx};
            });
        }

        async list(evt) {
            return db.whenLoggedIn(async loggedUser => {
                const now = new Date().getTime();
                console.log('loggedUser', loggedUser);
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    return q.where('email', '==', loggedUser.email);
                });
                return list;
            });
        }

        sortBy() {
            return 'form.name';
        }

    }

    new Controller(events, db);
})();

(() => {
    class Controller extends AController {
        //fname, lname, id_num, passport_num
        constructor(events, db) {
            super(events, db, {singular: "Shared Document", plural: "Shared Documents"}, "default/shared-docs/", "sheqassist_shared_docs");

            const {addAction} = this;
            addAction("edit/file", this.editFile.bind(this));

//            addAction("list/filter", this.filter.bind(this));
        }

        async create(evt, data) {
            if (!data.status) {
                data.status = 'Pending';
            }
            return this.createAndUploadIfFile(evt, data, ["proof_of_payment", "proof_of_residence", "identity_copy"]);
        }

        async editFile(evt, ...args) {
            return db.whenLoggedIn(async loggedUser => {
                const execFun = functions.httpsCallable('execFun');
                const param = {path: "plugin_sheq_assist/Documents/edit/file", data: args};
                console.log('editFile', param)
                const res = await execFun(param);
                return res;
            });
        }

        async list(evt) {
            return db.whenLoggedIn(async loggedUser => {
                const now = new Date().getTime();
                console.log('loggedUser', loggedUser);
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    return q.where('doc_expiry_date', '>', now).where('email', '==', loggedUser.email);
                });
                list = await Promise.all(list.map(async item => {
                    item = {...item};
                    let document = await item.data.doc_ref.get();
                    item.data.doc_ref = {id: document.id, data: document.data()};
                    return item;
                }));
                return list;
            });
        }

        sortBy() {
            return 'doc_expiry_date';
        }

    }

    new Controller(events, db);
})();

(function() {
    class Controller extends AController {
        //fname, lname, email, message
        constructor(events, db) {
            super(events, db, {singular: "Error Reporting", plural: "Error Reporting"}, "error-reporting/", "default_error_reporting");
        }

        async create(evt, data) {
            const doc_ref = await db.collection(this.tbl).add(data);//Promise < DocumentReference < T > >
            let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
            
            const {message, stack, error_info} = data;
            
            const d = new Date();
            
            const opts = {
                from: '"SHEQ Assist - Support" <support@sheqsolve.com>',
                to: "support@sheqsolve.com",
                subject: 'Error Reporting',
                html: '<h3>System Error</h3>\n\
                <p>Date & Time: ' + d + '</p>\n\
                <p><b>------Message------</b></p>\n\
                <p>' + message + '</p>\n\
                <p><b>------Error------</b></p>\n\
                <p>' + stack + '</p>\n\
                <p><b>------Error Info------</b></p>\n\
                <p>' + error_info + '</p>'
            };
            
            const mailRes = await EmailUtils.send(opts);
            console.log('mailRes', mailRes)
            return true;
        }
    }
    
    new Controller(events, db);
})();

(() => {
    class Controller extends AController {
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events, db) {
            super(events, db, {singular: "Country", plural: "Countries"}, "countries/", "default_countries", "unauthorized");
            this.search_by_name = this.search_by_name.bind(this);
            const {addAction, search_by_name} = this;
            addAction("list/search_by_name", search_by_name);
        }

        async list(evt) {
            const doc_ref = await db.collection(this.tbl).doc("countries");//Promise < DocumentReference < T > >
            const snapshot = await doc_ref.get();
            const {items} = snapshot.data();
            items.sortBy('data.name');
            return items;
        }

        async search_by_name(evt, search_val) {
            return this.filter_by(evt, search_val, search_val => {
                return val => {
                    const {name} = val.data;
                    return name.toLowerCase().startsWith(search_val)
                };
            });
        }
    }
    
    new Controller(events, db);
})();

(function() {
    class Controller extends AController {
        //fname, lname, email, message
        constructor(events, db) {
            super(events, db, {singular: "Support", plural: "Support"}, "support/", "default_support");
        }

        async create(evt, data) {
            const doc_ref = await db.collection(this.tbl).add(data);//Promise < DocumentReference < T > >
            let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
            const opts = {
                from: '"SHEQ Assist - Support" <support@sheqsolve.com>',
                to: "support@sheqsolve.com",
                subject: 'Support',
                html: '<h3><b>Message Details</b></h3>\n\
                <p>From: ' + data.fname + ' ' + data.lname + '</p>\n\
                <p>Email: ' + data.email + '</p>\n\
                <p>' + data.message + '</p>'
            };
            const mailRes = await EmailUtils.send(opts);
            console.log('mailRes', mailRes)
            return true;
        }
    }
    
    new Controller(events, db);
})();

(function() {
    class Controller extends AController {
        //fname, lname, email, message
        constructor(events, db) {
            super(events, db, {singular: "Feedback", plural: "Feedbacks"}, "feedback/", "default_feedback");
        }

        async create(evt, data) {
            const doc_ref = await db.collection(this.tbl).add(data);//Promise < DocumentReference < T > >
            let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
            const opts = {
                from: '"SHEQ Assist - Feedback" <support@sheqsolve.com>',
                to: "support@sheqsolve.com",
                subject: 'Feedback',
                html: '<h3><b>Message Details</b></h3>\n\
                <p>From: ' + data.fname + ' ' + data.lname + '</p>\n\
                <p>Email: ' + data.email + '</p>\n\
                <p>' + data.message + '</p>'
            };
            const mailRes = await EmailUtils.send(opts);
            console.log('mailRes', mailRes)
            return true;
        }
    }
    
    new Controller(events, db);
})();


(function () {
    class Controller extends AController {

        constructor(events, db) {
            super(events, db, {singular: "Administrator / User", plural: "Administrators / Users"}, "users/accounts/");

            const {addAction} = this;
            addAction("login", this.login.bind(this));
            addAction("logout", this.logout.bind(this));
        }

        async login(evt, data) {
            const {username, password} = data;
            const res = await auth.signInWithEmailAndPassword(username, password).then(async userCredential => {//{user}
                return true;
            }).catch(err => {
                console.error('login', err)
                if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/network-request-failed") {
                    return null;
                } else if (err.code === "auth/too-many-requests") {
                    return err.code;
                } else {//"Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later."
                    throw err;
                }
            });
//            console.log('login', res)
            return res;
        }

        async logout(evt) {
            return db.whenLoggedIn(loggedUser => {
                return auth.signOut().then(() => true);
            });
        }
    }

    const userCntr = new Controller(events, db);

    auth.onAuthStateChanged(userCredential => {
        console.log('userCredential', userCredential);
        if (userCredential) {
            const {uid, email} = userCredential;
            db.session.loginUser({uid, email});
            self.emit(userCntr.root + 'login', {uid, email});
        } else if (db.session.isLoggedIn()) {
            db.session.logout();
            self.emit(userCntr.root + 'logout', !db.session.isLoggedIn());
        } else {
            self.emit(userCntr.root + 'login');
        }
    });
})();

(function() {
    class Controller extends AController {
        constructor(events, db) {
            super(events, db, {singular: "Administrator / User", plural: "Administrators / Users"}, "users/update/");

            this.tbl = 'default_users';

            this.update_profile_user = this.update_profile_user.bind(this);
            this.upload_profile_user = this.upload_profile_user.bind(this);

            const {addAction, update_profile_user, upload_profile_user} = this;
            
            addAction("profile/user", update_profile_user);
            addAction("upload/profile-pic/user", upload_profile_user);
        }

        async update_profile_user(evt, data) {
            return db.whenLoggedIn(async loggedUser => {
                const doc_ref = await db.collection(this.tbl).doc(loggedUser.id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                const updated = await doc_ref.update(data);//Promise < void >

                return true;
            });
        }

        async upload_profile_user(evt, id, path) {
            return db.whenLoggedIn(async loggedUser => {
                const doc_ref = await db.collection(this.tbl).doc(id);
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

                if (loggedUser.id === id) {
                    loggedUser.data.profile_pic = profile_pic;
                }
                return profile_pic;
            });
        }
    }

    new Controller(events, db);
})();
//importScripts(self.locationRoot + "/js/web-workers/controllers/default/users/account.js");
//importScripts(self.locationRoot + "/js/web-workers/controllers/default/users/update.js");

(function() {
    class Controller extends AController {
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events, db) {
            super(events, db, {singular: "Administrator / User", plural: "Administrators / Users"}, "users/", "default_users");

            this.send_app_link = this.send_app_link.bind(this);
            this.filter = this.filter.bind(this);
            this.search_by_name = this.search_by_name.bind(this);
            
            const {addAction, send_app_link, filter, search_by_name} = this;
            
            addAction("send-app-link", send_app_link);
            addAction("list/filter", filter);
            addAction("list/search_by_name", search_by_name);
        }

        async send_app_link(evt, id) {
            return db.whenLoggedIn(async loggedUser => {
                const item = await this.find_by_id(evt, id);
                if (item) {
                    const {id, data: {password, username, fname, lname}} = item;
                    if (username) {
                        const opts = {
                            from: '"SHEQ Assist" <support@sheqsolve.com>',
                            to: username,
                            subject: 'SHEQ Assist Application Link',
                            html: '<h3><b>Dear ' + fname + ' ' + lname + '</b></h3>\n\
                                <p>If you have not yet used SHEQ Assist Application, please use the link below to download the application.</p>\n\
                                <p>Your SHEQ Assist Username is <b>' + username + '</b>, Password is <b>' + password + '</b></p>\n\
                                <p>You are strongly adviced to change your password as soon as you login in to SHEQ Assist account</p>\n\
                                <p>Please click <a href="https://storage.googleapis.com/trading-ls.appspot.com/app/sheqassist-covid-1.0.0.exe">here</a> to download the application and use the above username and password to login.</p>\n\
                                <p>Yours Sincerely<br/>SHEQ Assist</p>'
                        };
                        const mailRes = await EmailUtils.send(opts);
                        console.log('mailRes', mailRes)
                        
                        return true;
                    }
                    return "NO_EMAIL";
                }

                return "NOT_FOUND";
            });
        }

        async search_by_name(evt, name) {
            return await this.filter(evt, {name});
        }

        async filter(evt, search_val) {
            return db.whenLoggedIn(async loggedUser => {
                const {name, user_type} = search_val;
                const q = [
                    [
                        {key: 'fname', comp: 'LIKE', val: name},
                        {key: 'lname', comp: 'LIKE', val: name}
                    ],
                    {key: 'user_type', comp: '=', val: user_type}
                ];
                return this.filter_impl(evt, q);
            });
        }

        sortBy(list) {
            list.sortBy("data.lname");
        }
    }
    
    new Controller(events, db);
})();