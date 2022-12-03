//importScripts(self.locationRoot + "/js/web-workers/controllers/default/users/account.js");
//importScripts(self.locationRoot + "/js/web-workers/controllers/default/users/update.js");

(function () {
    class Controller extends AControllerRead {
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events, db) {
            super(events, db, {singular: "Administrator / User", plural: "Administrators / Users"}, "users/", "default_users");

            this.send_app_link = this.send_app_link.bind(this);
            this.filter = this.filter.bind(this);
            this.search_by_name = this.search_by_name.bind(this);
            this.filter_by_notification_key = this.filter_by_notification_key.bind(this);

            const {addAction, send_app_link, filter, search_by_name} = this;

            addAction("send-app-link", send_app_link);
            addAction("list/filter", filter);
            addAction("list/search_by_name", search_by_name);

            const fn = async (tbl) => {
                console.log('start', tbl)
                const doc_ref = await this.getDB().collection(tbl);//Promise < DocumentReference < T > >
                const querySnapshot = await doc_ref.get();
                const uidList = [];
                const list = [];
                querySnapshot.forEach((doc) => {
                    list.push(doc);
                });

                await Promise.all(list.map(async (doc) => {
                    let {permissions_modules} = doc.data();
                    if(!permissions_modules) return console.log('permissions_modules', doc.id, 'n/a', doc.data());
//                    permissions_modules = permissions_modules.map(v => {
//                        if (v.key === 'COVID_Management') {
//                            v.key = '__A_COVID_Management';
//                        } else if (v.key === 'Contractors') {
//                            v.key = '__B_Contractors';
//                        } else if (v.key === 'Structure_And_Responsibility') {
//                            v.key = '__C_Structure_And_Responsibility';
//                        } else if (v.key === 'Hazardous_Chemical_Substances') {
//                            v.key = '_13_2_3_Hazardous_Chemical_Substances';
//                        }
//                        return v;
//                    });
//
//                    const doc_ref = await this.getDB().collection(tbl).doc(doc.id);
//                    await doc_ref.set({permissions_modules}, {merge: true});
//                    console.log(tbl, doc.id)
                }));
                console.log('end', tbl)
            };
            (async () => {
                await fn('default_users');
            })();

//            const fn = async n => {
//                const today = new Date().setMidnight();
//                console.log("start...", n, today)
//                const tbl = "default_audit_trail";
//                const doc_ref = db2.collection(tbl).orderBy('created_at').
//                        where('created_at', '>=', today.getTime());//.startAt(n).limit(1000);//Promise < DocumentReference < T > >
//                const snapshot = await doc_ref.get();
//                console.log("snapshot size", snapshot.size)
////                const list = [];
////                snapshot.forEach(doc => {
////                    list.push(doc);
////                });
////                await Promise.all(list.map(async doc => {
////                    const ref = db2.collection(tbl).doc(doc.id);
////                    await ref.set(doc.data());
////                    console.log(doc.id, "done")
////                }));
////                console.log("all done", n)
//            };
//            fn(0);
//            fn(1001);
//            fn(2001);
//            fn(3001);
//            fn(4001);
//            fn(5001);
//            fn(6001);
//            fn(7001);
//            fn(8001);
//            fn(9001);
        }

        // <editor-fold defaultstate="collapsed" desc="send_app_link">
        async send_app_link(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
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
                                <p>Please click <a href="https://sheqsolve.web.app/updater/sheqsolve-1.0.0.exe">here</a> to download the application and use the above username and password to login.</p>\n\
                                <p>Kind Regards<br/>SHEQ Assist</p>'
                        };
                        const sendEmail = functions.httpsCallable('callables-sendEmail');
                        const mailRes = await sendEmail(opts);
                        console.log('mailRes', mailRes)

                        return true;
                    }
                    return "NO_EMAIL";
                }

                return "NOT_FOUND";
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="search_by_name">
        async search_by_name(evt, searchText) {
            return await this.list(evt, {searchText});
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            let {searchText = ""} = opts;
            searchText = searchText.toLowerCase();
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, createDbFilter(searchText));
                list = await Promise.all(list.map(mapResults));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name = "", user_type} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    if (user_type) {
                        q = q.where('user_type', '==', user_type);
                    }
                    const filter = createDbFilter(name);
                    return filter(q);
                });
                list = await Promise.all(list.map(mapResults));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_by_notification_key">
        async filter_by_notification_key(evt, key, value) {
            return Events.whenLoggedIn(async loggedUser => {
                const name = "";
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    if (key) {
                        q = q.where(key, '==', value);
                    }
                    const filter = createDbFilter(name);
                    return filter(q);
                });
                list = await Promise.all(list.map(mapResults));
                return list;
            });
        }
        // </editor-fold>

        sortBy() {
            return "lname";
        }
    }

    // <editor-fold defaultstate="collapsed" desc="createDbFilter">
    function createDbFilter(searchText) {
        return q => {
            return q.where("keywords", "array-contains", searchText);
        };
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="mapResults">
    async function mapResults(item) {
        let {data: {client, project, site, client_id, project_id, site_id}} = item;
        const promise = [];
        if ((client && isObject(client) && !client.data) || client_id) {
            promise.push(Events.get('plugin_sheq_assist/clients/').then(clients => {
                return clients.find_by_id.call(clients, null, client ? client.id || client_id : client_id);
            }).then(val => {
                item.data.client = val;
            }));
        }
        if ((project && isObject(project) && !project.data) || project_id) {
            promise.push(Events.get('plugin_sheq_assist/projects/').then(projects => {
                return projects.find_by_id.call(projects, null, project ? project.id || project_id : project_id);
            }).then(val => {
                item.data.project = val;
            }));
        }
        if ((site && isObject(site) && !site.data) || site_id) {
            promise.push(Events.get('plugin_sheq_assist/sites/').then(sites => {
                return sites.find_by_id.call(sites, null, site ? site.id || site_id : site_id);
            }).then(val => {
                item.data.site = val;
            }));
        }
        await Promise.all(promise);
        return item;
    }
    // </editor-fold>

    new Controller(events, db);
})();