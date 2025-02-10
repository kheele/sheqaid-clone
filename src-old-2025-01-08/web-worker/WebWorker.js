const createLocationRoot = () => {
    let loc;
    const {location, location: {hostname}} = document;
    if (hostname.contains('sheqaid.com')) {
        loc = `https://${hostname}/`;
    } else {
        loc = location.toString().replace("index.html", "");
        if (loc.contains('#')) {
            loc = loc.replace(location.hash, "").replace("#", "");
        }

        if (loc.contains('~admin/')) {
            loc = loc.replace('~admin/', '/');
//            console.log('loc', loc)
        } else if (loc.contains('~admin')) {
            loc = loc.replace('~admin', '');
//            console.log('loc', loc)
        }
        if (loc.contains('~forms/')) {
            loc = loc.replace('~forms/', '/');
//            console.log('loc', loc)
        } else if (loc.contains('~forms')) {
            loc = loc.replace('~forms', '');
//            console.log('loc', loc)
        }
    }

    return loc;
};

window.locationRoot = createLocationRoot();

const event_types = {EVENT: 1, ACK: 2, ERROR: 3};

export default class WebWorker {
    acks = {};
    events = {};

    constructor(inlineFn) {
        let loc = locationRoot;

        let code = "function() {\n";
        code += "\tself.locationRoot = '" + loc + "';\n";
        if (inlineFn) {
            code += "\timportScripts('" + loc + "js/web-workers/workers-inline-impl.js');\n";
            code += "\t(" + inlineFn.toString() + "\n)();\n";
        } else {
            code += "\timportScripts('" + loc + "js/web-workers/workers-impl.js');\n";
            code += "\tEvents.on('connected', async function(db, isConnected) {\n";
            code += "\t\tself.db && (self.db.isConnected = true);\n";
            code += "\t\treturn null;\n";
            code += "\t});\n";
        }
        code += "}";
        const blob = new Blob(["(" + code + ")();"], {type: 'text/javascript'});

        let self = this;
        this.out = new Worker(URL.createObjectURL(blob));
        this.out.onclose = function (evt) {
            console.log("onclose", evt)
        };
        this.out.onmessageerror = function (evt) {
            console.log("onerror", evt)
        };
        this.out.onmessage = function (evt) {
            let packet = evt.data;
            onpacket.call(self, packet);
        };
    }

    terminate() {
        this.out.terminate();
    }

    connect(name) {
        const inner = new WebWorkerInner(this, name);
        this.emit("connect", name);
        return inner;
    }

//    connect(file) {
//        const blob = new Blob(["(" + file + ")();"], {type: 'text/javascript'});
//        const url = URL.createObjectURL(blob);
//        const inner = new WebWorkerInner(this, url);
//        this.emit("connect", url);
//        return inner;
//    }

    emit() {
        let args = toArray(arguments);
        if (args.length === 0) {
            return Promise.reject("No arguments available");
        }
        return new Promise((resolve, reject) => {
            let evt = args.removeFirst();
            if (typeof evt !== "string") {
                reject(evt + ": must be a string");
                return;
            }
            let packet = {opcode: event_types.EVENT, evt};

            let ack_evt = this.acks[evt];
            if (ack_evt) {
                ack_evt.ack_id++;
            } else {
                ack_evt = this.acks[evt] = {ack_id: 0};
            }
            let ack_id = ack_evt.ack_id;
            ack_evt[ack_id] = {resolve, reject};//ack;

            packet.ack_id = ack_id;
            if (args.length > 0) {
                packet.data = args;
            }

//            //console.log(packet)
            this.out.postMessage(packet);
        });
    }

    on(evt, callback) {
        if (this.events[evt]) {
            this.events[evt].push(callback);
        } else {
            this.events[evt] = [callback];
        }

        return this;
    }

    once(evt, callback) {
        return this.on(evt, callback);
    }

    off(evt, callback) {
        if (this.events[evt]) {
            console.log('off start', evt, this.events[evt].length)
            this.events[evt].remove(callback);
            console.log('off done', evt, this.events[evt].length)
        }

        return this;
    }
}

class WebWorkerInner {
    constructor(ww, name) {
        this.ww = ww;
        this.key = name;
    }

    emit() {
        let args = toArray(arguments);
        if (args.length === 0) {
            return Promise.reject("No arguments available");
        }
        return new Promise((resolve, reject) => {
            let evt = args.removeFirst();
            if (typeof evt !== "string") {
                reject(evt + ": must be a string");
                return;
            }
            let packet = {opcode: event_types.EVENT, evt};

            if (this.ww.acks[evt]) {
                this.ww.acks[evt].ack_id++;
            } else {
                this.ww.acks[evt] = {ack_id: 0};
            }
            let ack_id = this.ww.acks[evt].ack_id;
            this.ww.acks[evt][ack_id] = {resolve, reject};//ack;

            packet.ack_id = ack_id;
            if (args.length > 0) {
                packet.data = args;
            }

//            //console.log(packet)
            this.ww.out.postMessage(packet);
        });
    }

    on(evt, callback) {
        if (this.ww.events[evt]) {
            this.ww.events[evt].push(callback);
        } else {
            this.ww.events[evt] = [callback];
        }

        return this;
    }
    
    off(evt, callback) {
        if (this.ww.events[evt]) {
            this.ww.events[evt].remove(callback);
        }

        return this;
    }
}

function onpacket(packet) {
    switch (packet.opcode) {
        case event_types.EVENT:
            onevent.call(this, packet);
            break;

        case event_types.ACK:
            onack.call(this, packet);
            break;

        case event_types.ERROR:
            this.emit('error', packet.data);
            break;
    }
}

function onevent(packet) {
    const events = this.events[packet.evt];
    packet.opcode = event_types.ACK;
    if (events) {
        let args = [];
        this.onAddArgs && this.onAddArgs(args);

        if ('data' in packet) {
            args = [...args, ...packet.data];
            delete packet.data;
        }

//        console.log('onevent', packet, events)
        events.forEach(event => {
            event.apply(null, args).then(res => {
//                //console.log(this.senderType, 'events.forEach:', res)
                !!res && (packet.data = [res]);//toArray(arguments);
                this.out.postMessage(packet);
            }).catch(e => {
                //console.log('events err:', e.toString(), e)
//                e = e;//toString();
                packet.error = e;//e.startsWith("Error: ") ? e.replace("Error: ", "") : e;
                this.out.postMessage(packet);
            });
        });
    } else {
        if ('data' in packet) {
            delete packet.data;
        }
        packet.error = 'Event(' + packet.evt + ') is not found';
        this.out.postMessage(packet);
    }
}

function onack(packet) {
//    console.log('onack: ', packet)
    const ack = this.acks[packet.evt][packet.ack_id];
    if (!ack) {
//        throw new Error('Event(' + packet.evt + ') response called many times');
    } else {
        //console.log(this.senderType, 'onack:', packet)
        let {resolve, reject} = ack;
        if ('error' in packet) {
            reject(packet.error);
        } else {
            if ('data' in packet) {
                resolve.apply(null, packet.data);
            } else {
                resolve();
            }
        }
        delete this.acks[packet.evt][packet.ack_id];
    }
}

function toArray(args) {
    let array = [];
    for (let n in args) {
        array.push(args[n]);
    }
    return array;
}