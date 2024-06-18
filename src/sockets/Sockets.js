import {convertMobx} from "utils/Utils";
import {orgsFilter} from "../graphql/Filters";

class Socket {
    constructor(name) {
        this.name = name;

        this.fn = this.fn.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.findById = this.findById.bind(this);
    }

    fn(name) {
        return async (data) => {
            if (data === undefined || data === null || (Object.keys(data).length === 1 && 'limit' in data)) {
                data = {...data, noFilter: true};
            } else {
                if (!isNumber(data) && !isBoolean(data)) {
                    data = await convertMobx(data);

                    const {is, loggedUser} = storage;
                    if (is.isEmployee) {
                        const {user: {id: logged_employee_id}} = loggedUser;
                        data = {...data, logged_employee_id};
                    } else {
                        const {
                            site_id,
                            project_id,
                            client_id,
                            incContractors,
                            excContractors,
                            excCompany,
                            exact_orgs,
                            exact_orgs_company,
                            contractor_site_id_key,
                        } = data;
                        if (!excCompany) {
                            const orgs_filter = orgsFilter({
                                site_id,
                                project_id,
                                client_id,
                                incContractors,
                                excContractors,
                                exact_orgs,
                                exact_orgs_company,
                                contractor_site_id_key,
                            });

                            data = {...data, orgs_filter};
                        }
                    }
                }
            }

            const path = `${this.name}${name ? ('/' + name) : ''}`;

            return workers.emit('socket/emit', path, data);
        };
    }

    async create(data) {
        data = await convertMobx(data);
        const path = `${this.name}/create`;

        return workers.emit('socket/emit', path, data);
    }

    async update(attrs) {
        attrs = await convertMobx(attrs);
        const path = `${this.name}/update`;

        return workers.emit('socket/emit', path, attrs);
    }

    async delete(id) {
        const path = `${this.name}/delete`;

        return workers.emit('socket/emit', path, id);
    }

    async findById(id) {
        const path = `${this.name}/findById`;

        return workers.emit('socket/emit', path, id);
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
