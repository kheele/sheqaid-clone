
class PluginsFuns {

    static async find_billable_by_id(id, onlyCompany = false) {
        let items = await Promise.all(['plugin_sheq_assist_clients', 'default_companies'].map(async tbl => {
            try {
                const doc_ref = await db.collection(tbl).doc(id);//Promise < DocumentReference < T > >
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                const data = doc_snapshot.data();
                if (data.created_at) {
                    data.created_at = data.created_at.toDate();
                }

                let list = [{id: doc_snapshot.id, data}];
                list = await Promise.all(list.map(PluginsFuns.mapBillableCompanyResults.call(this, null, onlyCompany)));
                return list[0];
            } catch (err) {
                return null;
            }
        }));
        items = items.filter(v => !!v);
        return items[0];
    }

    static async mapPluginsResults(item) {
        const {id, data: {data, data: {modules = []}}} = item;
        if (modules && !modules.isEmpty()) {
            item.data.modules = await Promise.all(modules.map(async v => {
                if (v.company_list) {
                    v.company_list_keys = v.company_list.filter(id => !!id);
                    v.company_list = await Promise.all(v.company_list_keys.map(async id => {
                        return PluginsFuns.find_billable_by_id.call(this, id, true);
                    }));
                    v.company_list = v.company_list.filter(v => !!v);
                }
                return v;
            }));
        }
//        console.log('PluginsFuns.mapResults', {id, data})
        return {id, data};
    }

    static mapBillableCompanyResults(evt, onlyCompany = false) {
        return async v => {
            const {
                company_id, 
                name, company_name, 
                address, company_address,
                category, company_category
            } = v.data;

            v.data.name = company_name || name;
            v.data.address = company_address || address;
            v.data.category = company_category || category;

            if (company_id) {
                const doc_ref = await db.collection('default_companies').doc(company_id);//Promise < DocumentReference < T > >
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (doc_snapshot.exists) {
                    const data = doc_snapshot.data();
                    if (data.created_at) {
                        data.created_at = data.created_at.toDate();
                    }
                    v.data.consultant = {id: doc_snapshot.id, data};
                }
            }

            if (onlyCompany)
                return v;

            const projects = await Events.get('plugin_sheq_assist/projects/');
            const projects_list = await projects.list(evt);
            v.data.projects = projects_list.filter(v1 => {
                const {client, client_id} = v1.data;
                if (client) {
                    return client.id === v.id;
                } else {
                    return client_id === v.id;
                }
            });
            const sites = await Events.get('plugin_sheq_assist/sites/');
            const sites_list = await sites.list(evt);
            v.data.sites = sites_list.filter(v1 => {
                const {client, client_id} = v1.data;
                if (client) {
                    return client.id === v.id;
                } else {
                    return client_id === v.id;
                }
            });

            return v;
        };
    }

}