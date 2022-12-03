
class AControllerWrite {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(events, db, name, root, tbl, fn) {
        Events.add(root, this);

        this.onChange = this.onChange.bind(this);
        this.loadOnSnapshot = this.loadOnSnapshot.bind(this);

        this.setQueryWhere = this.setQueryWhere.bind(this);
        this.addQueryWhere = this.addQueryWhere.bind(this);
        this.addAction = this.addAction.bind(this);

        this.create = this.create.bind(this);
        this.find_by_id = this.find_by_id.bind(this);
        this.find_by_ids = this.find_by_ids.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.list = this.list.bind(this);
        this.search_by = this.search_by.bind(this);
        this.filter_by = this.filter_by.bind(this);

        this.get_profile_pic = this.get_profile_pic.bind(this);
        this.upload_profile = this.upload_profile.bind(this);

        this.events = events;
        this.name = name;
        this.root = root;
        this.tbl = tbl;
        this.queryWhereList = [];

        const {addAction, create, find_by_id, find_by_ids, update, remove, count, list, search_by, get_profile_pic, upload_profile} = this;
        addAction("create", create);
        addAction("create/pdf", this.createPDF.bind(this));
        addAction("edit/file", this.editFile.bind(this));
        addAction("find_by_id", find_by_id);
        addAction("find_by_ids", find_by_ids);
        addAction("update", update);
        addAction("remove", remove);
        addAction("count", count);
        addAction("list", list);
        addAction("list/search_by", search_by);

        addAction("profile-pic", get_profile_pic);
        addAction("upload/profile-pic", upload_profile);

        if (this.export_excel) {
            addAction("export-excel", this.export_excel.bind(this));
        }
//        !!tbl && onAddChanges(evt, fn).bind(this);
    }
    // </editor-fold>
    
    getDB() {
        return db;
    }

    // <editor-fold defaultstate="collapsed" desc="onChange, addAction">
    onChange(val, changeType) {
    }

    addAction(name, fn) {
        const {events, root} = this;
        Events.on(root + name, fn);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="setQueryWhere, addQueryWhere">
    setQueryWhere(queryWhereListCb) {
        this.queryWhereList = queryWhereListCb;
        return this;
    }

    addQueryWhere(key, comp, val) {
        this.queryWhereList.push([key, comp, val]);
        return this;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="generateKeywords">
    generateKeywords(keywords) {
        const createKeywords = (name) => {
            const arrName = [];
            let curName = '';
            name.toLowerCase().split('').forEach(letter => {
                curName += letter;
                arrName.push(curName);
            });
            return arrName;
        };
        
        keywords = keywords.filter(k => !!k);

        return [
            ...new Set([
                '',
                ...createKeywords(keywords.join(' ')),
                ...createKeywords(keywords.reverse().join(' '))
            ])
        ];
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onCreateAuditRecord, auditImpl">
    onCreateAuditRecord(action, auditData) {
        return auditData;
    }

    async auditImpl(loggedUser, created_at, action, data, props = {}) {
        const {user, user: {data: {fname, lname}}, company} = loggedUser;
        const audit = {
            tbl: props.tbl || this.tbl,
            record_name: props.name || this.name,
            company_id: company.id,
            user: {id: user.id, fname, lname},
            record: this.onCreateAuditRecord(action, data),
            action,
            created_at
        };

        const db_data = await db2.collection("default_audit_trail").add(audit);
        const snapshot = await db_data.get();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="createAudit, editAudit, removeAudit, printAudit, uploadAudit, downloadAudit, shareAudit">
    async createAudit(loggedUser, created_at, data, props) {
        return this.auditImpl(loggedUser, created_at, 'created', data, props);
    }

    async editAudit(loggedUser, created_at, data, props) {
        return this.auditImpl(loggedUser, created_at, 'edited', data, props);
    }

    async removeAudit(loggedUser, created_at, data, props) {
        return this.auditImpl(loggedUser, created_at, 'removed', data, props);
    }

    async printAudit(loggedUser, created_at, data, props) {
        return this.auditImpl(loggedUser, created_at, 'printed', data, props);
    }

    async uploadAudit(loggedUser, created_at, data, props) {
        return this.auditImpl(loggedUser, created_at, 'uploaded', data, props);
    }

    async downloadAudit(loggedUser, created_at, data, props) {
        return this.auditImpl(loggedUser, created_at, 'downloaded', data, props);
    }

    async shareAudit(loggedUser, created_at, data, props) {
        return this.auditImpl(loggedUser, created_at, 'shared', data, props);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="create">
    async create(evt, data) {
        return Events.whenLoggedIn(async loggedUser => {
            const {user, company} = loggedUser;
            data.user_id = user.id;
            data.company_id = company.id;
            data.created_at = this.getDB().FieldValue.serverTimestamp();

            const db_data = await this.getDB().collection(this.tbl).add(data);

            const snapshot = await db_data.get();
            data = snapshot.data();
            data.created_at = data.created_at.toDate();

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
            const snapshot = await doc_ref.get();
            if (!snapshot.exists) {
                return null;
            }

            const old_data = snapshot.data();
            const {created_at} = old_data;
            if (created_at && created_at.toDate) {
                old_data.created_at = created_at.toDate();
            }

            if ('site' in updateAttrs && updateAttrs.site === 'All') {
                updateAttrs.site = null;
                updateAttrs.site_id = null;
            }
            if ('project' in updateAttrs && updateAttrs.project === 'All') {
                updateAttrs.project = null;
                updateAttrs.project_id = null;
            }
            if ('client' in updateAttrs && updateAttrs.client === 'All') {
                updateAttrs.client = null;
                updateAttrs.client_id = null;
            }
            const updated = await doc_ref.set(updateAttrs, {merge: true});//Promise < void >

            const auditData = {id: snapshot.id, data: old_data};

            this.editAudit(loggedUser, new Date().getTime(), auditData);

            console.log('update', updated)
            return !!updated;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="createAndUploadIfFile">
    async createAndUploadIfFile(evt, data, fileName, onPreCb) {
        return Events.whenLoggedIn(async loggedUser => {
            const {user, company} = loggedUser;
            data.user_id = user.id;
            data.company_id = company.id;
            data.created_at = this.getDB().FieldValue.serverTimestamp();
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

            const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
            let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

            await Promise.all(fileName.map(async ({file, name}) => {
                const gcsUri = await files.upload.call(this, file, async function (bucketFile) {
                    const new_name = this.tbl + '/' + doc_snapshot.id + '/' + bucketFile.name;
                    return new_name;
                }.bind(this)).catch(e => {
                    doc_ref.delete();//Promise < void >
                    throw e;
                });
                const updateAttrs = {};
                updateAttrs[name] = gcsUri;
                const updated = await doc_ref.update(updateAttrs);//Promise < void >
            }));

            doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
            data = doc_snapshot.data();
            data.created_at = data.created_at.toDate();

            const auditData = {id: doc_snapshot.id, data};

            this.createAudit(loggedUser, data.created_at.getTime(), auditData);

            return auditData;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="remove">
    async remove(evt, id) {
        return Events.whenLoggedIn(async loggedUser => {
            const doc_ref = await this.getDB().collection(this.tbl).doc(id);

            const snapshot = await doc_ref.get();
            const data = snapshot.data();
            const {created_at} = data;
            if (created_at && created_at.toDate) {
                data.created_at = created_at.toDate();
            }

            const auditData = {id: snapshot.id, data};

            const res = await doc_ref.delete();

            this.removeAudit(loggedUser, new Date().getTime(), auditData);

            console.log(evt, 'remove')
            return true;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="removeWithFile">
    async removeWithFile(evt, id, onRemoveFile) {
        return Events.whenLoggedIn(async loggedUser => {
            const item = await this.find_by_id(evt, id);
            if (!item)
                throw new Error('Record does no longer exist');

            const doc_ref = await this.getDB().collection(this.tbl).doc(id);

            const snapshot = await doc_ref.get();
            const data = snapshot.data();
            const {created_at} = data;
            if (created_at && created_at.toDate) {
                data.created_at = created_at.toDate();
            }

            const auditData = {id: snapshot.id, data};

            await onRemoveFile(item);
            const res = await doc_ref.delete();

            this.removeAudit(loggedUser, new Date().getTime(), auditData);

            console.log(evt, 'remove')
            return true;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="upload_profile">
    async upload_profile(evt, id, path) {
        return Events.whenLoggedIn(async loggedUser => {
            const doc_ref = await this.getDB().collection(this.tbl).doc(id);
            let snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
            if (!snapshot.exists) {
                return null;
            }

            let {profile_pic: profile_pic_old} = snapshot.data();

            const profile_pic = await files.upload.call(this, path, async bucketFile => {
                const new_name = this.tbl + '/' + id + '/profile-pic.' + fileUtils.getExtension(bucketFile.name);
                return new_name;
            });

            if (profile_pic_old) {
                files.remove(profile_pic_old);
            }

            const updated = await doc_ref.update({profile_pic});//Promise < void >

            const data = snapshot.data();
            const {created_at} = data;
            if (created_at && created_at.toDate) {
                data.created_at = created_at.toDate();
            }

            const auditData = {id: snapshot.id, data};

            this.uploadAudit(loggedUser, new Date().getTime(), auditData);

            return profile_pic;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="createPDF">
    async createPDF(evt, ...args) {
        return Events.whenLoggedIn(async loggedUser => {
            const execFun = functions.httpsCallable('execFun');
            const param = {path: evt, data: args};
            console.log('createPDF', param)
            const res = await execFun(param);
            return res;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="editFile">
    async editFile(evt, ...args) {
        return Events.whenLoggedIn(async loggedUser => {
            const execFun = functions.httpsCallable('execFun');
            const param = {path: evt, data: args};
            console.log('editFile', param)
            const res = await execFun(param);
            return res;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="export_excel_impl">
    async export_excel_impl(loggedUser, folder, fileName, title, cols, rows) {
        const os = self.require('os');
        const path = self.require('path');

        const date = new Date();
        const dir = path.join(os.homedir(), "Documents", "SHEQAssist", folder, fileName, Dates.formatDate(date));
        const file = await excelUtils.create(dir, (fileName + "-" + Dates.formatTime(date).replaceAll(":","")) + ".xlsx", title, cols, rows);

        const exec = self.require('child_process').exec;
        setTimeout(() => {
            exec(file, (error, stdout, stderr) => {
                //        sys.puts(stdout)
            });
        }, 3000);

        const auditData = {info: {cols, rows}, local: {file, path: dir}};

        this.printAudit(loggedUser, date.getTime(), auditData);

        return auditData.local;
    }
    // </editor-fold>
}