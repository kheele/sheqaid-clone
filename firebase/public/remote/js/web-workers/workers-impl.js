
importScripts(self.locationRoot + "/js/lib/firebase-8.0.2/app.js");
importScripts(self.locationRoot + "/js/lib/firebase-8.0.2/auth.js");
importScripts(self.locationRoot + "/js/lib/firebase-8.0.2/firestore.js");
importScripts(self.locationRoot + "/js/lib/firebase-8.0.2/storage.js");
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
try {
    firebase.initializeApp(config);
} catch (e) {
    console.log("Firestore already started")
}

console.timeEnd('firebase.initializeApp');

db = firebase.firestore();
db.settings({cacheSizeBytes: db.CACHE_SIZE_UNLIMITED});
db.enablePersistence({experimentalForce: true});

auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

functions = firebase.functions();

lists = {};
observers = {};
callbacks = {};
controllers = {};

db.FieldValue = firebase.firestore.FieldValue;
db.get = async root => {
    if (!controllers[root])
        throw new Error('controllers [' + root + '] not found');
    return controllers[root];
};
db.add = (root, contr) => {
    controllers[root] = contr;
};
db.whenLoggedIn = async cb => {
    if (db.session.isLoggedIn()) {
        return await cb(db.session.getLoggedUser());
    } else {
        throw new Error('Not authenticated');
    }
};
self.execWhen = (test) => {
    return new Promise((resolve, reject) => {
        function exec() {
            const res = test();
            if (res) {
                resolve(res);
            } else {
                if(self.setImmediate) {
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
    var packet = evt.data;
    self.onpacket(packet);
};

self.emit = function () {
    var args = self.toArray(arguments);
    if (args.length === 0) {
        return Promise.reject("No arguments available");
    }
    return new Promise((resolve, reject) => {
        var evt = args.removeFirst();
        if (typeof evt !== "string") {
            reject(evt + ": must be a string");
            return;
        }

        var packet = {opcode: self.event_types.EVENT, evt};

        if (self.acks[evt]) {
            self.acks[evt].ack_id++;
        } else {
            self.acks[evt] = {ack_id: 0};
        }
        var ack_id = self.acks[evt].ack_id;
        acks[evt][ack_id] = {resolve, reject};//ack;

        packet.ack_id = ack_id;
        if (args.length > 0) {
            packet.data = args;
        }

        self.postMessage(packet);
    });
};

self.on = function (evt, callback) {
    if (self.events[evt]) {
        self.events[evt].push(callback);
    } else {
        self.events[evt] = [callback];
    }

    return self;
};

function onpacket(packet) {
    switch (packet.opcode) {
        case self.event_types.EVENT:
            self.onevent(packet);
            break;

        case self.event_types.ACK:
            self.onack(packet);
            break;

        case self.event_types.ERROR:
            self.emit('error', packet.data);
            break;
    }
}

function onevent(packet) {
//    console.log(packet)
    var events = self.events[packet.evt];
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
                !!res && (packet.data = [res]);//toArray(arguments);
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

function onack(packet) {
    const ack = self.acks[packet.evt][packet.ack_id];
    if (!ack) {
//        throw new Error('Event(' + packet.evt + ') response called many times');
    } else {
        //console.log(senderType, 'onack:', packet)
        var {resolve, reject} = ack;
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

function toArray(args) {
    var array = [];
    for (var n in args) {
        array.push(args[n]);
    }
    return array;
}

function whenObserved() {
    const {lists, observers} = self;
    return new Promise((resolve, reject) => {
        function exec() {
            const lts_n = Object.keys(lists).length;
            const obs_n = Object.keys(observers).length;
            if (lts_n > 0 && lts_n === obs_n) {
                resolve();
            } else {
                setImmediate(exec);
            }
        }
        exec();
    });
}

function onLogout() {
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

function onLogin() {
    const {callbacks} = self;
    Object.keys(callbacks).distinct().forEach(key => {
        callbacks[key]();
    });
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

    loginUser(value) {
        this.set("logged_user", value);//user, company
        onLogin();
    }

    logout() {
        delete this.data["logged_user"];//user, company
        onLogout();
    }

    getLoggedUser() {
        return this.data["logged_user"];//user, company
    }

    isLoggedIn() {
        return this.has("logged_user");
    }
}

db.session = new Session();

const {hash} = location;
self.isSharedDocs = hash.startsWith("#shared-docs");//Shared Document
self.isContractorDocs =  hash.startsWith("#contractors");
        
importScripts(self.locationRoot + "d23td6000vd6.js");
importScripts(self.locationRoot + "/js/web-workers/controllers/index.js");