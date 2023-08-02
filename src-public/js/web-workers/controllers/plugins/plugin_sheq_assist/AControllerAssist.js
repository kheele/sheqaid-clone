
class AControllerAid extends AControllerRead {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(events, db, name, root, tbl, fn) {
        super(events, db, name, root, tbl, fn);

        const {addAction} = this;
        addAction("share", this.share.bind(this));
        addAction("list/calendar", this.listByCalendar.bind(this));
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="create">
    async create(evt, data) {
        return Events.whenLoggedIn(async loggedUser => {
            this.injectSavable(evt, loggedUser, data);

            const {
                created_at, company_id, user_id,
                site, project, client
            } = data;
            if (typeof site === 'string') {
                if (site !== 'All') {
                    const _data = {name: site, user_id, company_id, created_at};
                    const site_doc_ref = await this.getDB().collection('plugin_sheq_assist_sites').add(_data);//Promise < DocumentReference < T > >
                    const site_doc_snapshot = await site_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    data.site = {id: site_doc_snapshot.id, name: site_doc_snapshot.data().name};
                    data.site_id = site_doc_snapshot.id;
                } else {
                    data.site = null;
                    data.site_id = null;
                }
            } else if (site) {
                data.site_id = site.id;
            }
            if (typeof project === 'string') {
                if (project !== 'All') {
                    const _data = {name: project, user_id, company_id, created_at};
                    const project_doc_ref = await this.getDB().collection('plugin_sheq_assist_projects').add(_data);//Promise < DocumentReference < T > >
                    const project_doc_snapshot = await project_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    data.project = {id: project_doc_snapshot.id, name: project_doc_snapshot.data().name};
                    data.project_id = project_doc_snapshot.id;
                } else {
                    data.project = null;
                    data.project_id = null;
                }
            } else if (project) {
                data.project_id = project.id;
            }
            if (typeof client === 'string') {
                if (client !== 'All') {
                    const _data = {name: client, user_id, company_id, created_at};
                    const client_doc_ref = await this.getDB().collection('plugin_sheq_assist_clients').add(_data);//Promise < DocumentReference < T > >
                    const client_doc_snapshot = await client_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    data.client = {id: client_doc_snapshot.id, name: client_doc_snapshot.data().name};
                    data.client_id = client_doc_snapshot.id;
                } else {
                    data.client = null;
                    data.client_id = null;
                }
            } else if (client) {
                data.client_id = client.id;
            }

            const db_data = await this.getDB().collection(this.tbl).add(data);
            const snapshot = await db_data.get();

            data = snapshot.data();
            const {created_at: created_at2} = data;
            if (created_at2 && created_at2.toDate) {
                data.created_at = created_at2.toDate();
            }

            const auditData = {id: snapshot.id, data};

            this.createAudit(loggedUser, data.created_at.getTime(), auditData);

            return auditData;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="update">
    async update(evt, id, updateAttrs) {
        return Events.whenLoggedIn(async loggedUser => {
            const doc_ref = await this.getDB().collection(this.tbl).doc(id);
            let snapshot = await doc_ref.get();
            if (!snapshot.exists) {
                return null;
            }

            const old_data = snapshot.data();
            const {created_at} = old_data;
            if (created_at && created_at.toDate) {
                old_data.created_at = created_at.toDate();
            }

//            this.injectSavable(evt, loggedUser, updateAttrs, true);

            if ('site' in updateAttrs) {
                if (updateAttrs.site === 'All' || updateAttrs.site === null) {
                    updateAttrs.site = null;
                    updateAttrs.site_id = null;
                } else if(updateAttrs.site) {
                    updateAttrs.site_id = updateAttrs.site.id;
                }
            }
            if ('project' in updateAttrs) {
                if (updateAttrs.project === 'All' || updateAttrs.project === null) {
                    updateAttrs.project = null;
                    updateAttrs.project_id = null;
                } else if(updateAttrs.project) {
                    updateAttrs.project_id = updateAttrs.project.id;
                }
            }
            if ('client' in updateAttrs) {
                if (updateAttrs.client === 'All' || updateAttrs.client === null) {
                    updateAttrs.client = null;
                    updateAttrs.client_id = null;
                } else if(updateAttrs.client) {
                    updateAttrs.client_id = updateAttrs.client.id;
                }
            }

            const updated = await doc_ref.set(updateAttrs, {merge: true});//Promise < void >
            snapshot = await doc_ref.get();

            let data = snapshot.data();
            const {created_at: created_at_2} = data;
            if (created_at_2 && created_at_2.toDate) {
                data.created_at = created_at_2.toDate();
            }

            const auditData = {id: snapshot.id, data: old_data};

            this.editAudit(loggedUser, new Date().getTime(), auditData);

            return data;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="share">
    async share(evt, id, data) {
        return Events.whenLoggedIn(async loggedUser => {
            const doc_ref = await this.getDB().collection(this.tbl).doc(id);
            let snapshot = await doc_ref.get();
            if (!snapshot.exists) {
                return "NO_EXIST";
            }

            const sharedDocData = snapshot.data();

            this.injectSavable(evt, loggedUser, data);

            const {email} = data;
            const getUserUidAndPassword = async () => {
                const getUserUidAndPasswordByEmail = functions.httpsCallable('callables-getUserUidAndPasswordByEmail');
                const res = await getUserUidAndPasswordByEmail(email);
                if (res !== null) {
                    return res;
                } else {
                    try {
                        let password = uuidv4();
                        password = password.substring(0, password.indexOf('-'));
                        const userCredential = await authGeneral.createUserWithEmailAndPassword(email, password);
                        await authGeneral.signOut();
                        const {uid} = userCredential.user;
                        return {uid, password};
                    } catch (err) {
                        console.log(err)
                        throw err;
                    }
                }
            };

            try {
                const {uid, password} = await getUserUidAndPassword();
                data.uid = uid;
                data.password = password;
                data.doc_ref = doc_ref;
                data.doc_tbl = this.tbl;
                data.doc_name = this.name;
                data.doc_id = id;
                //            {fname, lname, email, doc_expiry_date, allow_doc_editing}
                const db_data = await db2.collection("sheqassist_shared_docs").add(data);
                snapshot = await db_data.get();

                data = snapshot.data();
                const {created_at} = data;
                if (created_at && created_at.toDate) {
                    data.created_at = created_at.toDate();
                }

                const {fname, lname, doc_expiry_date, allow_doc_editing} = data;
                const opts = {
                    from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
                    to: email,
                    subject: this.name.singular + ' Document From SHEQ Aid',
                    html: '<h3><b>Dear ' + data.fname + ' ' + data.lname + '</b></h3>\n\
                                    <p>You have been sent a link to view ' + this.name.singular + ' Document.</p>\n\
                                    <hr />\n\
                                    <p>Document Title: <b>' + (sharedDocData.title || this.name.singular) + '</b></p>\n\
                                    <p>Document Editing Allowed: <b>' + (allow_doc_editing || "No") + '</b></p>\n\
                                    <hr />\n\
                                    <p>You will be required to use the following details to view the document</p>\n\
                                    <p>Username: <b>' + email + '</b><br />Password: <b>' + password + '</b></p>\n\
                                    <hr />\n\
                                    <p>The link expires on: <b>' + Dates.formatDate(doc_expiry_date) + '</b></p>\n\
                                    <p>Please click <a href="' + self.locationRoot + 'remote/shared-docs">here</a> to view the document details.</p>\n\
                                    <p>Kind Regards<br/>SHEQ Aid</p>'
                };
                await Utils.sendEmail(opts);

                delete data.doc_ref;
                const auditData = {id: snapshot.id, data};

                this.shareAudit(loggedUser, data.created_at.getTime(), auditData);

                return auditData;
            } catch (err) {
                console.log(err)
                throw err;
            }
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="createAndUploadIfFile">
    async createAndUploadIfFile(evt, data, fileName, onPreCb) {
        return Events.whenLoggedIn(async loggedUser => {
            this.injectSavable(evt, loggedUser, data);
            if (onPreCb) {
                if (onPreCb instanceof Promise) {
                    await onPreCb(data);
                } else {
                    onPreCb(data);
                }
            }

            fileName = isArray(fileName) ? fileName : [fileName];
            fileName = fileName.filter(fileName => !!data[fileName]).map(name => {
                const file = data[name];
                delete data[name];
                return {file, name};
            });
            console.log("fileName", fileName)

            const {
                created_at, company_id, user_id,
                site, project, client
            } = data;
            if (typeof site === 'string') {
                if (site !== 'All') {
                    const _data = {name: site, user_id, company_id, created_at};
                    const site_doc_ref = await this.getDB().collection('plugin_sheq_assist_sites').add(_data);//Promise < DocumentReference < T > >
                    const site_doc_snapshot = await site_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    data.site = {id: site_doc_snapshot.id, name: site_doc_snapshot.data().name};
                    data.site_id = site_doc_snapshot.id;
                } else {
                    data.site = null;
                    data.site_id = null;
                }
            } else if (site) {
                data.site_id = site.id;
            }
            if (typeof project === 'string') {
                if (project !== 'All') {
                    const _data = {name: project, user_id, company_id, created_at};
                    const project_doc_ref = await this.getDB().collection('plugin_sheq_assist_projects').add(_data);//Promise < DocumentReference < T > >
                    const project_doc_snapshot = await project_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    data.project = {id: project_doc_snapshot.id, name: project_doc_snapshot.data().name};
                    data.project_id = project_doc_snapshot.id;
                } else {
                    data.project = null;
                    data.project_id = null;
                }
            } else if (project) {
                data.project_id = project.id;
            }
            if (typeof client === 'string') {
                if (client !== 'All') {
                    const _data = {name: client, user_id, company_id, created_at};
                    const client_doc_ref = await this.getDB().collection('plugin_sheq_assist_clients').add(_data);//Promise < DocumentReference < T > >
                    const client_doc_snapshot = await client_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    data.client = {id: client_doc_snapshot.id, name: client_doc_snapshot.data().name};
                    data.client_id = client_doc_snapshot.id;
                } else {
                    data.client = null;
                    data.client_id = null;
                }
            } else if (client) {
                data.client_id = client.id;
            }

            const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
            let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

            await Promise.all(fileName.map(async ({file, name}) => {
                const gcsUri = await files.upload.call(this, file, async function (bucketFile) {
                    const name = fileUtils.getFileName(file).replaceAll(' ', '_');
                    const new_name = this.tbl + '/' + doc_snapshot.id + '/' + name;
                    return new_name;
                }.bind(this)).catch(e => {
//                    doc_ref.delete();//Promise < void >
//                    throw e;
                });
                const updateAttrs = {};
                updateAttrs[name] = gcsUri;
                const updated = await doc_ref.update(updateAttrs);//Promise < void >
                console.log(data, file)
            }));

            doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
            data = doc_snapshot.data();
            const {created_at: created_at2} = data;
            if (created_at2 && created_at2.toDate) {
                data.created_at = created_at2.toDate();
            }

            const auditData = {id: doc_snapshot.id, data};

            this.createAudit(loggedUser, data.created_at.getTime(), auditData);

            return auditData;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="createAndUploadHasFile">
    async createAndUploadHasFile(evt, data, fileName, onPreCb) {
        return Events.whenLoggedIn(async loggedUser => {
            this.injectSavable(evt, loggedUser, data);
            onPreCb && onPreCb(data);

            const file = data[fileName];
            delete data[fileName];

            const {
                created_at, company_id, user_id,
                site, project, client
            } = data;
            if (typeof site === 'string') {
                if (site !== 'All') {
                    const _data = {name: site, user_id, company_id, created_at};
                    const site_doc_ref = await this.getDB().collection('plugin_sheq_assist_sites').add(_data);//Promise < DocumentReference < T > >
                    const site_doc_snapshot = await site_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    data.site = {id: site_doc_snapshot.id, name: site_doc_snapshot.data().name};
                    data.site_id = site_doc_snapshot.id;
                } else {
                    data.site = null;
                    data.site_id = null;
                }
            } else if (site) {
                data.site_id = site.id;
            }
            if (typeof project === 'string') {
                if (project !== 'All') {
                    const _data = {name: project, user_id, company_id, created_at};
                    const project_doc_ref = await this.getDB().collection('plugin_sheq_assist_projects').add(_data);//Promise < DocumentReference < T > >
                    const project_doc_snapshot = await project_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    data.project = {id: project_doc_snapshot.id, name: project_doc_snapshot.data().name};
                    data.project_id = project_doc_snapshot.id;
                } else {
                    data.project = null;
                    data.project_id = null;
                }
            } else if (project) {
                data.project_id = project.id;
            }
            if (typeof client === 'string') {
                if (client !== 'All') {
                    const _data = {name: client, user_id, company_id, created_at};
                    const client_doc_ref = await this.getDB().collection('plugin_sheq_assist_clients').add(_data);//Promise < DocumentReference < T > >
                    const client_doc_snapshot = await client_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    data.client = {id: client_doc_snapshot.id, name: client_doc_snapshot.data().name};
                    data.client_id = client_doc_snapshot.id;
                } else {
                    data.client = null;
                    data.client_id = null;
                }
            } else if (client) {
                data.client_id = client.id;
            }

            const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
            let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

            const gcsUri = await files.upload.call(this, file, async function (bucketFile) {
                const name = fileUtils.getFileName(file).replaceAll(' ', '_');
                const new_name = this.tbl + '/' + doc_snapshot.id + '/' + name;
                return new_name;
            }.bind(this)).catch(e => {
//                doc_ref.delete();//Promise < void >
//                throw e;
            });
            const updateAttrs = {};
            updateAttrs[fileName] = gcsUri;
            const updated = await doc_ref.update(updateAttrs);//Promise < void >

            doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
            data = doc_snapshot.data();
            const {created_at: created_at2} = data;
            if (created_at2 && created_at2.toDate) {
                data.created_at = created_at2.toDate();
            }

            const auditData = {id: doc_snapshot.id, data};

            this.createAudit(loggedUser, data.created_at.getTime(), auditData);

            return auditData;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="createAndUploadIfManyFiles">
    async createAndUploadIfManyFiles(evt, data, fileName, onPreCb) {
        return Events.whenLoggedIn(async loggedUser => {
            this.injectSavable(evt, loggedUser, data);
            if (onPreCb) {
                if (onPreCb instanceof Promise) {
                    await onPreCb(data);
                } else {
                    onPreCb(data);
                }
            }

            fileName = isArray(fileName) ? fileName : [fileName];
            fileName = fileName.filter(fileName => !!data[fileName]).map(name => {
                const files = data[name];
                delete data[name];
                return {files, name};
            });
            console.log("fileName", fileName)

            const {
                created_at, company_id, user_id,
                site, project, client
            } = data;
            if (typeof site === 'string') {
                if (site !== 'All') {
                    const _data = {name: site, user_id, company_id, created_at};
                    const site_doc_ref = await this.getDB().collection('plugin_sheq_assist_sites').add(_data);//Promise < DocumentReference < T > >
                    const site_doc_snapshot = await site_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    data.site = {id: site_doc_snapshot.id, name: site_doc_snapshot.data().name};
                    data.site_id = site_doc_snapshot.id;
                } else {
                    data.site = null;
                    data.site_id = null;
                }
            } else if (site) {
                data.site_id = site.id;
            }
            if (typeof project === 'string') {
                if (project !== 'All') {
                    const _data = {name: project, user_id, company_id, created_at};
                    const project_doc_ref = await this.getDB().collection('plugin_sheq_assist_projects').add(_data);//Promise < DocumentReference < T > >
                    const project_doc_snapshot = await project_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    data.project = {id: project_doc_snapshot.id, name: project_doc_snapshot.data().name};
                    data.project_id = project_doc_snapshot.id;
                } else {
                    data.project = null;
                    data.project_id = null;
                }
            } else if (project) {
                data.project_id = project.id;
            }
            if (typeof client === 'string') {
                if (client !== 'All') {
                    const _data = {name: client, user_id, company_id, created_at};
                    const client_doc_ref = await this.getDB().collection('plugin_sheq_assist_clients').add(_data);//Promise < DocumentReference < T > >
                    const client_doc_snapshot = await client_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    data.client = {id: client_doc_snapshot.id, name: client_doc_snapshot.data().name};
                    data.client_id = client_doc_snapshot.id;
                } else {
                    data.client = null;
                    data.client_id = null;
                }
            } else if (client) {
                data.client_id = client.id;
            }

            const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
            let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

            await Promise.all(fileName.map(async ({files: _files, name}) => {
                const resFiles = await Promise.all(_files.map(async (file, n) => {
                    const gcsUri = await files.upload.call(this, file, async function (bucketFile) {
                        const name = fileUtils.getFileName(file).replaceAll(' ', '_');
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/' + n + '_' + name;
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                        throw e;
                    });
                    return gcsUri;
                }));

                const updateAttrs = {};
                updateAttrs[name] = resFiles;
                const updated = await doc_ref.update(updateAttrs);//Promise < void >
                console.log(data, _files)
            }));

            doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
            data = doc_snapshot.data();
            const {created_at: created_at2} = data;
            if (created_at2 && created_at2.toDate) {
                data.created_at = created_at2.toDate();
            }

            const auditData = {id: doc_snapshot.id, data};

            this.createAudit(loggedUser, data.created_at.getTime(), auditData);

            return auditData;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="createAndUploadHasManyDocs">
    async createAndUploadHasManyDocs(evt, data, onPreCb) {
        return Events.whenLoggedIn(async loggedUser => {
            this.injectSavable(evt, loggedUser, data);

            let {doc} = data;
            delete data.doc;

            const {
                created_at, company_id, user_id,
                site, project, client
            } = data;
            if (typeof site === 'string') {
                if (site !== 'All') {
                    const _data = {name: site, user_id, company_id, created_at};
                    const site_doc_ref = await this.getDB().collection('plugin_sheq_assist_sites').add(_data);//Promise < DocumentReference < T > >
                    const site_doc_snapshot = await site_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    data.site = {id: site_doc_snapshot.id, name: site_doc_snapshot.data().name};
                    data.site_id = site_doc_snapshot.id;
                } else {
                    data.site = null;
                    data.site_id = null;
                }
            } else if (site) {
                data.site_id = site.id;
            }
            if (typeof project === 'string') {
                if (project !== 'All') {
                    const _data = {name: project, user_id, company_id, created_at};
                    const project_doc_ref = await this.getDB().collection('plugin_sheq_assist_projects').add(_data);//Promise < DocumentReference < T > >
                    const project_doc_snapshot = await project_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    data.project = {id: project_doc_snapshot.id, name: project_doc_snapshot.data().name};
                    data.project_id = project_doc_snapshot.id;
                } else {
                    data.project = null;
                    data.project_id = null;
                }
            } else if (project) {
                data.project_id = project.id;
            }
            if (typeof client === 'string') {
                if (client !== 'All') {
                    const _data = {name: client, user_id, company_id, created_at};
                    const client_doc_ref = await this.getDB().collection('plugin_sheq_assist_clients').add(_data);//Promise < DocumentReference < T > >
                    const client_doc_snapshot = await client_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    data.client = {id: client_doc_snapshot.id, name: client_doc_snapshot.data().name};
                    data.client_id = client_doc_snapshot.id;
                } else {
                    data.client = null;
                    data.client_id = null;
                }
            } else if (client) {
                data.client_id = client.id;
            }

            const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
            let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

            doc = await Promise.all(doc.map(async ({doc_rev_num, doc_rev_date, doc}) => {
                const gcsUri = await files.upload.call(this, doc, async function (bucketFile) {
                    const name = fileUtils.getFileName(doc).replaceAll(' ', '_');
                    const new_name = this.tbl + '/' + doc_snapshot.id + '/' + doc_rev_num + '/' + name;
                    return new_name;
                }.bind(this)).catch(e => {
//                    doc_ref.delete();//Promise < void >
//                    throw e;
                });
                const d = {doc_rev_num, doc: gcsUri};
                if (doc_rev_date) {
                    d.doc_rev_date = doc_rev_date;
                }
                return d;
            }));

            const updated = await doc_ref.update({doc});//Promise < void >

            doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
            data = doc_snapshot.data();
            const {created_at: created_at2} = data;
            if (created_at2 && created_at2.toDate) {
                data.created_at = created_at2.toDate();
            }
            return {id: doc_snapshot.id, data};
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="updateAndUploadIfFile">
    async updateAndUploadIfFile(evt, id, updateAttrs, fileName, onPreCb) {
        return Events.whenLoggedIn(async loggedUser => {
            const doc_ref = await this.getDB().collection(this.tbl).doc(id);
            let snapshot = await doc_ref.get();
            if (!snapshot.exists) {
                return null;
            }

            const old_data = snapshot.data();
            const {created_at} = old_data;
            if (created_at && created_at.toDate) {
                old_data.created_at = created_at.toDate();
            }

            onPreCb && onPreCb(updateAttrs);
            if (onPreCb) {
                if (onPreCb instanceof Promise) {
                    await onPreCb(updateAttrs);
                } else {
                    onPreCb(updateAttrs);
                }
            }

            fileName = isArray(fileName) ? fileName : [fileName];
            fileName = fileName.filter(fileName => !!updateAttrs[fileName]).map(name => {
                const file = updateAttrs[name];
                delete updateAttrs[name];
                return {file, name};
            }).filter(({file, name}) => isFile(file));
            console.log("fileName", fileName)

            if ('site' in updateAttrs) {
                if (updateAttrs.site === 'All' || updateAttrs.site === null) {
                    updateAttrs.site = null;
                    updateAttrs.site_id = null;
                } else if(updateAttrs.site) {
                    updateAttrs.site_id = updateAttrs.site.id;
                }
            }
            if ('project' in updateAttrs) {
                if (updateAttrs.project === 'All' || updateAttrs.project === null) {
                    updateAttrs.project = null;
                    updateAttrs.project_id = null;
                } else if(updateAttrs.project) {
                    updateAttrs.project_id = updateAttrs.project.id;
                }
            }
            if ('client' in updateAttrs) {
                if (updateAttrs.client === 'All' || updateAttrs.client === null) {
                    updateAttrs.client = null;
                    updateAttrs.client_id = null;
                } else if(updateAttrs.client) {
                    updateAttrs.client_id = updateAttrs.client.id;
                }
            }

            let updated = await doc_ref.update(updateAttrs);//Promise < void >

            await Promise.all(fileName.map(async ({file, name}) => {
                const gcsUri = await files.upload.call(this, file, async function (bucketFile) {
                    const name = fileUtils.getFileName(file).replaceAll(' ', '_');
                    const new_name = this.tbl + '/' + id + '/' + name;
                    return new_name;
                }.bind(this)).catch(e => {
//                    doc_ref.delete();//Promise < void >
//                    throw e;
                });
                const updateAttrs = {};
                updateAttrs[name] = gcsUri;
                const updated = await doc_ref.update(updateAttrs);//Promise < void >
                console.log(updateAttrs, file)
            }));

            snapshot = await doc_ref.get();

            let data = snapshot.data();
            const {created_at: created_at_2} = data;
            if (created_at_2 && created_at_2.toDate) {
                data.created_at = created_at_2.toDate();
            }

            const auditData = {id, data: old_data};

            this.editAudit(loggedUser, new Date().getTime(), auditData);

            console.log('update', updated)
            return data;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="updateAndUploadHasFile">
    async updateAndUploadHasFile(evt, id, updateAttrs, fileName, onPreCb) {
        return Events.whenLoggedIn(async loggedUser => {
            const doc_ref = await this.getDB().collection(this.tbl).doc(id);
            let snapshot = await doc_ref.get();
            if (!snapshot.exists) {
                return null;
            }

            const old_data = snapshot.data();
            const {created_at} = old_data;
            if (created_at && created_at.toDate) {
                old_data.created_at = created_at.toDate();
            }

            onPreCb && onPreCb(updateAttrs);

            const file = updateAttrs[fileName];
            if (isFile(file)) {
                delete updateAttrs[fileName];
            }

            if ('site' in updateAttrs) {
                if (updateAttrs.site === 'All' || updateAttrs.site === null) {
                    updateAttrs.site = null;
                    updateAttrs.site_id = null;
                } else if(updateAttrs.site) {
                    updateAttrs.site_id = updateAttrs.site.id;
                }
            }
            if ('project' in updateAttrs) {
                if (updateAttrs.project === 'All' || updateAttrs.project === null) {
                    updateAttrs.project = null;
                    updateAttrs.project_id = null;
                } else if(updateAttrs.project) {
                    updateAttrs.project_id = updateAttrs.project.id;
                }
            }
            if ('client' in updateAttrs) {
                if (updateAttrs.client === 'All' || updateAttrs.client === null) {
                    updateAttrs.client = null;
                    updateAttrs.client_id = null;
                } else if(updateAttrs.client) {
                    updateAttrs.client_id = updateAttrs.client.id;
                }
            }

            let updated = await doc_ref.set(updateAttrs, {merge: true});//Promise < void >

            if (isFile(file)) {
                const gcsUri = await files.upload.call(this, file, async function (bucketFile) {
                    const name = fileUtils.getFileName(file).replaceAll(' ', '_');
                    const new_name = this.tbl + '/' + id + '/' + name;
                    return new_name;
                }.bind(this)).catch(e => {
//                    doc_ref.delete();//Promise < void >
//                    throw e;
                });
                updateAttrs = {};
                updateAttrs[fileName] = gcsUri;
                updated = await doc_ref.update(updateAttrs);//Promise < void >
            }

            snapshot = await doc_ref.get();

            let data = snapshot.data();
            const {created_at: created_at_2} = data;
            if (created_at_2 && created_at_2.toDate) {
                data.created_at = created_at_2.toDate();
            }

            const auditData = {id: snapshot.id, data: old_data};

            this.editAudit(loggedUser, new Date().getTime(), auditData);

//            console.log('update', updated)
            return data;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="updateAndUploadIfManyFiles">
    async updateAndUploadIfManyFiles(evt, id, updateAttrs, fileName, onPreCb) {
        return Events.whenLoggedIn(async loggedUser => {
            const doc_ref = await this.getDB().collection(this.tbl).doc(id);
            let snapshot = await doc_ref.get();
            if (!snapshot.exists) {
                return null;
            }

            const old_data = snapshot.data();
            const {created_at} = old_data;
            if (created_at && created_at.toDate) {
                old_data.created_at = created_at.toDate();
            }

            onPreCb && onPreCb(updateAttrs);
            if (onPreCb) {
                if (onPreCb instanceof Promise) {
                    await onPreCb(updateAttrs);
                } else {
                    onPreCb(updateAttrs);
                }
            }

            fileName = isArray(fileName) ? fileName : [fileName];
            fileName = fileName.filter(fileName => !!updateAttrs[fileName]).map(name => {
                const files = updateAttrs[name];
                delete updateAttrs[name];
                return {files, name};
            });
            console.log("fileName", fileName)

            if ('site' in updateAttrs) {
                if (updateAttrs.site === 'All' || updateAttrs.site === null) {
                    updateAttrs.site = null;
                    updateAttrs.site_id = null;
                } else if(updateAttrs.site) {
                    updateAttrs.site_id = updateAttrs.site.id;
                }
            }
            if ('project' in updateAttrs) {
                if (updateAttrs.project === 'All' || updateAttrs.project === null) {
                    updateAttrs.project = null;
                    updateAttrs.project_id = null;
                } else if(updateAttrs.project) {
                    updateAttrs.project_id = updateAttrs.project.id;
                }
            }
            if ('client' in updateAttrs) {
                if (updateAttrs.client === 'All' || updateAttrs.client === null) {
                    updateAttrs.client = null;
                    updateAttrs.client_id = null;
                } else if(updateAttrs.client) {
                    updateAttrs.client_id = updateAttrs.client.id;
                }
            }

            let updated = await doc_ref.set(updateAttrs, {merge: true});//Promise < void >

            await Promise.all(fileName.map(async ({files: _files, name}) => {
                const resFiles = await Promise.all(_files.filter(file => !file.dlUrls).map(async (file, n) => {
                    const gcsUri = await files.upload.call(this, file, async function (bucketFile) {
                        const name = fileUtils.getFileName(file).replaceAll(' ', '_');
                        const new_name = this.tbl + '/' + id + '/' + n + '_' + name;
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                        throw e;
                    });
                    return gcsUri;
                }));

                const updateAttrs = {};
                updateAttrs[name] = [..._files.filter(file => !!file.dlUrls), ...resFiles];
                const updated = await doc_ref.update(updateAttrs);//Promise < void >
                console.log(updateAttrs, _files)
            }));

            snapshot = await doc_ref.get();

            let data = snapshot.data();
            const {created_at: created_at_2} = data;
            if (created_at_2 && created_at_2.toDate) {
                data.created_at = created_at_2.toDate();
            }

            const auditData = {id, data: old_data};

            this.editAudit(loggedUser, new Date().getTime(), auditData);

//            console.log('update', updated)
            return data;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="list">
    async list(evt) {
        return Events.whenLoggedIn(async loggedUser => {
            let list = await AControllerRead.prototype.list.call(this, evt);
            const {access_type, user, user: {data: {client: my_client, project: my_project, site: my_site}}, company, client_id, project_id, site_id} = loggedUser;

            if (my_client) {
                list = list.filter(val => {
                    return my_client.id === getClientId(val);
                });
            } else if (client_id) {
                if (this.tbl !== 'plugin_sheq_assist_clients') {
                    list = list.filter(val => {
                        const {data, data: {client, client_id: _client_id}} = val;
                        if (!client && !_client_id) {
                            return true;
                        }
                        return client_id === getClientId(val);
                    });
                }
            }

            if (my_project) {
                list = list.filter(val => {
                    const {data, data: {project}} = val;
                    return my_project.id === getProjectId(project, data);
                });
            } else if (project_id) {
                if (this.tbl !== 'plugin_sheq_assist_clients' && this.tbl !== 'plugin_sheq_assist_projects') {
                    list = list.filter(val => {
                        const {data, data: {project, project_id: _project_id}} = val;
                        if (!project && !_project_id) {
                            return true;
                        }
                        return project_id === getProjectId(project, data);
                    });
                }
            }

            if (my_site) {
                list = list.filter(val => {
                    const {data, data: {site}} = val;
                    return my_site.id === getSiteId(site, data);
                });
            } else if (site_id) {
                if (this.tbl !== 'plugin_sheq_assist_clients' && this.tbl !== 'plugin_sheq_assist_projects' && this.tbl !== 'plugin_sheq_assist_sites') {
                    list = list.filter(val => {
                        const {data, data: {site, site_id: _site_id}} = val;
                        if (!site && !_site_id) {
                            return true;
                        }
                        return site_id === getSiteId(site, data);
                    });
                }
            }

//            console.log(this.tbl, 'list filtered', list.length)
            return list;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="listByCalendar">
    async listByCalendar(evt, date, view, props) {
        //view = [day, week, month, year]
        //date = Date
        return Events.whenLoggedIn(async loggedUser => {
            let tbl, filter, listByCalendarKey;
            if (!props) {
                tbl = this.tbl;
                if (!this.getListByCalendarKey) {
                    throw new Error('getListByCalendarKey is not defined in: ' + this.constructor.name);
                }
                listByCalendarKey = this.getListByCalendarKey();
            } else {
                tbl = props.otherTbl || this.tbl;
                filter = props.filter;
                listByCalendarKey = props.listByCalendarKey;
            }

            let {user: {data: {contractor_id, client: my_client, project: my_project, site: my_site}}, company: {id}, client_id, project_id, site_id, contractor_id: logged_contractor_id} = loggedUser;
            contractor_id = logged_contractor_id || contractor_id;
            let q = this.getDB().collection(tbl);
            q = q.where('company_id', '==', id);
            if (contractor_id) {
                q = q.where('contractor_id', '==', contractor_id);
            } else {
//                q = q.where('contractor_id', '>', '');
            }
            if (my_client) {
                q = q.where('client_id', '==', my_client.id);
            } else if (client_id) {
                q = q.where('client_id', '==', client_id);
            }
            if (my_project) {
                q = q.where('project_id', '==', my_project.id);
            } else if (project_id) {
                q = q.where('project_id', '==', project_id);
            }
            if (my_site) {
                q = q.where('site_id', '==', my_site.id);
            } else if (site_id) {
                q = q.where('site_id', '==', site_id);
            }

            if (filter && filter instanceof Array) {
                filter.forEach(({key, value}) => {
                    q = q.where(key, '==', value);
                });
            }

            if (view === 'year') {
                const dateMin = date.toYearStartDate();
                const dateMax = date.toYearEndDate();
                q = q.where(listByCalendarKey, '>=', dateMin.getTime()).where(listByCalendarKey, '<=', dateMax.getTime());
            } else if (view === 'month') {
                const dateMin = date.toMonthStartDate();
                const dateMax = date.toMonthEndDate();
                q = q.where(listByCalendarKey, '>=', dateMin.getTime()).where(listByCalendarKey, '<=', dateMax.getTime());
            } else if (view === 'week') {
                const dateMin = date.toWeekStartDate();
                const dateMax = date.toWeekEndDate();
                q = q.where(listByCalendarKey, '>=', dateMin.getTime()).where(listByCalendarKey, '<=', dateMax.getTime());
            } else if (view === 'day') {
                const dateMin = date.toDayStartDate();
                const dateMax = date.toDayEndDate();
                q = q.where(listByCalendarKey, '>=', dateMin.getTime()).where(listByCalendarKey, '<=', dateMax.getTime());
            }

            const qSnapshot = await q.get();
            const list = [];
            qSnapshot.forEach((doc) => {
                const val = {id: doc.id, data: doc.data()};
                if (val.data.created_at) {
                    if (isFunction(val.data.created_at.toDate)) {
                        val.data.created_at = val.data.created_at.toDate();
                    }
                } else if (val.data.created_at === null) {
                    val.data.created_at = new Date();
                }
                list.push(val);
            });
            return list;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="search_by">
    async search_by(evt, search_val) {
        return Events.whenLoggedIn(async loggedUser => {
            let list = await this.list(evt);
            const filtered = list.filter(val => {
                let {key, value} = search_val;
                console.log(this.tbl, key, value, val.id)
                if (key === 'id') {
                    return val.id === value;
                } else {
                    const keys = key.split('.');
                    if (keys.length === 1) {
                        if (key.startsWith('!')) {
                            key = key.substring(1, key.length);
                            if (!(key in val.data))
                                return true;
                            if (typeof value === 'string') {
                                return val.data[key].toString().toLowerCase() !== value.toLowerCase();
                            } else {
                                return val.data[key] !== value;
                            }
                        } else {
                            if (!(key in val.data))
                                return false;
                            if (typeof value === 'string') {
                                return val.data[key].toString().toLowerCase() === value.toLowerCase();
                            } else {
                                return val.data[key] !== value;
                            }
                        }
                    } else if (keys.length === 2) {
                        const k1 = keys[0];
                        const k2 = keys[1];
                        if (!(k1 in val.data))
                            return false;
                        if (!(k2 in val.data[k1]))
                            return false;
                        if (typeof value === 'string') {
                            return val.data[k1][k2].toString().toLowerCase() === value.toLowerCase();
                        } else {
                            return val.data[k1][k2] !== value;
                        }
                    }
                }
            });

            //console.log(this.tbl, 'filtered', filtered.length)
            return filtered;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="filter_by">
    async filter_by(evt, search_val, onFilter) {
        return Events.whenLoggedIn(async loggedUser => {
            let list = await this.list(evt);
            search_val = typeof search_val === "string" ? search_val.toLowerCase() : search_val;
            const filtered = list.filter(onFilter(search_val));

//            console.log(this.tbl, 'filtered', filtered.length)
            return filtered;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="injectSavable">
    injectSavable(evt, loggedUser, data, onlyIds = false) {
        let {
            user, user: {
                id,
                data: {
                    client: my_client, project: my_project, site: my_site,
                    contractor_id
                }
            },
            company, client_id, project_id, site_id,
            contractor_id: logged_contractor_id
        } = loggedUser;
        if (!onlyIds) {
            data.user_id = user.id;
            data.company_id = company.id;
            data.created_at = FBSettings.FieldValue.serverTimestamp();
        }
        contractor_id = logged_contractor_id || contractor_id;
        if (contractor_id) {
            data.contractor_id = contractor_id;
        }
        console.log('injectSavable', contractor_id, client_id, project_id, site_id)
        if (my_client) {
            data.client = {id: my_client.id, name: my_client.name || my_client.data.name};
            data.client_id = my_client.id;
        } else if (client_id) {
            if (!data.client_id || data.client_id !== client_id) {
                data.client_id = client_id;
            }
        }
        if (my_project) {
            data.project = {id: my_project.id, name: my_project.name || my_project.data.name};
            data.project_id = my_project.id;
        } else if (project_id) {
            if (!data.project_id || data.project_id !== project_id) {
                data.project_id = project_id;
            }
        }
        if (my_site) {
            data.site = {id: my_site.id, name: my_site.name || my_site.data.name};
            data.site_id = my_site.id;
        } else if (site_id) {
            if (!data.site_id || data.site_id !== site_id) {
                data.site_id = site_id;
            }
    }
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="getSiteId">
function getSiteId(site, data) {
    if (site) {
        return site.id;
    } else if (data.site_id) {
        return data.site_id;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="getProjectId">
function getProjectId(project, data) {
    if (project) {
        return project.id;
    } else if (data.project_id) {
        return data.project_id;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="getClientId">
function getClientId(val) {
    const {data: {client, client_id}} = val;
    if (client) {
        return client.id;
    } else if (client_id) {
        return client_id;
    }
}
// </editor-fold>