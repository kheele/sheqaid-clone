import {orgsFilter} from "graphql/Filters";

class Socket {
    constructor(name) {
        this.name = name;
    }

    fn(name) {
        return async (data) => {
            if (!isNumber(data)) {
                const {site_id, project_id, client_id, exact_orgs} = data;
                const orgs_filter = orgsFilter({site_id, project_id, client_id, exact_orgs});

                data = {...data, orgs_filter};
            }

            const path = `${this.name}/${name}`;

            return workers.emit('socket/emit', path, data);
        };
    }
}

window.sockets = {
    of: (name) => {
        return new Socket(name);
    },
    on(evt, fn) {
        workers.on(evt, fn);
        workers.emit('socket/on', evt);

        return this;
    },
    once(evt, fn) {
        workers.once(evt, fn);
        workers.emit('socket/once', evt);

        return this;
    },
};
