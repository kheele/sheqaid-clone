
(() => {
    class Controller extends AControllerAid {
        //org_name, area, contacts
        constructor(events, db) {
            super(events, db, {singular: "External Emergency Number", plural: "External Emergency Numbers"}, "plugin_sheq_assist/16_Emergency_Preparedness/emergency-numbers/external/", "plugin_sheq_assist_16_Emergency_Preparedness_emergency_numbers_external");

            const {addAction} = this;
            
            addAction("dashboard/count", this.dashboard_count.bind(this));
            addAction("list/search_by_name", this.search_by_name.bind(this));
            addAction("list/filter", this.filter.bind(this));
            
        }

        // <editor-fold defaultstate="collapsed" desc="dashboard_count">
        async dashboard_count(evt, opts = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                let {
                    user: {data: {client: my_client, project: my_project, site: my_site}},
                    company: {id: company_id},
                    client_id, project_id, site_id
                } = loggedUser;

                let q = db_hr.collection(`plugin_sheq_assist_16_Emergency_Preparedness_emergency_numbers_external_counters`);

                let key;
                site_id = my_site ? my_site.id : site_id;
                if (site_id) {
                    q = q.doc(`site`);
                    key = site_id;
                } else {
                    project_id = my_project ? my_project.id : project_id;
                    if (project_id) {
                        q = q.doc(`project`);
                        key = project_id;
                    } else {
                        client_id = my_client ? my_client.id : client_id;
                        if (client_id) {
                            q = q.doc(`client`);
                            key = client_id;
                        } else {
                            q = q.doc(`company`);
                            key = company_id;
                        }
                    }
                }

                const snapshot = await q.get();
                if (snapshot.exists) {
                    return snapshot.get(key);
                }
                return 'N/A';
            });
        }
        // </editor-fold>

        async search_by_name(evt, search_val) {
            return this.filter_by(evt, search_val, search_val => {
                return val => {
                    const {org_name} = val.data;
                    return org_name.toLowerCase().startsWith(search_val)
                };
            });
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {org_name, area, contacts} = search_val;
                const q = [
                    {key: 'org_name', comp: 'LIKE', val: org_name},
                    {key: 'area', comp: 'LIKE', val: area},
                    {key: 'contacts', comp: 'LIKE', val: contacts}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();