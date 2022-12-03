
(function () {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events, db) {
            super(events, db,
                    {singular: "COID Claim Employer Details", plural: "COID Claim Employer Details"},
                    "plugin_sheq_assist/COIDA_Management/claims/client/employer-details/",
                    "plugin_sheq_assist_coida_claims_employer_details"
                    );

            const {addAction} = this;
            addAction("list/filter", this.filter.bind(this));
            addAction("find_by_client_id", this.find_by_client_id.bind(this));

            this.setQueryWhere(company_id => {
                return [['company_id', '==', company_id]];
            });
        }
        // </editor-fold>

        getDB() {
            return db2;
        }

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                const {user, company} = loggedUser;
                const user_id = user.id;
                const company_id = company.id;
                const created_at = FBSettings.FieldValue.serverTimestamp();
                data.user_id = user_id;
                data.company_id = company_id;
                data.created_at = created_at;

                if (data.client) {
                    data.client_id = data.client.id;
                }

                const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >

                const doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                data = doc_snapshot.data();
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }

                const auditData = {id: doc_snapshot.id, data};

                this.createAudit(loggedUser, data.created_at.getTime(), auditData);

                return await mapResults.call(this, auditData);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                const old_data = snapshot.data();
                const {created_at} = old_data;
                if (created_at && created_at.toDate) {
                    old_data.created_at = created_at.toDate();
                }

                if ('client' in updateAttrs) {
                    updateAttrs.client_id = updateAttrs.client.id;
                }

                const updated = await doc_ref.set(updateAttrs, {merge: true});//Promise < void >
                snapshot = await doc_ref.get();

                let data = snapshot.data();
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }

                const auditData = {id: snapshot.id, data: old_data};

                this.editAudit(loggedUser, new Date().getTime(), auditData);

                const res = await mapResults.call(this, {id: snapshot.id, data});
                return res.data;
            });
        }
        // </editor-fold>
        
        // <editor-fold defaultstate="collapsed" desc="find_by_client_id">
        async find_by_client_id(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                const col_ref = await this.getDB().collection(this.tbl).where('client.id', '==', id).limit(1);
                const snapshot = await col_ref.get();
                if (snapshot.empty) {
                    return null;
                }
                const doc = snapshot.docs[0];
                const res = {id: doc.id, data: doc.data()};
                console.log('find_by_client_id', res)
                return await mapResults.call(this, res);
            });
        }
        // </editor-fold>
        
        // <editor-fold defaultstate="collapsed" desc="search_by_name">
        async search_by_name(evt, search_val) {
            return this.filter(evt, {name: search_val});
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

                const res = {id: doc_snapshot.id, data: doc_snapshot.data()};
                return await mapResults.call(this, res);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.list.call(this, evt);
                list = await Promise.all(list.map(mapResults.bind(this)));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name, client_id} = search_val;
                const q = [
                    {key: 'client.id', comp: '=', val: client_id},
                    {key: 'client.data.name', comp: 'LIKE', val: name}
                ];
                return this.filter_impl(evt, q);
            });
        }
        // </editor-fold>

        sortBy(list) {
            list.sortBy("data.client.data.name");
        }

    }

    async function mapResults(item) {
        let {
            id,
            data: {
                company_contact_person,
                client, client_id
            }
        } = item;

        const promise = [];
        if (company_contact_person) {
            promise.push(Events.get('plugin_sheq_assist/employees/').then(employees_ctrl => {
                return employees_ctrl.find_by_id.call(employees_ctrl, null, company_contact_person.id);
            }).then(val => {
                item.data.company_contact_person = val;
            }));
        }
        if ((client && isObject(client) && !client.data) || client_id) {
            promise.push(Events.get('plugin_sheq_assist/clients/').then(clients => {
                return clients.find_by_id.call(clients, null, client ? client.id || client_id : client_id);
            }).then(val => {
                item.data.client = val;
            }));
        }
        await Promise.all(promise);
//                    console.log(this.tbl, item)
        return item;
    }

    new Controller(events, db);

})();