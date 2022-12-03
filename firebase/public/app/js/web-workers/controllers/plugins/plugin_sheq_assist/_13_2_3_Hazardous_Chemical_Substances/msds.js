
(() => {
    class Controller extends AControllerAssist {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //title, sec1
        constructor(events, db) {
            super(events, db, {singular: "Material Safety Data Sheet", plural: "Material Safety Data Sheets"}, "plugin_sheq_assist/Hazardous_Chemical_Substances/msds/", "plugin_sheq_assist_Hazardous_Chemical_Substances_msds");

            const {addAction} = this;
            addAction("list/filter", this.filter.bind(this));
            addAction("list/search_by_name", this.search_by_name.bind(this));
            addAction("category/list", this.list_categories.bind(this));
            addAction("manufacturer/list", this.list_manufacturers.bind(this));

            addAction("select/filter", this.filter_select.bind(this));
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            data.keywords = this.generateKeywords([data.name]);
            const item = await this.createAndUploadHasFile(evt, data, "doc");
            return mapResults(item);
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            if (updateAttrs.name) {
                updateAttrs.keywords = this.generateKeywords([updateAttrs.name]);
            }
            const updatedData = await this.updateAndUploadHasFile(evt, id, updateAttrs, "doc");
            let updatedItem = {id, data: updatedData};
            updatedItem = await mapResults(updatedItem);

            return updatedItem.data;
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="remove">
        async remove(evt, id) {
            return this.removeWithFile(evt, id, async ({data: {doc}}) => {
                doc && await files.remove(doc);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel(evt, list) {
            return Events.whenLoggedIn(async loggedUser => {
                if (list.isEmpty()) {
                    return "EMPTY";
                }

                const cols = [
                    {header: 'Date Identified', key: 'Date Identified', width: 25},
                    {header: 'Company', key: 'Company', width: 25},
                    {header: 'Project', key: 'Project', width: 25},
                    {header: 'Site', key: 'Site', width: 25},

                    {header: 'Product Name', key: 'Product Name', width: 35},
                    {header: 'Emergency Phone No.', key: 'Emergency Phone No.', width: 25},
                    {header: 'Category', key: 'Category', width: 25},
                    {header: 'Manufacturer', key: 'Manufacturer', width: 25},
                    {header: 'Risk Level', key: 'Risk Level', width: 25}
                ];

                console.log('print', list)

                const rows = list.map(({id, data: {
                client, project, site,
                        created_at, name, category, manufacturer, risk_level, emergency_phone, date_identified, doc
                }}) => {
                    const res = {
                        'Date Identified': date_identified ? Dates.formatDate(date_identified) : 'N/A',

                        Company: isString(client) ? client : (client ? (client.name || client.data.name) : ""),
                        Project: isString(project) ? project : (project ? (project.name || project.data.name) : ""),
                        Site: isString(site) ? site : (site ? (site.name || site.data.name) : ""),

                        'Product Name': name,
                        'Emergency Phone No.': emergency_phone || 'N/A',
                        'Category': category || 'N/A',
                        'Manufacturer': manufacturer || 'N/A',
                        'Risk Level': risk_level || 'N/A',
                    };

                    return res;
                });

                return await this.export_excel_impl(loggedUser, "MSDS-Docs", "MSDS-Active", "MSDS Data", cols, rows);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            let {searchText = ""} = opts;
            searchText = searchText.toLowerCase();
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, q => {
                    const filter = createDbFilter(searchText);
                    return filter(q);
                });
                list = await Promise.all(list.map(mapResults));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="search_by_name">
        async search_by_name(evt, name) {
            return await this.filter(evt, {name});
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_select">
        async filter_select(evt, filterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {user: {data: {client: my_client, project: my_project, site: my_site}}} = loggedUser;
                const {name = "", client_id, project_id, site_id, isNew} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {isNew, limit: -1}, q => {
                    if (my_client) {
                        q = q.where('client_id', '==', my_client.id);
                    } else if (client_id) {
                        q = q.where('client_id', '==', client_id);
                    }
                    if (my_project) {
                        q = q.where('project_id', '==', my_project.id);
                    } else if (project_id) {
                        q = q.where('project_id', '==', project_id);
                    }
                    if (my_site) {
                        q = q.where('site_id', '==', my_site.id);
                    } else if (site_id) {
                        q = q.where('site_id', '==', site_id);
                    }
                    return q.where("keywords", "array-contains", name);
                });
                list = await Promise.all(list.map(mapResults));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name = "", category, manufacturer, risk_level} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    if (category) {
                        q = q.where('category', '==', category);
                    }
                    if (manufacturer) {
                        q = q.where('manufacturer', '==', manufacturer);
                    }
                    if (risk_level) {
                        q = q.where('risk_level', '==', risk_level);
                    }
                    const filter = createDbFilter(name);
                    return filter(q);
                });
                list = await Promise.all(list.map(mapResults));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_categories">
        async list_categories(evt) {
            return list_distinct_keys.call(this, evt, 'category');
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_manufacturers">
        async list_manufacturers(evt) {
            return list_distinct_keys.call(this, evt, 'manufacturer');
        }
        // </editor-fold>

        sortBy() {
            return "name";
        }
    }

    // <editor-fold defaultstate="collapsed" desc="list_distinct_keys">
    function list_distinct_keys(evt, key) {
        return Events.whenLoggedIn(async loggedUser => {
            const name = "";
            let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1}, q => {
                q = q.where(key, '!=', null);
                const filter = createDbFilter(name);
                q = q.orderBy(key, "asc");
                return filter(q);
            });
            return list.map(val => {
                return val.data[key];
            }).distinct();
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="createDbFilter">
    function createDbFilter(searchText) {
        return q => {
            return q.where("keywords", "array-contains", searchText);
        };
    }
    // </editor-fold>

    async function mapResults(item) {
        let {data, data: {
                client, project, site, client_id, project_id, site_id
            }
        } = item;

        const promise = [];

        if ((client && isObject(client) && !client.data) || client_id) {
            promise.push(Events.get('plugin_sheq_assist/clients/').then(clients => {
                return clients.find_by_id.call(clients, null, client ? client.id || client_id : client_id);
            }).then(val => {
                item.data.client = val;
            }));
        }
        if ((project && isObject(project) && !project.data) || project_id) {
            promise.push(Events.get('plugin_sheq_assist/projects/').then(projects => {
                return projects.find_by_id.call(projects, null, project ? project.id || project_id : project_id);
            }).then(val => {
                item.data.project = val;
            }));
        }
        if ((site && isObject(site) && !site.data) || site_id) {
            promise.push(Events.get('plugin_sheq_assist/sites/').then(sites => {
                return sites.find_by_id.call(sites, null, site ? site.id || site_id : site_id);
            }).then(val => {
                item.data.site = val;
            }));
        }
        await Promise.all(promise);

        return item;
    }

    new Controller(events, db);
})();