self.event_types = {EVENT: 1, ACK: 2, ERROR: 3};

self.acks = {};
self.events = {};

lists = {};
observers = {};
callbacks = {};
controllers = {};

class Events {
    static async whenLoggedIn(cb) {
        if (self.session.isLoggedIn) {
            return await cb(self.session.getLoggedUser());
        } else {
            throw new Error('Not authenticated');
        }
    }

    static async get(root) {
        if (!controllers[root])
            throw new Error('controllers [' + root + '] not found');
        return controllers[root];
    }

    static async getByCollectionGroup(collectionGroup) {
        const cntr = Object.keys(controllers).map(root => controllers[root]).filter(cntr => !!cntr).find(cntr => {
            return cntr.collectionGroup === collectionGroup;
        });

        if (!cntr)
            throw new Error('controllers by collectionGroup [' + collectionGroup + '] not found');
        return cntr;
    }

    static async getByTable(tbl) {
        const cntr = Object.keys(controllers).map(root => controllers[root]).filter(cntr => !!cntr).find(cntr => {
            return cntr.tbl === tbl;
        });

        if (!cntr)
            throw new Error('controllers by tbl [' + tbl + '] not found');
        return cntr;
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
        // console.log('onevent', packet)
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
                    // console.log('events the:', packet, res)
                    postMessage(packet);
                }).catch(e => {
                    console.log('events err:', packet, e.toString(), e)
//                    e = e.stack;//toString();
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
