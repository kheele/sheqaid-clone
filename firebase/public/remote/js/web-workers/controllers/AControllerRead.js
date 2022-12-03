
if (!self.lastVisibleMap) {
    self.lastVisibleMap = {};
}

class AControllerRead extends AControllerWrite {

    constructor(events, db, name, root, tbl, fn) {
        super(events, db, name, root, tbl, fn);
    }

    async listImpl(evt, opts = {}, filter = null) {
        const {sort = this.sortBy(), direction = "asc", isNew = true} = opts || {};
        return await new Promise((resolve, reject) => {
            const user = db.session.getLoggedUser();
            let {tbl} = this;

            let q = db.collection(tbl);
            !!filter && (q = filter(q));
            q = q.orderBy(sort, direction).limit(20);

            console.log(evt, 'isNew', isNew)
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
                        if (change.type === 'added') {
//                            console.log('New ', tbl, ': ', val.id);
                            if (val.data.created_at) {
                                if (isFunction(val.data.created_at.toDate)) {
                                    val.data.created_at = val.data.created_at.toDate();
                                }
                            } else if (val.data.created_at === null) {
                                val.data.created_at = new Date();
                            }
                            list.push(val);
                        } else if (change.type === 'modified') {
                            console.log('Modified ', tbl, ': ', val.id);
                            if (val.data.created_at) {
                                val.data.created_at = val.data.created_at.toDate();
                            }
                            list.replaceIf(val, val => val.id === doc.id);
                        } else if (change.type === 'removed') {
                            const res = list.removeIf(val => val.id === doc.id);
                            console.log('Removed ', tbl, ': ', val.id, res);
                        }
//                    if (lists[tbl + '_loaded'])
//                        fn && fn(val, change.type);
                    }
                }
                console.log('there', evt, list, size)
                resolve(list);
            });
        });
    }

    async loadOnSnapshot(evt, fn, filter = null) {
        return await new Promise((resolve, reject) => {
            const {callbacks, lists, observers} = self;
            let {tbl} = this;
            if (!!observers[tbl]) {
                execWhen(() => !!lists[tbl]).then(() => {
                    resolve(lists[tbl]);
                });
            } else {
                const user = db.session.getLoggedUser();

                let q = db.collection(tbl);
                if (user && !this.unathorized) {
                    const {id, data: {access_type}} = user;
                    if (!this.onlyAdmin && access_type === "Client") {
                        q = q.where('user_id', '==', id);
                    }
                }
                !!filter && (q = filter(q));
                const observer = q.onSnapshot(querySnapshot => {
                    if (!lists[tbl])
                        lists[tbl] = [];
                    const list = lists[tbl];
                    const changes = querySnapshot.docChanges();
                    for (let n = 0; n < changes.length; n++) {
                        const change = changes[n];
                        const {doc} = change;
                        const val = {id: doc.id, data: doc.data()};
                        if (change.type === 'added') {
//                            console.log('New ', tbl, ': ', val.id);
                            if (val.data.created_at) {
                                if (isFunction(val.data.created_at.toDate)) {
                                    val.data.created_at = val.data.created_at.toDate();
                                }
                            } else if (val.data.created_at === null) {
                                val.data.created_at = new Date();
                            }
                            list.push(val);
                        } else if (change.type === 'modified') {
                            console.log('Modified ', tbl, ': ', val.id);
                            if (val.data.created_at) {
                                val.data.created_at = val.data.created_at.toDate();
                            }
                            list.replaceIf(val, val => val.id === doc.id);
                        } else if (change.type === 'removed') {
                            const res = list.removeIf(val => val.id === doc.id);
                            console.log('Removed ', tbl, ': ', val.id, res);
                        }
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

    async find_by_id(evt, id) {
        return db.whenLoggedIn(async loggedUser => {
            let list = await this.list(evt);
            const res = list.find(v => v.id === id);
//            console.log(this.tbl, 'find_by_id', res, id)
            return res;
        });
    }

    async find_by_ids(evt, ids) {
        return db.whenLoggedIn(async loggedUser => {
            let list = await this.list(evt);
            const res = list.filter(v => ids.contains(v.id));
//            console.log(this.tbl, 'find_by_id', res, id)
            return res;
        });
    }

    async count(evt) {
        return db.whenLoggedIn(async loggedUser => {
            const list = await this.loadOnSnapshot(evt, (val, changeType) => {
                if (this.onChange) {
                    this.onChange(val, changeType);
                }
            });

            return list.length;
        });
    }

    async list(evt) {
        return db.whenLoggedIn(async loggedUser => {
            const list = await this.loadOnSnapshot(evt, (val, changeType) => {
                if (this.onChange) {
                    this.onChange(val, changeType);
                }
            });

            if (this.sortBy) {
                this.sortBy(list);
            }
            return list;
        });
    }

    async search_by(evt, search_val) {
        return db.whenLoggedIn(async loggedUser => {
            const list = await this.list(evt);

            const filtered = list.filter(val => {
                const {key, value} = search_val;
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

    async filter_by(evt, search_val, onFilter) {
        return db.whenLoggedIn(async loggedUser => {
            const list = await this.list(evt);

            search_val = typeof search_val === "string" ? search_val.toLowerCase() : search_val;
            const filtered = list.filter(onFilter(search_val));

            //console.log(this.tbl, 'filtered', filtered.length)
            return filtered;
        });
    }

    async filter_impl(evt, where, list) {
        return db.whenLoggedIn(async loggedUser => {
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
                            const sub_key = parts.removeLast();
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
            const whereOr = where.filter(v => Array.isArray(v)).map(v => {
                return v.filter(({val}) => !!val);
            }).filter(v => !v.isEmpty()).map(v => {
                return createQ(v.filter(({val}) => !!val), ' OR ');
            });
            const whereAnd = where.filter(({val}) => typeof val !== 'undefined').filter(v => !Array.isArray(v));
            where = createQ(whereAnd, " AND ");
            if (!whereAnd.isEmpty() && !whereOr.isEmpty()) {
                where += " AND ";
            }
            if (!whereOr.isEmpty()) {
                where += "(" + whereOr.join(" AND ") + ")";
            }
            console.log('where', where);
//            (inArray(o.data.participants,'fname','LIKE','g%') OR inArray(o.data.participants,'lname','LIKE','g%'))
            return alasql("SELECT * FROM ? AS o WHERE " + where, [list]);
        });
    }

    async get_profile_pic(evt, id) {
        return db.whenLoggedIn(async loggedUser => {
            const doc_ref = await db.collection(this.tbl).doc(id);
            let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
            if (!doc_snapshot.exists) {
                return null;
            }
            let {profile_pic} = doc_snapshot.data();
            return profile_pic;
        });
    }
}