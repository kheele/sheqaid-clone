
(function () {
    class Controller extends AControllerRead {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events, db) {
            super(events, db,
                    {singular: "COID Service Provider", plural: "COID Service Providers"},
                    "plugin_sheq_assist/COIDA_Management/companies/coid-provider/");

            const {addAction} = this;
            addAction("list/filter", this.filter.bind(this));
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="find_by_id">
        async find_by_id(evt, id, includeRequests = true) {
            return Events.whenLoggedIn(async loggedUser => {
                const query_ref = await db.collection('plugin_manager').
                        where('data.key', '==', 'plugin_claim_management');//Promise < DocumentReference < T > >
                const querySnapshot = await query_ref.get();
                if (querySnapshot.empty) {
                    return null;
                }
                const doc = querySnapshot.docs[0];

                const {data: {modules}} = doc.data();
                const module = modules.find(({key, company_list = []}) => key === '_03_Claim_Management_For_ServiceProviders');
                if (module) {
                    const {company_list = []} = module;
                    if (!company_list.contains(id)) {
                        return null;
                    }

                    let list = (await Promise.all(['plugin_sheq_assist_clients', 'default_companies'].map(async tbl => {
                        const doc_ref = await db.collection(tbl).doc(id);
                        let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                        if (!doc_snapshot.exists) {
                            return null;
                        }

                        const data = doc_snapshot.data();

                        if (includeRequests) {
                            const receipient_coid_provider_id = doc_snapshot.id;
                            const cntr = await Events.get('plugin_sheq_assist/COIDA_Management/companies/coid-provider/requests/');
                            const request = await cntr.find_by_receipient_coid_provider_id.call(cntr, null, receipient_coid_provider_id);

                            data.request = request;
                        }

                        return {id: doc_snapshot.id, data};
                    }))).filter(v => !!v);

                    list = await Promise.all(list.map(PluginsFuns.mapBillableCompanyResults.call(this, evt, true)));
                    return list[0];
                }
                return null;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="find_active_by_company">
        async find_active_by_company(evt) {
            return Events.whenLoggedIn(async loggedUser => {
//                const query_ref = await db.collection('plugin_manager').
//                        where('data.key', '==', 'plugin_claim_management');//Promise < DocumentReference < T > >
//                const querySnapshot = await query_ref.get();
//                if (querySnapshot.empty) {
//                    return null;
//                }
//                const doc = querySnapshot.docs[0];
//
//                const {data: {modules}} = doc.data();
//                const module = modules.find(({key, company_list = []}) => key === '_03_Claim_Management_For_ServiceProviders');
//                if (module) {
//                    const {company_list = []} = module;
//                    if (!company_list.contains(id)) {
//                        return null;
//                    }
//
//                    let list = (await Promise.all(['plugin_sheq_assist_clients', 'default_companies'].map(async tbl => {
//                        const doc_ref = await db.collection(tbl).doc(id);
//                        let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
//                        if (!doc_snapshot.exists) {
//                            return null;
//                        }
//
//                        const data = doc_snapshot.data();
//
//                        const receipient_coid_provider_id = doc_snapshot.id;
//                        const cntr = await Events.get('plugin_sheq_assist/COIDA_Management/companies/coid-provider/requests/');
//                        const request = await cntr.find_by_receipient_coid_provider_id.call(cntr, null, receipient_coid_provider_id);
//
//                        data.request = request;
//
//                        return {id: doc_snapshot.id, data};
//                    }))).filter(v => !!v);
//
//                    list = await Promise.all(list.map(PluginsFuns.mapBillableCompanyResults.call(this, evt, true)));
//                    return list[0];
//                }
//                return null;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                const query_ref = await db.collection('plugin_manager').
                        where('data.key', '==', 'plugin_claim_management');//Promise < DocumentReference < T > >
                const querySnapshot = await query_ref.get();
                if (querySnapshot.empty) {
                    return [];
                }
                const doc = querySnapshot.docs[0];

                const {data: {modules}} = doc.data();
                const module = modules.find(({key, company_list = []}) => key === '_03_Claim_Management_For_ServiceProviders');
                if (module) {
                    const {company_list = []} = module;

                    const lists = await Promise.all(['plugin_sheq_assist_clients', 'default_companies'].map(async tbl => {
                        const list = await Promise.all(company_list.map(async id => {
                            const doc_ref = await db.collection(tbl).doc(id);
                            let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                            if (!doc_snapshot.exists) {
                                return null;
                            }

                            const data = doc_snapshot.data();

                            const receipient_coid_provider_id = doc_snapshot.id;
                            const cntr = await Events.get('plugin_sheq_assist/COIDA_Management/companies/coid-provider/requests/');
                            const request = await cntr.find_by_receipient_coid_provider_id.call(cntr, null, receipient_coid_provider_id);

                            data.request = request;

                            return {id: doc_snapshot.id, data};
                        }));

                        return list.filter(v => !!v);
                    }));

                    const list = [...lists[0], ...lists[1]];
                    return await Promise.all(list.map(PluginsFuns.mapBillableCompanyResults.call(this, evt, true)));
                }
                return [];
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name} = search_val;
                const q = [
                    {key: 'name', comp: 'LIKE', val: name}
                ];
                return this.filter_impl(evt, q);
            });
        }
        // </editor-fold>

    }

    new Controller(events, db);

})();