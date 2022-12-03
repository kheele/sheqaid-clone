
class AEmployeeDocsController extends AControllerAssist {
    constructor(events, db, name, root) {
        super(events, db, name, root);

        this.tbl = 'plugin_sheq_assist_employees';

        this.filter = this.filter.bind(this);
        const {addAction, filter} = this;
        addAction("list/filter", filter);
    }

    async create(evt, data, onProcess) {
        return Events.whenLoggedIn(async loggedUser => {
            this.injectSavable(evt, loggedUser, data);

            const keysCol = this.collectionGroup + '_keys';

            const {doc, employee: {id: employee_id}} = data;
            const employee_ref = await this.getDB().collection(this.tbl).doc(employee_id);
            let employee_snapshot = await employee_ref.get();//Promise < DocumentSnapshot < T > >

            const {id} = this.getDB().collection(this.collectionGroup).doc();

            if (doc) {
//                const len = (employee_snapshot.get('sub_collection_keys')[this.collectionGroup] || []).length;
                const gcsUri = await files.upload.call(this, doc, async bucketFile => {
                    const name = fileUtils.getFileName(doc).replaceAll(' ', '_');
                    const new_name = this.tbl + '/' + employee_id + '/' + this.collectionGroup + '/' + id + '/' + name;
                    return new_name;
                }).catch(e => {
                    throw e;
                });
                data.doc = gcsUri;
            }
            
            if(onProcess) {
                await onProcess(id, data);
            }

            const oldCollectionGroup = employee_snapshot.get(this.collectionGroup);
            let latest = {id, expiry_date: data.expiry_date || null};
            if (oldCollectionGroup) {
                const oldExpiryDates = Object.keys(oldCollectionGroup).map(id => {
                    return {id, expiry_date: oldCollectionGroup[id].expiry_date || null};
                });
                oldExpiryDates.push(latest);
                oldExpiryDates.sortBy('expiry_date', 'desc');
                latest = oldExpiryDates.getFirstElement();
            }
            const updated = await employee_ref.set({
                [this.collectionGroup]: {[id]: data},
                sub_collection_keys: {
                    [this.collectionGroup]: {
                        id: this.getDB().FieldValue.arrayUnion(id),
                        employee_id,
                        latest,
                        ...(this.sub_collection_keys ? this.sub_collection_keys(data) || {} : {})
                    }
                }
            }, {merge: true});//Promise < void >

            employee_snapshot = await employee_ref.get();//Promise < DocumentSnapshot < T > >
            const _collectionGroup = employee_snapshot.get(this.collectionGroup);
            data = _collectionGroup[id];
//            data = doc_snapshot.data();
            const {created_at: created_at_2} = data;
            if (created_at_2 && created_at_2.toDate) {
                data.created_at = created_at_2.toDate();
            }

            const auditData = {id, data};

            this.createAudit(loggedUser, data.created_at.getTime(), auditData);

            const employee_data = employee_snapshot.data();
            return {id: employee_id, data: employee_data};
        });
    }

    async update(evt, employee_id, id, updateAttrs) {
        return Events.whenLoggedIn(async loggedUser => {
            const keysCol = this.collectionGroup + '_keys';

            const employee_ref = await this.getDB().collection(this.tbl).doc(employee_id);
            let employee_snapshot = await employee_ref.get();//Promise < DocumentSnapshot < T > >

            const oldCollectionGroup = employee_snapshot.get(this.collectionGroup);
            let old_item = oldCollectionGroup[id];
            if (!old_item) {
                return "ERROR";
            }
            
            const {doc} = updateAttrs;
            if (doc) {
//                const len = (employee_snapshot.get('sub_collection_keys')[this.collectionGroup] || []).length;
                const gcsUri = await files.upload.call(this, doc, async bucketFile => {
                    const name = fileUtils.getFileName(doc).replaceAll(' ', '_');
                    const new_name = this.tbl + '/' + employee_id + '/' + this.collectionGroup + '/' + id + '/' + name;
                    return new_name;
                }).catch(e => {
                    throw e;
                });
                updateAttrs.doc = gcsUri;
            }                

            let data = {...old_item, ...updateAttrs};
            oldCollectionGroup[id] = data;

            const oldExpiryDates = Object.keys(oldCollectionGroup).map(id => {
                return {id, expiry_date: oldCollectionGroup[id].expiry_date || null};
            });
            oldExpiryDates.sortBy('expiry_date', 'desc');
            const latest = oldExpiryDates.getFirstElement();
            const updated = await employee_ref.set({
                [this.collectionGroup]: {[id]: data},
                sub_collection_keys: {
                    [this.collectionGroup]: {
                        employee_id,
                        latest,
                        ...(this.sub_collection_keys ? this.sub_collection_keys(data) || {} : {})
                    }
                }
            }, {merge: true});//Promise < void >

            employee_snapshot = await employee_ref.get();//Promise < DocumentSnapshot < T > >
            const _collectionGroup = employee_snapshot.get(this.collectionGroup);
            data = _collectionGroup[id];
//            data = doc_snapshot.data();
            const {created_at: created_at_2} = data;
            if (created_at_2 && created_at_2.toDate) {
                data.created_at = created_at_2.toDate();
            }

            const auditData = {id, data};

            this.createAudit(loggedUser, data.created_at.getTime(), auditData);

            return auditData;
        });
    }

    async remove(evt, id) {
        return this.removeWithFile(evt, id, async ({data: {doc}}) => {
            doc && await files.remove(doc);
        });
    }

    async list(evt, opts = {}) {
        let {searchText = ""} = opts;
        searchText = searchText.toLowerCase();
        return Events.whenLoggedIn(async loggedUser => {
            let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, q => {
                q = q.where('removed', '==', false);
                const filter = EmployeeFuns.createDbFilter.call(this, searchText);
                return filter(q);
            });
            list = await Promise.all(list.map(EmployeeFuns.mapResults.bind(this)));
            return list;
        });
    }

    async filterImpl(evt, filterData, extraFilterData, filter2) {
        return Events.whenLoggedIn(async loggedUser => {
            let {employee, expiry_date} = filterData;
            let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                q = q.where('removed', '==', false);
                const col = 'sub_collection_keys.' + this.collectionGroup;
                if (expiry_date) {
                    let d = new Date().toDayEndDate();
                    if (expiry_date === -1) {
                        expiry_date = d.getTime();
                    } else if (expiry_date === 1) {
                        expiry_date = d.addMonths(1).addDays(-1).getTime();
                    } else if (expiry_date === 2) {
                        expiry_date = d.addMonths(1).getTime();
                    } else if (expiry_date === 3) {
                        expiry_date = d.addMonths(2).getTime();
                    } else if (expiry_date === 4) {
                        expiry_date = d.addMonths(3).getTime();
                    }
                    //sub_collection_keys.employee_competency_list.latest.expiry_date
//                    q = q.where(col + '.latest.expiry_date', '>=', expiry_date);
                    q = q.where(col + '.latest.expiry_date', '<=', expiry_date);
                    q = q.orderBy(col + '.latest.expiry_date', "asc");
                }
                if (employee) {
                    q = q.where(col + '.employee_id', '==', employee);
                }
                const filter = EmployeeFuns.createDbFilter.call(this);
                q = filter(q);
                return filter2 ? filter2(q) : q;
            });
            list = await Promise.all(list.map(EmployeeFuns.mapResults.bind(this)));
            return list;
        });
    }

    getListByCalendarKey() {
        return 'expiry_date';
    }

    sortBy() {
        return "lname";
    }
}