
class AControllerWrite {

    constructor(events, db, name, root, tbl, fn) {
        db.add(root, this);

        this.onChange = this.onChange.bind(this);
        this.loadOnSnapshot = this.loadOnSnapshot.bind(this);

        this.addAction = this.addAction.bind(this);

        this.create = this.create.bind(this);
        this.find_by_id = this.find_by_id.bind(this);
        this.find_by_ids = this.find_by_ids.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.count = this.count.bind(this);
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
        addAction("find_by_id", find_by_id);
        addAction("find_by_ids", find_by_ids);
        addAction("update", update);
        addAction("remove", remove);
        addAction("count", count);
        addAction("list", list);
        addAction("list/search_by", search_by);

        addAction("profile-pic", get_profile_pic);
        addAction("upload/profile-pic", upload_profile);

//        !!tbl && onAddChanges(evt, fn).bind(this);
    }

    onCreateAuditRecord(action, auditData) {
        return auditData;
    }

    async auditImpl(loggedUser, created_at, action, data) {
        const {id, data: {fname, lname}} = loggedUser;
        const audit = {
            tbl: this.tbl,
            record_name: this.name,
            user: {id, fname, lname},
            record: this.onCreateAuditRecord(action, data),
            action,
            created_at
        };

        const db_data = await db.collection("default_audit_trail").add(audit);
        const snapshot = await db_data.get();
    }

    async createAudit(loggedUser, created_at, data) {
        return this.auditImpl(loggedUser, created_at, 'created', data);
    }

    async editAudit(loggedUser, created_at, data) {
        return this.auditImpl(loggedUser, created_at, 'edited', data);
    }

    async removeAudit(loggedUser, created_at, data) {
        return this.auditImpl(loggedUser, created_at, 'removed', data);
    }

    async printAudit(loggedUser, created_at, data) {
        return this.auditImpl(loggedUser, created_at, 'printed', data);
    }

    async uploadAudit(loggedUser, created_at, data) {
        return this.auditImpl(loggedUser, created_at, 'uploaded', data);
    }

    async downloadAudit(loggedUser, created_at, data) {
        return this.auditImpl(loggedUser, created_at, 'downloaded', data);
    }

    async shareAudit(loggedUser, created_at, data) {
        return this.auditImpl(loggedUser, created_at, 'shared', data);
    }

//            this.printedAudit(loggedUser, data.created_at.getTime());
    async create(evt, data) {
        return db.whenLoggedIn(async loggedUser => {
            const {id} = loggedUser;
            data.user_id = id;
            data.created_at = db.FieldValue.serverTimestamp();

            const db_data = await db.collection(this.tbl).add(data);

            const snapshot = await db_data.get();
            data = snapshot.data();
            data.created_at = data.created_at.toDate();

            const auditData = {id: snapshot.id, data};

            this.createAudit(loggedUser, data.created_at.getTime(), auditData);

            return auditData;
        });
    }

    async update(evt, id, updateAttrs) {
        return db.whenLoggedIn(async loggedUser => {
            const doc_ref = await db.collection(this.tbl).doc(id);
            const snapshot = await doc_ref.get();
            if (!snapshot.exists) {
                return null;
            }

            const old_data = snapshot.data();
            const {created_at} = old_data;
            if (created_at && created_at.toDate) {
                old_data.created_at = created_at.toDate();
            }

            const updated = await doc_ref.update(updateAttrs);//Promise < void >

            const auditData = {id: snapshot.id, data: old_data};

            this.editAudit(loggedUser, new Date().getTime(), auditData);

            console.log('update', updated)
            return updated === 1;
        });
    }

    async createAndUploadIfFile(evt, data, fileName, onPreCb) {
        return db.whenLoggedIn(async loggedUser => {
            const {id} = loggedUser;
            data.user_id = id;
            data.created_at = db.FieldValue.serverTimestamp();

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
                if (file instanceof File) {
                    delete data[name];
                    return {file, name};
                }
                return null;
            }).filter(v => !!v);
            console.log("fileName", fileName)

            const doc_ref = await db.collection(this.tbl).add(data);//Promise < DocumentReference < T > >
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
                console.log(data, file)
            }));

            doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
            data = doc_snapshot.data();
            const {created_at} = data;
            if (created_at && created_at.toDate) {
                data.created_at = created_at.toDate();
            }

            const auditData = {id: doc_snapshot.id, data};

            this.createAudit(loggedUser, data.created_at.getTime(), auditData);

            return auditData;
        });
    }

    async updateAndUploadIfFile(evt, id, updateAttrs, fileName, onPreCb) {
        return db.whenLoggedIn(async loggedUser => {
            const doc_ref = await db.collection(this.tbl).doc(id);
            const snapshot = await doc_ref.get();
            if (!snapshot.exists) {
                return null;
            }

            const old_data = snapshot.data();
            const {created_at} = old_data;
            if (created_at && created_at.toDate) {
                old_data.created_at = created_at.toDate();
            }

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
                if (file instanceof File) {
                    delete updateAttrs[name];
                    return {file, name};
                }
                return null;
            }).filter(v => !!v);
            console.log("fileName", fileName)

            let updated = await doc_ref.update(updateAttrs);//Promise < void >

            await Promise.all(fileName.map(async ({file, name}) => {
                const gcsUri = await files.upload.call(this, file, async function (bucketFile) {
                    const new_name = this.tbl + '/' + id + '/' + bucketFile.name;
                    return new_name;
                }.bind(this)).catch(e => {
                    throw e;
                });
                const _updateAttrs = {};
                _updateAttrs[name] = gcsUri;
                const updated = await doc_ref.update(_updateAttrs);//Promise < void >
                console.log(updateAttrs, _updateAttrs, file);
                Object.assign(updateAttrs, _updateAttrs);
            }));

            const auditData = {id, data: old_data};

            this.editAudit(loggedUser, new Date().getTime(), auditData);

            console.log('update', updateAttrs)
            return updateAttrs;
        });
    }
    
    async remove(evt, id) {
        return db.whenLoggedIn(async loggedUser => {
            const doc_ref = await db.collection(this.tbl).doc(id);

            const snapshot = await doc_ref.get();
            const data = snapshot.data();
            const {created_at} = data;
            if (created_at && created_at.toDate) {
                data.created_at = created_at.toDate();
            }

            const auditData = {id: snapshot.id, data};

            const res = await doc_ref.delete();

            this.removeAudit(loggedUser, new Date().getTime(), auditData);

            //console.log(this.tbl, 'remove', res)
            return res === 1;
        });
    }

    async removeWithFile(evt, id, onRemoveFile) {
        return db.whenLoggedIn(async loggedUser => {
            const item = await this.find_by_id(evt, id);
            if (!item)
                throw new Error('Record does no longer exist');

            const doc_ref = await db.collection(this.tbl).doc(id);

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

            //console.log(this.tbl, 'remove')
            return true;
        });
    }
    
    async upload_profile(evt, id, path) {
        return db.whenLoggedIn(async loggedUser => {
            const doc_ref = await db.collection(this.tbl).doc(id);
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

}