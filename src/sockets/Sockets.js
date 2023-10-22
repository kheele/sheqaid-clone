import {orgsFilter} from "graphql/Filters";

class Socket {
    constructor(name) {
        this.name = name;
    }

    fn(name) {
        return async (data) => {
            const {site_id, project_id, client_id, exact_orgs} = data;
            const orgs_filter = orgsFilter({site_id, project_id, client_id, exact_orgs});

            const path = `${this.name}/${name}`;

            return workers.emit('socket/emit', path, {...data, orgs_filter});
        };
    }
}

window.sockets = {
    of: (name) => {
        return new Socket(name);
    }
};
