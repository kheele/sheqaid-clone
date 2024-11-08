import {convertMobx} from "utils/Utils";
import {orgsFilter} from "../graphql/Filters";

class Socket {
    constructor(name) {
        this.name = name;

        this.fn = this.fn.bind(this);
        this.send = this.send.bind(this);

        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.upsert = this.upsert.bind(this);
        this.findById = this.findById.bind(this);
        this.list = this.list.bind(this);
    }

    fn(name) {
        return async (data) => {
            if (data === undefined || data === null || (Object.keys(data).length === 1 && 'limit' in data)) {
                data = {...(data || {}), noFilter: true};
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

    async send(name, data) {
        if (data === undefined || data === null || (Object.keys(data).length === 1 && 'limit' in data)) {
            data = {...(data || {}), noFilter: true};
        } else {

        }
        const path = `${this.name}${name ? ('/' + name) : ''}`;
        console.log(path, name, data);
        return workers.emit('socket/emit', path, data).catch(err => {
            console.error(err.stack);
            throw err;
        });
    }

    async create(data) {
        data = await convertMobx(data);
        return this.send('create', data);
    }

    async update(attrs) {
        attrs = await convertMobx(attrs);
        return this.send('update', attrs);
    }

    async delete(id) {
        return this.send('delete', id);
    }

    async upsert(attrs) {
        attrs = await convertMobx(attrs);
        return this.send('upsert', attrs);
    }

    async findById(id) {
        return this.send('findById', id);
    }

    async findBy(args) {
        return this.send('findBy', args);
    }

    async list(args) {
        return this.send('list', args);
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
