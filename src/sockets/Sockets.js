import {orgsFilter} from "graphql/Filters";

class Socket {
    constructor(name) {
        this.name = name;
    }

    fn(name) {
        return async (data) => {
            if(!isNumber(data)) {
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
    }
};
