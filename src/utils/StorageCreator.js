import {computed, observable} from 'mobx';

import {execWhen} from './Utils';

import storage from '../storage/Storage';

class DBTable {
    name;
    size = 0;
    indexes;
    conn;

    constructor(db, name, indexes = []) {
        this.conn = db.connection;
        this.name = name;
        this.indexes = indexes;
    }

    find(id) {
        return execWhen(() => this.isConnected).then(() => {
            id = parseInt(id);
            const req = this.conn.link.transaction(this.name, "readwrite").objectStore(this.name).get(id);

            return new Promise((resolve, reject) => {
                req.onsuccess = function (evt) {
                    const res = evt.target.result;
                    resolve(res);
                };
                req.onerror = function (evt) {
                    console.log("Unable to fetch record.");
                    reject(evt);
                };
            });
        });
    }

    findAllByIds(idList) {
        return execWhen(() => this.isConnected).then(() => {
            const $this = this;
            return Promise.all(idList.map(async id => {
                id = parseInt(id);
                return await new Promise((resolve, reject) => {
                    const req = $this.conn.link.transaction($this.name, "readwrite").objectStore($this.name).get(id);
                    req.onsuccess = evt => {
                        const res = evt.target.result;
                        resolve(res);
                    };
                    req.onerror = evt => {
                        reject(evt);
                    };
                });
            }));
        }).catch(err => {
            console.error(err);
            throw err;
        });
    }

    findAll(cb) {
        return execWhen(() => this.isConnected).then(() => {
            const objectStore = this.conn.link.transaction(this.name, "readonly").objectStore(this.name);
            return new Promise((resolve, reject) => {
                let req;
                if ('getAll' in objectStore || 'mozGetAll' in objectStore) {
                    objectStore.getAll = objectStore.getAll || objectStore.mozGetAll;
                    req = objectStore.getAll();
                    req.onsuccess = function (evt) {
                        resolve(evt.target.result);
                    };
                } else {
                    req = objectStore.openCursor();
                    const entries = [];
                    req.onsuccess = function (evt) {
                        var res = evt.target.result;
                        if (res) {
                            entries.push(res);
                            res.continue();
                        } else {
                            resolve(entries);
                        }
                    };
                }
                req.onerror = function (evt) {
                    reject("Unable to fetch records.");
                };
            });
        });
    }

    findRange(range, cb) {
        return execWhen(() => this.isConnected).then(() => {
            var keyRange;
            if (range.from && range.to) {
                keyRange = IDBKeyRange.bound(range.from, range.to, false, false);
            } else if (range.from && !range.to) {
                keyRange = IDBKeyRange.lowerBound(range.from);
            } else if (!range.from && range.to) {
                keyRange = IDBKeyRange.upperBound(range.to);
            }
            var objectStore = this.conn.link.transaction(this.name, "readonly").objectStore(this.name);
            return new Promise((resolve, reject) => {
                var req;
                if ('getAll' in objectStore) {
                    req = objectStore.getAll(keyRange);
                    req.onsuccess = function (evt) {
                        resolve(evt.target.result);
                    };
                } else {
                    req = objectStore.openCursor(keyRange);
                    const entries = [];
                    req.onsuccess = function (evt) {
                        const res = evt.target.result;
                        if (res) {
                            entries.push(res);
                            res.continue();
                        } else {
                            resolve(entries);
                        }
                    };
                }
                req.onerror = function (evt) {
                    reject("Unable to fetch records.");
                };
            });
        });
    }

    findAllByIndex(param, cb) {
        return execWhen(() => this.isConnected).then(() => {
            var objectStore = this.conn.link.transaction(this.name, "readonly").objectStore(this.name);
            var range = IDBKeyRange.only(param.indexVaue);
            var index = objectStore.index(param.indexName + "Index");

            let req;
            return new Promise((resolve, reject) => {
                if ('getAll' in objectStore) {
//                req = objectStore.getAll();
                    req = index.getAll(range);
                    req.onsuccess = function (evt) {
                        resolve(evt.target.result);
                    };
                } else {
//                req = objectStore.openCursor();
                    req = index.get(range);

                    var entries = [];
                    req.onsuccess = function (evt) {
                        var res = evt.target.result;
                        if (res) {
                            entries.push(res);
                            res.continue();
                        } else {
                            resolve(entries);
                        }
                    };
                }
                req.onerror = function (evt) {
                    reject("Unable to fetch records.");
                };
            });
        });
    }

    count(cb) {
        return execWhen(() => this.isConnected).then(() => {
            const objectStore = this.conn.link.transaction(this.name, "readonly").objectStore(this.name);
            const $this = this;
            let req;
            return new Promise((resolve, reject) => {
                if ('count' in objectStore) {
                    req = objectStore.count();
                    req.onsuccess = function () {
                        resolve($this.size = req.result);
                    };
                } else {
                    this.findAll().then(list => {
                        resolve($this.size = list.length);
                    });
                }
                req.onerror = function (evt) {
                    reject("Unable to fetch records.");
                };
            });
        });
    }

    createOrUpdate(data, cb) {
        return execWhen(() => this.isConnected).then(() => {
            if (data instanceof Array) {
                const $this = this;
                return Promise.all(data.map(async val => {
                    return await new Promise((resolve, reject) => {
                        const req = $this.conn.link.transaction($this.name, "readwrite").objectStore($this.name).put(val);
                        req.onsuccess = function (evt) {
                            resolve(val);
                        };
                        req.onerror = function (evt) {
                            reject("Unable to created/updated record.");
                        };
                    });
                }));
            } else {
                const req = this.conn.link.transaction(this.name, "readwrite").objectStore(this.name).put(data);
                return new Promise((resolve, reject) => {
                    req.onsuccess = function (evt) {
                        resolve(data);
                    };
                    req.onerror = function (evt) {
                        reject("Unable to created/updated record.");
                    };
                });
            }
        }).catch(err => {
            console.error(err);
            throw err;
        });
    }

    removeAndCreate(data, cb) {
        var $this = this;
        return execWhen(() => this.isConnected).then(() => {
            if (data instanceof Array) {
                return Promise.all(data.map(async val => {
                    return $this.remove(val.id).then(() => {
                        return $this.createOrUpdate(val);
                    });
                }));
            } else {
                return this.remove(data.id).then(() => {
                    return $this.createOrUpdate(data);
                });
            }
        }).catch(err => {
            console.error(err);
            throw err;
        });
    }

    remove(id, cb) {
        return execWhen(() => this.isConnected).then(() => {
            id = parseInt(id);

            var req = this.conn.link.transaction(this.name, "readwrite").objectStore(this.name).delete(id);
            return new Promise((resolve, reject) => {
                req.onsuccess = function (evt) {
                    resolve(evt.target.result);
                };
                req.onerror = function (evt) {
                    reject("Unable to delete record.");
                };
            });
        });
    }

    clear() {
        return execWhen(() => this.isConnected).then(() => {
            const req = this.conn.link.transaction(this.name, "readwrite").objectStore(this.name).clear();
            return new Promise((resolve, reject) => {
                req.onsuccess = function (evt) {
                    resolve();
                };
                req.onerror = function (evt) {
                    reject(evt);
                };
            });
        });
    }

    @computed
    get isConnected() {
        return !!this.conn.link && this.conn.connected;
    }
}

class DB {
    name;
    version = 1;
    connection = observable({link: null, connected: false});

    newTables = null;

    constructor(settings, fn) {
        const {name, tableList = {}} = settings;
        this.name = name;

        const keys = Object.keys(tableList);
        keys.forEach(key => {
            const o = tableList[key];
            tableList[key] = new DBTable(this, o.name, o.indexes || []);
        });

        settings.tableList = {
            ...tableList,
            loggedUser: new DBTable(this, 'logged_user'),
            stayLogged: new DBTable(this, 'stay_logged'),
            countries: new DBTable(this, 'countries', [{name: "continent", unique: false}]),
            orphanedUploadedDocs: new DBTable(this, 'orphaned_uploaded_docs'),
            configuration: new DBTable(this, 'configuration')
        };
        this._databaseTables = settings.tableList;

        let $this = this;
        this.connent().then(() => {
            $this.connection.connected = true;
            fn && fn($this._databaseTables);
        });
    }

    connent() {
        let $this = this;
        return new Promise((resolve, reject) => {
            let req = indexedDB.open(this.name, this.version);

            req.onupgradeneeded = function (evt) {
                $this.connection.link = evt.target.result;
//                console.log($this.name + ' upgraded...');

                $this.createNewTables();
            };
            req.onsuccess = function (evt) {
                $this.connection.link = evt.target.result;

                if (!$this.getNewTables().isEmpty()) {
                    indexedDB.deleteDatabase($this.name);

//                    console.log($this.name, ' deleted...', $this.version);
                    $this.connent().then(resolve);
                } else {

//                    console.log($this.name + ' connected...');

                    resolve();
                }
            };
            req.onerror = function (evt) {
                console.log(evt);
                reject(evt)
//            if ($this.version > 1) {
//                $this.version = 1;
//                $this.connent(cb);
//            }
            };
        });
    }

    async createNewTables() {
        const $this = this;
        return await Promise.all(this.getNewTables().map(async key => {
            return await new Promise((resolve, reject) => {
                let tbl = $this._databaseTables[key];
                let tblStore = $this.connection.link.createObjectStore(tbl.name, {keyPath: "id", autoIncrement: true});

                if (tbl.indexes && tbl.indexes instanceof Array) {
                    const fn = async () => {
                        return await Promise.all(tbl.indexes.map(async index => {
                            tblStore.createIndex(index.name + "Index", index.name, {unique: index.unique, multiEntry: true});
                        }));
                    };
                    fn().catch(err => {
                        console.error(err);
                        reject(err);
                    }).then(resolve);
                } else {
                    resolve();
                }
            });
        }));
    }

    getNewTables() {
        if (!this.newTables) {
            const $this = this;
            const objectStoreNames = Object.keys(this.connection.link.objectStoreNames).map(key => this.connection.link.objectStoreNames[key]);
            const databaseTableNames = Object.keys(this._databaseTables);

            if (databaseTableNames.length > objectStoreNames.length) {
                this.newTables = databaseTableNames.filter(function (key) {
                    let tbl = $this._databaseTables[key];
                    return !objectStoreNames.contains(tbl.name);
                });
            } else {
                this.newTables = [];
            }
        } else {
            this.newTables = [];
        }
        return this.newTables;
    }
}

class StorageCreator {
    db;

    constructor(settings, fn) {
        this.db = new DB(settings, fn);
    }

    getTable(key) {
        return this.db._databaseTables[key];
    }

    get loggedUser() {
        return this.getTable('loggedUser');
    }

    get stayLogged() {
        return this.getTable('stayLogged');
    }

    get countries() {
        return this.getTable('countries');
    }

    get orphanedUploadedDocs() {
        return this.getTable('orphanedUploadedDocs');
    }

    get configuration() {
        return this.getTable('configuration');
    }

}

const indexedStorage = window.indexedStorage = new StorageCreator({name: "sheqassist_db"}, () => {
    indexedStorage.orphanedUploadedDocs.findAll().then(list => {
        return execWhen(() => storage.is.isLoggedIn).then(() => {
            return Promise.all(list.map(async id => {
                return await neonBinding.events.emit("default/docs/doc/remove", id);
            })).then(list => {
                return indexedStorage.orphanedUploadedDocs.clear();
            });
        });
    });
});

export default indexedStorage;