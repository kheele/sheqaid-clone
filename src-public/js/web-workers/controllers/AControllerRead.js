if (!self.lastVisibleMap) {
    self.lastVisibleMap = {};
}

class AControllerRead extends AControllerWrite {

    constructor(events, name, root, tbl, fn) {
        super(events, name, root, tbl, fn);
    }

    // <editor-fold defaultstate="collapsed" desc="listImpl">
    async listImpl(evt, opts = {}, filter = null) {
        const {
            tblTmp,
            sort = this.sortBy(),
            direction = "asc",
            limit = 50,
            isNew = true,
            includeOnlyCompanyId = false,
            onEdited
        } = opts || {};
//        console.log('opts', evt, sort, direction, limit, isNew)
        return await new Promise((resolve, reject) => {
            let q = buildQuery.call(this, tblTmp, includeOnlyCompanyId, filter);
            if (sort) {
                q = q.orderBy(sort, direction);
            }
            if (limit >= 0) {
                q = q.limit(limit);
            }

//            console.log(evt, 'isNew', isNew)
            if (isNew) {
                delete lastVisibleMap[evt];
            }
            if (lastVisibleMap[evt]) {
                q = q.startAfter(lastVisibleMap[evt]);
            }
            q.onSnapshot(querySnapshot => {
                const list = [];
                const size = querySnapshot.docs.length;
                if (size > 0) {
                    const docs = querySnapshot.docs;
                    const lastVisible = docs[size - 1];
                    lastVisibleMap[evt] = lastVisible;

                    const changes = querySnapshot.docChanges();
                    for (let n = 0; n < changes.length; n++) {
                        const change = changes[n];
                        const {doc} = change;
                        const val = {id: doc.id, data: doc.data()};
                        onDocSnapshot(val, doc, change, list, onEdited);
//                    if (lists[tbl + '_loaded'])
//                        fn && fn(val, change.type);
                    }
                }
//                console.log('there', evt, list, size)
                resolve(list);
            });
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="loadOnSnapshot">
    async loadOnSnapshot(evt, fn, filter = null) {
        return await new Promise((resolve, reject) => {
            const {callbacks, lists, observers} = self;
            let {tbl, queryWhereList} = this;
            if (!!observers[tbl]) {
                execWhen(() => !!lists[tbl]).then(() => {
                    resolve(lists[tbl]);
                });
            } else {
                let q = buildQuery.call(this, null, false, filter);

                const observer = q.onSnapshot(querySnapshot => {
                    if (!lists[tbl])
                        lists[tbl] = [];
                    const list = lists[tbl];
                    const changes = querySnapshot.docChanges();
                    for (let n = 0; n < changes.length; n++) {
                        const change = changes[n];
                        const {doc} = change;
                        const val = {id: doc.id, data: doc.data()};
                        onDocSnapshot(val, doc, change, list);
                        if (lists[tbl + '_loaded'])
                            fn && fn(val, change.type);
                    }
                    resolve(list);
                    if (!lists[tbl + '_loaded'])
                        lists[tbl + '_loaded'] = true;
                });
                observers[tbl] = observer;
            }
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="find_by_id">
    async find_by_id(evt, id) {
        return Events.whenLoggedIn(async loggedUser => {
            if(!id){
                return null;
            }

            let {tbl, collectionGroup, queryWhereList} = this;

            if (!tbl && collectionGroup) {
                const q = this.getDB().collectionGroup(collectionGroup);
                const snapshot = await q.get();//Promise < DocumentSnapshot < T > >
                if (snapshot.empty) {
                    return null;
                }
                const doc_snapshot = snapshot.docs.find(doc => doc.id === id);
                if(!doc_snapshot) {
                    return null;
                }
                return {id: doc_snapshot.id, data: doc_snapshot.data()};
            } else {
                const doc_ref = await this.getDB().collection(tbl).doc(id);
                const doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }
                return {id: doc_snapshot.id, data: doc_snapshot.data()};
            }
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="find_by_ids">
    async find_by_ids(evt, ids) {
        return Events.whenLoggedIn(async loggedUser => {
            let list = await Promise.all(ids.map(async id => this.find_by_id(null, id)));
//            console.log(this.tbl, 'find_by_id', res, id)
            return list;
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="list">
    async list(evt) {
        return Events.whenLoggedIn(async loggedUser => {
            const {access_type, user: {id: user_id}, company} = loggedUser;
            let list = await this.loadOnSnapshot(evt, (val, changeType) => {
                if (this.onChange) {
                    this.onChange(val, changeType);
                }
            });
//            console.log(this.tbl, 'loaded', list.length)

            if (access_type === "Employee") {
                list = list.filter(val => {
                    const {data, data: {employee}} = val;
                    return employee && employee.id === user_id;
                });
            }

            if (this.sortBy) {
                this.sortBy(list);
            }
            return list;
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="search_by">
    async search_by(evt, search_val) {
        return Events.whenLoggedIn(async loggedUser => {
            const list = await this.list(evt);

            const filtered = list.filter(val => {
                let {key, value} = search_val;
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
            const list = await this.list(evt);

            search_val = typeof search_val === "string" ? search_val.toLowerCase() : search_val;
            const filtered = list.filter(onFilter(search_val));

            //console.log(this.tbl, 'filtered', filtered.length)
            return filtered;
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="filter_impl">
    async filter_impl(evt, where, list, count = false) {
        return Events.whenLoggedIn(async loggedUser => {
            if (!list || !Array.isArray(list)) {
                list = await this.list(evt);
            }
            if (list.isEmpty()) {
                return [];
            }
            const createQ = (l, join) => {
                return l.map(v => {
                    let {key, comp, val} = v;
                    if (typeof val === 'string') {
                        if (comp.toLowerCase() === 'like') {
                            val = "'" + val + "%'";
                        } else {
                            val = "'" + val + "'";
                        }
                    }
                    if (key.startsWith('inArray(')) {
                        key = key.replace("inArray(", "");
                        key = key.substring(0, key.length - 1);
                        const parts = key.split('.');
                        if (parts.length === 1) {
                            return "o.data." + key + ".alasqlContains('" + comp + "'," + val + ")";
                        } else {
                            let sub_key = parts.removeLast();
                            if (parts.contains('data')) {
                                sub_key = [parts.removeLast(), sub_key].join('.');
                            }
                            key = parts.join(".");
                            return "o.data." + key + ".alasqlInArray('" + sub_key + "','" + comp + "'," + val + ")";
                        }
                    } else if (key.startsWith('sumInArray(')) {
                        key = key.replace("sumInArray(", "");
                        key = key.substring(0, key.length - 1);
                        const parts = key.split('.');
                        const sub_key = parts.removeLast();
                        key = parts.join(".");
                        return "o.data." + key + ".alasqlSumInArray('" + sub_key + "','" + comp + "'," + val + ")";
                    } else if (key.startsWith('rangeExpiryCodes(')) {
                        key = key.replace("rangeExpiryCodes(", "");
                        key = key.substring(0, key.length - 1);
                        return "o.data." + key + ".rangeExpiryCodes(" + val + ")";
                    } else {
                        return "o.data." + key + " " + comp + " " + val;
                    }
                }).join(join);
            };
            if (!where.isEmpty()) {
                const whereOr = where.filter(v => Array.isArray(v)).map(v => {
                    return v.filter(({val}) => !!val);
                }).filter(v => !v.isEmpty()).map(v => {
                    return createQ(v.filter(({val}) => !!val), ' OR ');
                });
                const whereAnd = where.filter(({val}) => !!val).filter(v => !Array.isArray(v));
                where = createQ(whereAnd, " AND ");
                if (!whereAnd.isEmpty() && !whereOr.isEmpty()) {
                    where += " AND ";
                }
                if (!whereOr.isEmpty()) {
                    where += "(" + whereOr.join(" AND ") + ")";
                }
            }
//            console.log('where', where);
//            (inArray(o.data.participants,'fname','LIKE','g%') OR inArray(o.data.participants,'lname','LIKE','g%'))
            return alasql("SELECT " + (count ? "COUNT(*)" : "*") + " FROM ? AS o" + (!where.isEmpty() ? (" WHERE " + where) : ""), [list]);
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="get_profile_pic">
    async get_profile_pic(evt, id) {
        return Events.whenLoggedIn(async loggedUser => {
            const doc_ref = await this.getDB().collection(this.tbl).doc(id);
            let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
            if (!doc_snapshot.exists) {
                return null;
            }
            let {profile_pic} = doc_snapshot.data();
            return profile_pic;
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="createDbOrgsFilter">
    createDbOrgsFilter(loggedUser) {
        return q => {
            const {
                user: {
                    data: {client: my_client, project: my_project, site: my_site}
                },
                // company: {
                //     data: {no_projects}
                // },
                client_id, project_id, site_id,
                contractor_site_id
            } = loggedUser;

            if (contractor_site_id) {
                q = q.where('site_id', '==', contractor_site_id);
            // } else if (!no_projects) {
            } else {
//                let inUsed;
//                if (my_site) {
//                    q = q.where('site_id', '==', my_site.id);
//                } else if (site_id) {
//                    q = q.where('site_id', 'in', [null, site_id]);
//                    inUsed = true;
//                }
//                if (my_project) {
//                    q = q.where('project_id', '==', my_project.id);
//                } else if (project_id && !inUsed) {
//                    q = q.where('project_id', 'in', [null, project_id]);
//                    inUsed = true;
//                }
//                if (my_client) {
//                    q = q.where('client_id', '==', my_client.id);
//                } else if (client_id && !inUsed) {
//                    q = q.where('client_id', 'in', [null, client_id]);
//                }
                let inUsed;
                if (my_site) {
                    q = q.where('site_id', '==', my_site.id);
                } else if (site_id) {
                    q = q.where('site_id', '==', site_id);
                    inUsed = true;
                }
                if (my_project) {
                    q = q.where('project_id', '==', my_project.id);
                } else if (project_id && !inUsed) {
                    q = q.where('project_id', '==', project_id);
                    inUsed = true;
                }
                if (my_client) {
                    q = q.where('client_id', '==', my_client.id);
                } else if (client_id && !inUsed) {
                    q = q.where('client_id', '==', client_id);
                }
            }
            return q;
        };
    }

    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="buildQuery">
function buildQuery(tblTmp, includeOnlyCompanyId = false, filter) {
    const loggedUser = self.session.getLoggedUser();
    let {user: {data: {contractor_id}}, company = {}, contractor_id: logged_contractor_id} = loggedUser;
    contractor_id = logged_contractor_id || contractor_id;
    const {id: company_id} = company;
    let {tbl, collectionGroup, queryWhereList} = this;

    let colRef;
    if (tblTmp) {
        colRef = this.getDB().collection(tblTmp);
    } else {
        if (!tbl && collectionGroup) {
            colRef = this.getDB().collectionGroup(this.collectionGroup);
        } else {
            colRef = this.getDB().collection(tbl);
        }
    }

    if (isFunction(queryWhereList)) {
        queryWhereList = queryWhereList(company_id);
    }

    let q;
    if (queryWhereList && Array.isArray(queryWhereList) && !queryWhereList.isEmpty()) {
        if (!queryWhereList.contains('ALL')) {
            for (let n = 0; n < queryWhereList.length; n++) {
                const item = queryWhereList[n];
                const key = item[0];
                const comp = item[1];
                const val = item[2];
                colRef = colRef.where(key, comp, val);
            }
        }
        q = colRef;
        !!filter && (q = filter(q));
    } else {
        q = colRef.where('company_id', '==', company_id);
        if (contractor_id) {
            q = q.where('contractor_id', '==', contractor_id);
        } else {
//                    q = q.where('contractor_id', '>', '');
        }

        if (!includeOnlyCompanyId) {
            const orgsFilter = this.createDbOrgsFilter(loggedUser);
            q = orgsFilter(q);
        }
        !!filter && (q = filter(q));
    }

//    console.log('q', tblTmp || tbl || collectionGroup, q)

    return q;
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onDocSnapshot">
function onDocSnapshot(val, doc, change, list, onEdited) {
    onDocSnapshotModify(val, change.type, list, onEdited);
}

function onDocSnapshotModify(val, changeType, list, onEdited) {
    const {id, data, data: {created_at}} = val;
    if (changeType === 'added') {
        if (created_at) {
            if (!isNumber(created_at) && isFunction(created_at.toDate)) {
//              console.log('New ', tbl, ': ', created_at, created_at.toDate());
                data.created_at = created_at.toDate();
            }
        } else if (data.created_at === null) {
            data.created_at = new Date();
        }
        list.push(val);
    } else if (changeType === 'modified') {
//      console.log('Modified ', tbl, ': ', id);
        const {data, data: {created_at}} = val;
        if (created_at && !isNumber(created_at) && isFunction(created_at.toDate)) {
            data.created_at = created_at.toDate();
        }
        list.replaceIf(val, val => val.id === id);
        onEdited && onEdited(val);
    } else if (changeType === 'removed') {
        const res = list.removeIf(val => val.id === id);
//      console.log('Removed ', tbl, ': ', id, val);
    }
}

// </editor-fold>
//427



