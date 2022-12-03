
class AEmployeeDocsController extends AControllerAid {
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(events, db, name, root) {
        super(events, db, name, root);

        this.tblTemp = TBL_EMPLOYEES;

        const {addAction} = this;
        addAction("dashboard/count", this.dashboard_count.bind(this));
        addAction("list/filter", this.filter.bind(this));
        addAction("select/filter", this.filter_select.bind(this));
        addAction("update/merge-doc", this.updateMergeDoc.bind(this));
    }
    // </editor-fold>

    getDB() {
        return db_hr;
    }

    // <editor-fold defaultstate="collapsed" desc="create2">
    async create2(evt, data, onProcess) {
        return Events.whenLoggedIn(async loggedUser => {
            this.injectSavable(evt, loggedUser, data);

            const {
                doc,
                employee: {id: employee_id},
                expiry_date
            } = data;
            const employee_ref = this.getDB().collection(this.tblTemp).doc(employee_id);
            const employee_snapshot = await employee_ref.get();//Promise < DocumentSnapshot < T > >

            const collectionGroupRef = employee_ref.collection(this.collectionGroup).doc();
            const {id} = collectionGroupRef;

            if (doc) {
                const gcsUri = await files.upload.call(this, doc, async bucketFile => {
                    const name = fileUtils.getFileName(doc).replaceAll(' ', '_');
                    const new_name = this.tblTemp + '/' + employee_id + '/' + this.collectionGroup + '/' + id + '/' + name;
                    return new_name;
                }).catch(e => {
//                    throw e;
                });
                data.doc = gcsUri;
            }

            if (onProcess) {
                await onProcess(id, data);
            }

            const {
                removed = false,
                lname, fname,
                optional_info = {},
                site,
                project,
                client,
                docs = {}
            } = employee_snapshot.data();
            data.keywords = this.generateKeywords([lname, fname]);
            data.removed = removed;
            data.expiry_updated = false;

            const {department, job_position} = optional_info;
            if (department) {
                data.department_id = department.id;
            } else {
                data.department_id = null;
            }
            if (job_position) {
                data.job_position_id = job_position.id;
            } else {
                data.job_position_id = null;
            }

            if (!site || site === 'All') {
                data.site = null;
                data.site_id = null;
            } else if (site) {
                data.site_id = site.id;
            }
            if (!project || project === 'All') {
                data.project = null;
                data.project_id = null;
            } else if (project) {
                data.project_id = project.id;
            }
            if (!client || client === 'All') {
                data.client = null;
                data.client_id = null;
            } else if (client) {
                data.client_id = client.id;
            }

            await collectionGroupRef.set(data, {merge: true});//Promise < void >

            const col_query_ref = await this.getDB().collectionGroup(this.collectionGroup).where('employee.id', '==', employee_id);
            const colQuerySnapshot = await col_query_ref.get();
            const {docs: collectionGroupDocs} = colQuerySnapshot;
            const filterBy = (__expiry_date, docs) => {
                const d = new Date().toDayEndDate();
                return docs.filter(doc => {
                    const {expiry_date} = doc.data();
                    if (__expiry_date === null) {
                        return !expiry_date;
                    }
                    if (!expiry_date) {
                        return false;
                    }
                    if (__expiry_date === -1) {
                        return expiry_date <= d.getTime();
                    } else if (__expiry_date === 1) {
                        return expiry_date > d.getTime() && expiry_date <= d.addMonths(1).addDays(-1).getTime();
                    } else if (__expiry_date === 2) {
                        return expiry_date > d.addMonths(1).addDays(-1).getTime() && expiry_date <= d.addMonths(2).getTime();
                    } else if (__expiry_date === 3) {
                        return expiry_date > d.addMonths(2).getTime() && expiry_date <= d.addMonths(3).getTime();
                    } else if (__expiry_date === 4) {
                        return expiry_date > d.addMonths(3).getTime();
                    }
                    return false;
                }).map(doc => doc.id);
            };

            let {[this.collectionGroup]: oldCollectionGroup = {}} = docs;
            let {ids_by_expiry} = oldCollectionGroup;
            if (ids_by_expiry) {
                ids_by_expiry.mon = ids_by_expiry.mon || {};
                ids_by_expiry.no_expiry = ids_by_expiry.no_expiry || [];
            } else {
                ids_by_expiry = {mon: {}, no_expiry: []};
            }
            let {mon, no_expiry} = ids_by_expiry;
            mon['-1'] = filterBy(-1, collectionGroupDocs);
            mon['1'] = filterBy(1, collectionGroupDocs);
            mon['2'] = filterBy(2, collectionGroupDocs);
            mon['3'] = filterBy(3, collectionGroupDocs);
            mon['4'] = filterBy(4, collectionGroupDocs);
            ids_by_expiry.no_expiry = filterBy(null, collectionGroupDocs);

            //collectionGroupDocs
            let latest = {id, expiry_date: expiry_date || null};
            if (!collectionGroupDocs.isEmpty()) {
                await Promise.all(collectionGroupDocs.map(async doc => {
                    await doc.ref.set({expiry_updated: true}, {merge: true});//do this per module
                }));
                const oldExpiryDates = collectionGroupDocs.map(doc => {
                    return {id: doc.id, expiry_date: doc.get('expiry_date') || null};
                });
                oldExpiryDates.push(latest);
                oldExpiryDates.sortBy('expiry_date', 'desc');
                latest = oldExpiryDates.getFirstElement();
            }

            await employee_ref.set({
                docs: {
                    [this.collectionGroup]: {
                        ids: collectionGroupDocs.map(doc => doc.id),
                        ids_by_expiry,
                        latest,
                        keys: this.sub_collection_keys ? this.sub_collection_keys(data) || {} : {}
                    }
                }
            }, {merge: true});//Promise < void >

            const snapshot = await collectionGroupRef.get();//Promise < DocumentSnapshot < T > >
            data = snapshot.data();
            const {created_at: created_at_2} = data;
            if (created_at_2 && created_at_2.toDate) {
                data.created_at = created_at_2.toDate();
            }

            const auditData = {id, data};

            this.createAudit(loggedUser, data.created_at.getTime(), auditData);

            return auditData;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="create">
    async create(evt, data, onProcess) {
        return this.create2(evt, data, onProcess);
//        return Events.whenLoggedIn(async loggedUser => {
//            this.injectSavable(evt, loggedUser, data);
//
//            const {doc, employee: {id: employee_id}} = data;
//            const employee_ref = await this.getDB().collection(this.tblTemp).doc(employee_id);
//            let employee_snapshot = await employee_ref.get();//Promise < DocumentSnapshot < T > >
//
//            const {id} = this.getDB().collection(this.collectionGroup).doc();
//
//            if (doc) {
////                const len = (employee_snapshot.get('sub_collection_keys')[this.collectionGroup] || []).length;
//                const gcsUri = await files.upload.call(this, doc, async bucketFile => {
//                    const name = fileUtils.getFileName(doc).replaceAll(' ', '_');
//                    const new_name = this.tblTemp + '/' + employee_id + '/' + this.collectionGroup + '/' + id + '/' + name;
//                    return new_name;
//                }).catch(e => {
//                    throw e;
//                });
//                data.doc = gcsUri;
//            }
//
//            if (onProcess) {
//                await onProcess(id, data);
//            }
//
//            const oldCollectionGroup = employee_snapshot.get(this.collectionGroup);
//            let latest = {id, expiry_date: data.expiry_date || null};
//            if (oldCollectionGroup) {
//                const oldExpiryDates = Object.keys(oldCollectionGroup).map(id => {
//                    return {id, expiry_date: oldCollectionGroup[id].expiry_date || null};
//                });
//                oldExpiryDates.push(latest);
//                oldExpiryDates.sortBy('expiry_date', 'desc');
//                latest = oldExpiryDates.getFirstElement();
//            }
//            const updated = await employee_ref.set({
//                [this.collectionGroup]: {[id]: data},
//                sub_collection_keys: {
//                    [this.collectionGroup]: {
//                        id: FBSettings.FieldValue.arrayUnion(id),
//                        employee_id,
//                        latest,
//                        ...(this.sub_collection_keys ? this.sub_collection_keys(data) || {} : {})
//                    }
//                }
//            }, {merge: true});//Promise < void >
//
//            employee_snapshot = await employee_ref.get();//Promise < DocumentSnapshot < T > >
//            const _collectionGroup = employee_snapshot.get(this.collectionGroup);
//            data = _collectionGroup[id];
////            data = doc_snapshot.data();
//            const {created_at: created_at_2} = data;
//            if (created_at_2 && created_at_2.toDate) {
//                data.created_at = created_at_2.toDate();
//            }
//
//            const auditData = {id, data};
//
//            this.createAudit(loggedUser, data.created_at.getTime(), auditData);
//
//            const employee_data = employee_snapshot.data();
//            return {id: employee_id, data: employee_data};
//        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="update">
    async update(evt, employee_id, id, updateAttrs) {
        return Events.whenLoggedIn(async loggedUser => {
            const employee_ref = await this.getDB().collection(this.tblTemp).doc(employee_id);
            let employee_snapshot = await employee_ref.get();//Promise < DocumentSnapshot < T > >

            const oldCollectionGroup = employee_snapshot.get(this.collectionGroup);
            let old_data = oldCollectionGroup[id];
            if (!old_data) {
                return "ERROR";
            }

            const {doc} = updateAttrs;
            if (doc) {
//                const len = (employee_snapshot.get('sub_collection_keys')[this.collectionGroup] || []).length;
                const gcsUri = await files.upload.call(this, doc, async bucketFile => {
                    const name = fileUtils.getFileName(doc).replaceAll(' ', '_');
                    const new_name = this.tblTemp + '/' + employee_id + '/' + this.collectionGroup + '/' + id + '/' + name;
                    return new_name;
                }).catch(e => {
                    throw e;
                });
                updateAttrs.doc = gcsUri;
            }

            let data = {...old_data, ...updateAttrs};
            oldCollectionGroup[id] = data;

            const oldExpiryDates = Object.keys(oldCollectionGroup).map(id => {
                return {id, expiry_date: oldCollectionGroup[id].expiry_date || null};
            });
            oldExpiryDates.sortBy('expiry_date', 'desc');
            const latest = oldExpiryDates.getFirstElement();

            const old_sub_collection_keys = employee_snapshot.get('sub_collection_keys');

            const updated = await employee_ref.set({
                [this.collectionGroup]: {[id]: data},
                sub_collection_keys: {
                    [this.collectionGroup]: {
                        employee_id,
                        latest,
                        ...(this.sub_collection_keys ? this.sub_collection_keys(old_data, updateAttrs, old_sub_collection_keys[this.collectionGroup]) || {} : {})
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
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="updateMergeDoc">
    async updateMergeDoc(evt, employee_id, id, {doc, base64}) {
        return Events.whenLoggedIn(async loggedUser => {
            const employee_ref = await this.getDB().collection(this.tblTemp).doc(employee_id);
            let employee_snapshot = await employee_ref.get();//Promise < DocumentSnapshot < T > >

            const oldCollectionGroup = employee_snapshot.get(this.collectionGroup);
            let old_data = oldCollectionGroup[id];
            if (!old_data) {
                return "ERROR";
            }

            const gcsUri = await files.update.call(this, doc, base64);
            return true;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="remove">
    async remove(evt, id) {
        return this.removeWithFile(evt, id, async ({data: {doc}}) => {
            doc && await files.remove(doc);
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="find_by_ids">
    async find_by_ids(evt, ids) {
        return Events.whenLoggedIn(async loggedUser => {
            let list = await AControllerRead.prototype.find_by_ids.call(this, evt, ids);

            list = list.filter(({id, data: {removed}}) => !removed);

            // console.log('find_by_ids', list.map(v => v.id))
            // list = await Promise.all(list.map(v => v.id).distinct().map(id => list.find(v => v.id === id)).map(EmployeeFuns.mapResults.bind(this)));
            // list.sortBy('data.lname');
            return list;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="dashboard_count">
    async dashboard_count(evt, expiry_date) {
        return Events.whenLoggedIn(async loggedUser => {
            let {
                user: {data: {client: my_client, project: my_project, site: my_site}},
                company: {id: company_id},
                client_id, project_id, site_id
            } = loggedUser;

            let q = this.getDB().collection(`${TBL_EMPLOYEES}_${this.collectionGroup}_counters`);

            let key;
            site_id = my_site ? my_site.id : site_id;
            if (site_id) {
                q = q.doc(`site`);
                key = site_id;
            } else {
                project_id = my_project ? my_project.id : project_id;
                if (project_id) {
                    q = q.doc(`project`);
                    key = project_id;
                } else {
                    client_id = my_client ? my_client.id : client_id;
                    if (client_id) {
                        q = q.doc(`client`);
                        key = client_id;
                    } else {
                        q = q.doc(`company`);
                        key = company_id;
                    }
                }
            }

            const snapshot = await q.get();
            if (snapshot.exists) {
                return snapshot.get(key);
            }
            return 'N/A';
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="list">
    async list(evt) {
        return Events.whenLoggedIn(async loggedUser => {
            let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                q = q.where('removed', '==', false);
                return q;
            });
            
            const groups = list.groupBy((({data: {employee}}) => employee.id));
            list = (await Promise.all(Object.keys(groups).distinct().map(async k => {
                const list = groups[k];
                
                const employees_cntr = await Events.get('plugin_sheq_assist/employees/');
                const employee = await employees_cntr.find_by_id.call(employees_cntr, null, k);
                employee.data.docs[this.collectionGroup].list = list;
                return [employee, ...list];
            }))).reduce((a1, a2) => [...a1, ...a2], []);
            
            return list;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="filter_selectImpl">
    async filter_selectImpl(evt, filterData, onFilter) {
        return Events.whenLoggedIn(async loggedUser => {
            const {
                user: {
                    data: {
                        client: my_client, project: my_project, site: my_site,
                        client_id: logged_client_id, project_id: logged_project_id, site_id: logged_site_id
                    }
                }
            } = loggedUser;
            let {
                client_id, project_id, site_id,
                department_id, job_position_id,
                employee,
                expiry_date, date_range,
                isNew
            } = filterData;

            let list = await AControllerRead.prototype.listImpl.call(this, evt, {isNew, limit: -1}, q => {
                q = q.where('removed', '==', false);

                //
                if (my_client) {
//                    q = q.where('client_id', '==', my_client.id);
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

                //
                if (job_position_id) {
                    q = q.where('job_position_id', '==', job_position_id);
                }
                if (department_id) {
                    q = q.where('department_id', '==', department_id);
                }

                //
                if (employee) {
                    q = q.where('employee.id', '==', employee);
                }

                //
                if (date_range) {
                    const {start, end} = date_range;
                    if (start) {
                        q = q.where(`expiry_date`, '>=', start);
                    }
                    if (end) {
                        q = q.where(`expiry_date`, '<=', end);
                    }
                    q = q.orderBy(`expiry_date`, "asc");
                } else if (expiry_date === null || expiry_date === 'null') {
                    q = q.where(`expiry_date`, '==', null);
                } else if (expiry_date) {
                    let d = new Date().toDayEndDate();
                    if (expiry_date === -1) {
                        q = q.where(`expiry_date`, '<=', d.getTime());
                    } else if (expiry_date === 1) {
                        expiry_date = d.addMonths(1).addDays(-1).getTime();
                        q = q.where(`expiry_date`, '>', d.getTime());
                        q = q.where(`expiry_date`, '<=', expiry_date);
                    } else if (expiry_date === 2) {
                        expiry_date = d.addMonths(2).getTime();
                        q = q.where(`expiry_date`, '>', d.addMonths(1).addDays(-1).getTime());
                        q = q.where(`expiry_date`, '<=', expiry_date);
                    } else if (expiry_date === 3) {
                        expiry_date = d.addMonths(3).getTime();
                        q = q.where(`expiry_date`, '>', d.addMonths(2).getTime());
                        q = q.where(`expiry_date`, '<=', expiry_date);
                    } else if (expiry_date === 4) {
                        q = q.where(`expiry_date`, '>', d.addMonths(3).getTime());
                    }

                    q = q.orderBy(`expiry_date`, "asc");
                } else {
                    const filter = EmployeeFuns.createDbFilter.call(this);
                    q = filter(q);
                }

                return onFilter(q);
            });
            
            const groups = list.groupBy((({data: {employee}}) => employee.id));
            list = (await Promise.all(Object.keys(groups).distinct().map(async k => {
                const list = groups[k];
                
                const employees_cntr = await Events.get('plugin_sheq_assist/employees/');
                const employee = await employees_cntr.find_by_id.call(employees_cntr, null, k);
                employee.data.docs[this.collectionGroup].list = list;
                return [employee, ...list];
            }))).reduce((a1, a2) => [...a1, ...a2], []);
            
            return list;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="filterImpl">
    async filterImpl(evt, filterData, extraFilterData, filter2) {
        return Events.whenLoggedIn(async loggedUser => {
            let {
                employee,
                expiry_date
            } = filterData;
            
            let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                q = q.where('removed', '==', false);

                if (expiry_date === null || expiry_date === 'null') {
                    q = q.where(`expiry_date`, '==', null);
                } else if (expiry_date) {
                    let d = new Date().toDayEndDate();
                    if (expiry_date === -1) {
                        q = q.where(`expiry_date`, '<=', d.getTime());
                    } else if (expiry_date === 1) {
                        expiry_date = d.addMonths(1).addDays(-1).getTime();
                        q = q.where(`expiry_date`, '>', d.getTime());
                        q = q.where(`expiry_date`, '<=', expiry_date);
                    } else if (expiry_date === 2) {
                        expiry_date = d.addMonths(2).getTime();
                        q = q.where(`expiry_date`, '>', d.addMonths(1).addDays(-1).getTime());
                        q = q.where(`expiry_date`, '<=', expiry_date);
                    } else if (expiry_date === 3) {
                        expiry_date = d.addMonths(3).getTime();
                        q = q.where(`expiry_date`, '>', d.addMonths(2).getTime());
                        q = q.where(`expiry_date`, '<=', expiry_date);
                    } else if (expiry_date === 4) {
                        q = q.where(`expiry_date`, '>', d.addMonths(3).getTime());
                    }

                    q = q.orderBy(`expiry_date`, "asc");
                } else {
                    const filter = EmployeeFuns.createDbFilter.call(this);
                    q = filter(q);
                }
                if (employee) {
                    q = q.where('employee.id', '==', employee);
                }

                return filter2 ? filter2(q) : q;
            });
            
            const groups = list.groupBy((({data: {employee}}) => employee.id));
            list = (await Promise.all(Object.keys(groups).distinct().map(async k => {
                const list = groups[k];
                
                const employees_cntr = await Events.get('plugin_sheq_assist/employees/');
                const employee = await employees_cntr.find_by_id.call(employees_cntr, null, k);
                employee.data.docs[this.collectionGroup].list = list;
                return [employee, ...list];
            }))).reduce((a1, a2) => [...a1, ...a2], []);
            
            return list;
        });
    }
    // </editor-fold>

    getListByCalendarKey() {
        return 'expiry_date';
    }

    sortBy() {
        return 'employee.lname';
    }
}