(() => {
    const path = self.require('path');
//    const {argv}--app-path=
//    console.log(process.argv)
    const paths = [
        path.join(process.resourcesPath, 'app.asar'),
        path.join(process.resourcesPath, 'app.asar', 'node_modules'),
        path.join(process.resourcesPath, 'app', 'node_modules'), //when asar is disabled
        process.resourcesPath.replace(/electron[\\/]dist[\\/]resources/g, ''),
        process.resourcesPath.replace(/node_modules[\\/]electron[\\/]dist[\\/]resources/g, '')
    ];

    paths.map((path) => {
        global.require.main.paths.push(path);
    });
})();

importScripts(self.locationRoot + "/js/lib/firebase-8.0.2/app.js");
importScripts(self.locationRoot + "/js/lib/firebase-8.0.2/auth.js");
importScripts(self.locationRoot + "/js/lib/firebase-8.0.2/firestore.js");
importScripts(self.locationRoot + "/js/lib/firebase-8.0.2/functions.js");

importScripts(self.locationRoot + "/js/web-workers/node/moment-2.24.0.min.js");
importScripts(self.locationRoot + "/js/objects.util.js");
importScripts(self.locationRoot + "/js/date-utils.js");
importScripts(self.locationRoot + "/js/utils.js");

console.time('firebase.initializeApp');
const config = {
    apiKey: "AIzaSyBsbSRsokaAGLjZCjPrCNrfK8OYU-2fJoQ",
    authDomain: "sheqsolve.firebaseapp.com",
    databaseURL: "https://sheqsolve.firebaseio.com",
    projectId: "sheqsolve",
    storageBucket: "sheqsolve.appspot.com",
    messagingSenderId: "208481828404",
    appId: "1:208481828404:web:591b8752f906937101d461",
    measurementId: "G-H0YJ7PWJVG"
};
const config2 = {
    apiKey: "AIzaSyDSnhxZ4F-zk_z4b6JNiKi5ROampjwkNx0",
    authDomain: "sheqassist-8e36a.firebaseapp.com",
    databaseURL: "https://sheqassist.firebaseio.com",
    projectId: "sheqassist-8e36a",
    storageBucket: "sheqassist-8e36a.appspot.com",
    messagingSenderId: "488697177698",
    appId: "1:488697177698:web:ffa7e66e3a80f62d2e533b",
    measurementId: "G-G8Y9C953WC"
};

const apps = {};
try {
    apps.main = firebase.initializeApp(config);
    const authGeneralApp = firebase.initializeApp(config, "authGeneral");
    self.authGeneral = authGeneralApp.auth();

    db = firebase.firestore();
    db.settings({ignoreUndefinedProperties: true, cacheSizeBytes: db.CACHE_SIZE_UNLIMITED});
    db.enablePersistence({experimentalForce: true});

    auth = firebase.auth();
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    functions = firebase.functions();
} catch (e) {
    console.log("Firestore main already started")
}
try {
    apps.other = firebase.initializeApp(config2, "db_2");

    db2 = apps.other.firestore();
    db2.settings({ignoreUndefinedProperties: true, cacheSizeBytes: db.CACHE_SIZE_UNLIMITED});
    db2.enablePersistence({experimentalForce: true});
} catch (e) {
    console.log("Firestore other already started")
}

console.timeEnd('firebase.initializeApp');

lists = {};
observers = {};
callbacks = {};
controllers = {};

db.FieldValue = firebase.firestore.FieldValue;
db2.FieldValue = firebase.firestore.FieldValue;
db.Timestamp = firebase.firestore.Timestamp;
db2.Timestamp = firebase.firestore.Timestamp;

self.execWhen = (test) => {
    return new Promise((resolve, reject) => {
        function exec() {
            const res = test();
            if (res) {
                resolve(res);
            } else {
                if (self.setImmediate) {
                    setImmediate(exec);
                } else {
                    setTimeout(exec, 0);
                }
            }
        }
        exec();
    });
};
////
self.event_types = {EVENT: 1, ACK: 2, ERROR: 3};

self.acks = {};
self.events = {};
events.onAddArgs = args => {
    args.pushFirst(db);
};

self.onclose = evt => {
    console.log("onclose", evt)
};

self.onmessageerror = evt => {
    console.log("onerror", evt)
};

self.onmessage = evt => {
    const packet = evt.data;
    Events.onpacket(packet);
};

class Utils {
    static toArray(args) {
        const array = [];
        for (let n in args) {
            array.push(args[n]);
        }
        return array;
    }

    static onLogout() {
        const {lists, observers} = self;
        Object.keys(lists).forEach(key => {
            delete lists[key];
        });
        Object.keys(observers).forEach(tbl => {
            const observer = observers[tbl];
//        observer remove
            delete observers[tbl];
        });
    }

    static onLogin() {
        const {callbacks} = self;
        Object.keys(callbacks).distinct().forEach(key => {
            callbacks[key]();
        });
    }
}

class Events {
    static async whenLoggedIn(cb) {
        const {session} = self;
        if (session.isLoggedIn()) {
            return await cb(session.getLoggedUser(), session.auth);
        } else {
            throw new Error('Not authenticated');
        }
    }

    static async get(root) {
        if (!controllers[root])
            throw new Error('controllers [' + root + '] not found');
        return controllers[root];
    }

    static add(root, contr) {
        controllers[root] = contr;
    }

    static async emit() {
        const args = Utils.toArray(arguments);
        if (args.length === 0) {
            return Promise.reject("No arguments available");
        }
        return new Promise((resolve, reject) => {
            const evt = args.removeFirst();
            if (typeof evt !== "string") {
                reject(evt + ": must be a string");
                return;
            }

            const packet = {opcode: self.event_types.EVENT, evt};

            if (self.acks[evt]) {
                self.acks[evt].ack_id++;
            } else {
                self.acks[evt] = {ack_id: 0};
            }
            const ack_id = self.acks[evt].ack_id;
            acks[evt][ack_id] = {resolve, reject};//ack;

            packet.ack_id = ack_id;
            if (args.length > 0) {
                packet.data = args;
            }

            self.postMessage(packet);
        });
    }

    static on(evt, callback) {
        if (self.events[evt]) {
            self.events[evt].push(callback);
        } else {
            self.events[evt] = [callback];
        }

        return self;
    }

    static onpacket(packet) {
        switch (packet.opcode) {
            case self.event_types.EVENT:
                Events.onevent(packet);
                break;

            case self.event_types.ACK:
                Events.onack(packet);
                break;

            case self.event_types.ERROR:
                Events.emit('error', packet.data);
                break;
        }
    }

    static onevent(packet) {
//    console.log(packet)
        const events = self.events[packet.evt];
        packet.opcode = self.event_types.ACK;
        if (events) {
            let args = [packet.evt];
            if ('data' in packet) {
                args.pushAll(packet.data);
                delete packet.data;
            }

            events.forEach(event => {
                event.apply(null, args).then(res => {
//                //console.log(senderType, 'events.forEach:', res)
                    !!res && (packet.data = [res]);//Utils.toArray(arguments);
                    postMessage(packet);
                }).catch(e => {
                    //console.log('events err:', e.toString(), e)
                    e = e.stack;//toString();
                    packet.error = e;//e.startsWith("Error: ") ? e.replace("Error: ", "") : e;
                    postMessage(packet);
                });
            });
        } else {
            if ('data' in packet) {
                delete packet.data;
            }
            packet.error = 'Event(' + packet.evt + ') is not found';
            postMessage(packet);
        }
    }

    static onack(packet) {
        const ack = self.acks[packet.evt][packet.ack_id];
        if (!ack) {
//        throw new Error('Event(' + packet.evt + ') response called many times');
        } else {
            //console.log(senderType, 'onack:', packet)
            const {resolve, reject} = ack;
            if ('error' in packet) {
                reject(packet.error);
            } else {
                if ('data' in packet) {
                    resolve.apply(null, packet.data);
                } else {
                    resolve();
                }
            }
            delete self.acks[packet.evt][packet.ack_id];
        }
    }
}

class Session {

    constructor() {
        this.data = {};
    }

    get(key) {
        return this.data[key];
    }

    set(key, value) {
        this.data[key] = value;
    }

    has(key) {
        return !!this.data[key];
    }

    loginUser(value, auth) {
        this.set("logged_user", value);//user, company
        this.set("auth", auth);
        Utils.onLogin();
    }

    logout() {
        delete this.data["logged_user"];//user, company
        delete this.data["auth"];
        Utils.onLogout();
    }

    getLoggedUser() {
        return this.data["logged_user"];//user, company
    }

    get auth() {
        return this.data["auth"];
    }

    isLoggedIn() {
        if(!this.has("logged_user")) return;
        if(!this.has("auth")) return;
        return !!this.auth.currentUser;
    }
}

self.session = new Session();

importScripts(self.locationRoot + "d23td6000vd6.js");
importScripts(self.locationRoot + "/js/web-workers/controllers/index.js");