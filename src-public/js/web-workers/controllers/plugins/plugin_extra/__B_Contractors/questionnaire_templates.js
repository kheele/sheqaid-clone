
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //name, desc, questions, contractor
        constructor(events) {
            super(events, {singular: "Contractor Questionnaire Template", plural: "Contractor Questionnaire Templates"}, "plugin_sheq_assist/contractors/questionnaires/templates/", "plugin_sheq_assist_contractors_questionnaire_templates");

            const {addAction} = this;

            addAction("list/filter", this.filter.bind(this));
            addAction("categories/list", this.list_categories.bind(this));

            this.setQueryWhere(company_id => {
                const loggedUser = self.session.getLoggedUser();
                let {
                    user: {data: {
                            client: my_client, project: my_project, site: my_site, contractor_id
                        }
                    },
                    client_id, project_id, site_id
                } = loggedUser;

                const list = [
                    ['company_id', '==', company_id]
                ];
                if (my_client) {
                    list.push(['client_id', '==', my_client.id]);
                } else if (client_id) {
                    list.push(['client_id', '==', client_id]);
                }

                console.log('setQueryWhere q', list, this.tbl)
                return list;
            });
        }
        // </editor-fold>

        getDB() {
            return db2;
        }

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            const {name, category, doc_num} = data;
            data.keywords = this.generateKeywords([name]);
            if (category) {
                data.category = category.toLowerCase();
            }
            if (doc_num) {
                data.doc_num = doc_num.toLowerCase();
            }
            let item = await AControllerAid.prototype.createAndUploadHasFile.call(this, evt, data, 'doc');

            if (item) {
                const {id, data: {name, category, doc_num, review_date}} = item;
                if (review_date) {
                    const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                    let doc_snapshot = await doc_ref.get();
                    if (doc_snapshot.exists) {
                        const loggedUser = self.session.getLoggedUser();
                        const ccListByCompany = await ContractorQuestionnaireFuns.getEmailCCReceipientsByCompany.call(this, {
                            loggedUser
                        });

                        await this.onCreateNotification({
                            newId: id,
                            module: '__B_Contractors',
                            _group: 'Questionnaire Template',
                            doc_snapshot,
                            details: {
                                name,
                                category,
                                doc_num,
                                expiry: review_date,
                                expiry_date: review_date.toDate()
                            },
                            ccListByCompany
                        });
                    }
                }

                item = await mapResults(item);
            }

            return item;
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            const {name, category, doc_num} = updateAttrs;
            if (category) {
                updateAttrs.category = category.toLowerCase();
            }
            if (doc_num) {
                updateAttrs.doc_num = doc_num.toLowerCase();
            }
            if (name) {
                updateAttrs.keywords = this.generateKeywords([name]);
            }
            let itemData = await AControllerAid.prototype.updateAndUploadHasFile.call(this, evt, id, updateAttrs, 'doc');
            if (itemData) {
                const {name, category, doc_num, review_date} = updateAttrs;
                if (name || category || doc_num || review_date) {
                    const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                    let doc_snapshot = await doc_ref.get();
                    if (doc_snapshot.exists) {
                        const details = {};
                        if (name) {
                            details.name = name;
                        }
                        if (category) {
                            details.category = category;
                        }
                        if (doc_num) {
                            details.doc_num = doc_num;
                        }
                        if (review_date) {
                            details.expiry = review_date;
                            details.expiry_date = review_date.toDate();
                        }
                        await this.onUpdateNotification({
                            currId: id,
                            doc_snapshot,
                            details
                        });
                    }
                }

                const item = await mapResults({id, data: itemData});
                itemData = item.data;
            }
            return itemData;
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="find_by_id">
        async find_by_id(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                const item = await mapResults({id: doc_snapshot.id, data: doc_snapshot.data()});
                return item;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1}, q => {
                    return q;
                });
                return Promise.all(list.map(mapResults));
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name = '', doc_num, category, client_id, project_id, site_id} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1}, q => {
                    q = q.where('keywords', 'array-contains', name);
                    if (doc_num) {
                        q = q.where('doc_num', '==', doc_num.toLowerCase());
                    }
                    if (category) {
                        q = q.where('category', '==', category.toLowerCase());
                    }
                    if (client_id) {
                        q = q.where('client_id', '==', client_id);
                    }
                    if (project_id) {
                        q = q.where('project_id', '==', project_id);
                    }
                    if (site_id) {
                        q = q.where('site_id', '==', site_id);
                    }
                    return q;
                });
                return Promise.all(list.map(mapResults));
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_categories">
        async list_categories(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1}, q => {
                    q = q.orderBy('category', 'asc');
                    return q;
                });
                return list.map(({data: {category}}) => category.toTitleCase()).distinct();
            });
        }
        // </editor-fold>

        sortBy() {
            return "name";
        }
    }

    new Controller(events);

    // <editor-fold defaultstate="collapsed" desc="mapResults">
    async function mapResults(item) {
        let {data: {
                client, project, site,
                name, category,
            }
        } = item;

        if (name) {
            item.data.name = name.toTitleCase();
        }
        if (category) {
            item.data.category = category.toTitleCase();
        }

        const promise = [];
        if ((client && isObject(client))) {
            promise.push(Events.get('plugin_sheq_assist/clients/').then(clients => {
                return clients.find_by_id.call(clients, null, client.id);
            }).then(val => {
                item.data.client = val;
            }));
        }
        if ((project && isObject(project))) {
            promise.push(Events.get('plugin_sheq_assist/projects/').then(projects => {
                return projects.find_by_id.call(projects, null, project.id);
            }).then(val => {
                item.data.project = val;
            }));
        }
        if ((site && isObject(site))) {
            promise.push(Events.get('plugin_sheq_assist/sites/').then(sites => {
                return sites.find_by_id.call(sites, null, site.id);
            }).then(val => {
                item.data.site = val;
            }));
        }

        await Promise.all(promise);
        return item;
    }
    // </editor-fold>
})();