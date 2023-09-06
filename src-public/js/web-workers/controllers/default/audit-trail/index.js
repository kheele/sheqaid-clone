(function () {
    class Controller extends AControllerRead {
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events) {
            super(events, {singular: "Audit Log", plural: "Audit Logs"}, "audit-trail/", "default_audit_trail");

            this.filter = this.filter.bind(this);
            const {addAction, filter} = this;
            addAction("list/filter", filter);

            this.setQueryWhere(company_id => {
                let {
                    user: {
                        data: {
                            client: my_client, project: my_project, site: my_site, contractor_id
                        }
                    },
                    client_id, project_id, site_id,
                    company: {id},
                    contractor_id: logged_contractor_id
                } = self.session.getLoggedUser();

                contractor_id = logged_contractor_id || contractor_id;

                const list = [['company_id', '==', company_id]];
                if (contractor_id) {
                    list.push(['record.data.contractor_id', '==', contractor_id]);
                }
                if (my_client) {
                    list.push(['record.data.client_id', '==', my_client.id]);
                } else if (client_id) {
                    list.push(['record.data.client_id', '==', client_id]);
                }
                if (my_project) {
                    list.push(['record.data.project_id', '==', my_project.id]);
                } else if (project_id) {
                    list.push(['record.data.project_id', '==', project_id]);
                }
                if (my_site) {
                    list.push(['record.data.site_id', '==', my_site.id]);
                } else if (site_id) {
                    list.push(['record.data.site_id', '==', site_id]);
                }
                return list;
            });

            const transfer = async () => {
                const col_ref = await db.collection(this.tbl).limit(1000);//Promise < DocumentReference < T > >
                const querySnapshot = await col_ref.get();
                await Promise.all(querySnapshot.docs.map(async (doc) => {
                    const ref = await db2.collection(this.tbl).doc(doc.id);
                    await ref.set(doc.data(), {merge: true});

                    await doc.ref.delete();
                    console.log('doc deleted', doc.id);
                }));
                console.log(this.tbl, 'final');
            };
            const fn = async () => {
                await transfer();
                await transfer();
                await transfer();
                await transfer();
                await transfer();
                await transfer();
                await transfer();
                await transfer();
                await transfer();
                await transfer();
            };
//            fn();


            // const v = async () => {
            //     const col_ref = await db2.collection(this.tbl).where("user.lname", "=", "Shaw");//Promise < DocumentReference < T > >
            //     const querySnapshot = await col_ref.get();
            //     const list = querySnapshot.docs.map((doc) => {
            //         const {id} = doc;
            //         const data = doc.data();
            //         return {id, data};
            //     });
            //
            //     const actions = list.groupBy(({id, data}) => data.action);
            //     const tbls = list.groupBy(({id, data}) => data.tbl);
            //     const tbls = list.groupBy(({id, data}) => data.tbl);
            //
            //     console.log(this.tbl, 'final');
            // };
            //
            // v();
        }

        getDB() {
            return db2;
        }

        async list(evt, opts = {}) {
            if (!opts.direction) {
                opts.direction = 'desc';
            }
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts);
                return list;
            });
        }

        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {user: user_id, date_from, date_to, action, tbl} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {direction: 'desc'}, q => {
                    if (tbl) {
                        q = q.where('tbl', '==', tbl);
                    }
                    if (action) {
                        q = q.where('action', '==', action.toLowerCase());
                    }
                    if (date_from) {
                        q = q.where('created_at', '>=', date_from);
                    }
                    if (date_to) {
                        q = q.where('created_at', '<=', date_to);
                    }
                    if (user_id) {
                        q = q.where('user.id', '==', user_id);
                    }
                    return q;
                });
                return list;
            });
        }

        sortBy() {
            return "created_at";
        }
    }

    new Controller(events);
})();