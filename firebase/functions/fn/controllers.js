
const controllers = require('./controllers/index.js');

class EventManager {
    constructor() {
        this.events = {};
        this.cntrs = {};

        this.add = this.add.bind(this);
        this.get = this.get.bind(this);
        this.on = this.on.bind(this);
        this.emit = this.emit.bind(this);
    }

    add(root, cntr) {
        this.cntrs[root] = cntr;
    }

    get(root) {
        return this.cntrs[root];
    }
    static async get(root) {
        if (!controllers[root])
            throw new Error('controllers [' + root + '] not found');
        return controllers[root];
    }

    on(path, fn) {
        this.events[path] = fn;
    }

    async emit(ctx, path, args) {
        const fn = this.events[path];
        if (fn) {
            if (args) {
                if (Array.isArray(args)) {
                    return await fn(ctx, ...args);
                } else {
                    return await fn(ctx, args);
                }
            } else {
                return await fn(ctx);
            }
        } else {
            return Promise.reject(new Error("Function: " + path + " not available"));
        }
    }
}

const eventManager = new EventManager();
controllers.run(eventManager);
global.eventManager = eventManager;

exports.execFun = functions.runWith({timeoutSeconds: 300, memory: '1GB'}).https.onCall(async (req, ctx) => {
//    console.log('execFun', req);
    const {path, data: args} = req;
    if (args) {
        return await eventManager.emit(ctx, path, args);
    } else {
        return await eventManager.emit(ctx, path);
    }
});