
importScripts(self.locationRoot + "/js/objects.util.js");
importScripts(self.locationRoot + "/js/date-utils.js");

////
self.event_types = {EVENT: 1, ACK: 2, ERROR: 3};

self.acks = {};
self.events = {};

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
        var args = [];

        if ('data' in packet) {
            args = [...args, ...packet.data];
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