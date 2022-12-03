
(() => {
    class Controller extends AControllerAid {
        //site_id, observation_type, location, desc, causes, corrective_action, observed_team_member_id, signature
        constructor(events, db) {
            super(events, db, {singular: "Internal Audit Safety Observations Report", plural: "Internal Audit Safety Observations Reports"}, "plugin_sheq_assist/21_Internal_Audit/safety-observations-report/", "plugin_sheq_assist_21_Internal_Audit_safety_observations_report");

            this.search_by_name = this.search_by_name.bind(this);
            this.filter = this.filter.bind(this);
            const {addAction, search_by_name, filter} = this;
            addAction("list/search_by_name", search_by_name);
            addAction("list/filter", filter);
        }

        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                this.injectSavable(evt, loggedUser, data);
                const {user_id, company_id, created_at} = data;

                const {photo, site} = data;
                delete data.photo;

                if (typeof site === 'string') {
                    delete data.site;
                    if (site !== 'All') {
                        const _data = {name: site};
                        this.injectSavable(evt, loggedUser, _data);
                        const site_doc_ref = await this.getDB().collection('plugin_sheq_assist_sites').add(_data);//Promise < DocumentReference < T > >
                        const site_doc_snapshot = await site_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        data.site = {id: site_doc_snapshot.id, name: site_doc_snapshot.data().name};
                    }
                }

                const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
                let doc_snapshot;

                const gcsUri = await files.upload.call(this, photo, async function (bucketFile) {
                    doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                    const new_name = this.tbl + '/' + doc_snapshot.id + '/' + bucketFile.name;
                    return new_name;
                }.bind(this)).catch(e => {
//                    doc_ref.delete();//Promise < void >
                    throw e;
                });
                const updated = await doc_ref.update({photo: gcsUri});//Promise < void >

                doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                data = doc_snapshot.data();
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }

                const auditData = {id: doc_snapshot.id, data};

                this.createAudit(loggedUser, data.created_at.getTime(), auditData);

                return auditData;
            });
        }

        async remove(evt, id) {
            return this.removeWithFile(evt, id, async ({data: {photo}}) => {
                photo && await files.remove(photo);
            });
        }

        async search_by_name(evt, search_val) {
            return this.filter_by(evt, search_val, search_val => {
                return val => {
                    const {title} = val.data;
                    return title.toLowerCase().startsWith(search_val)
                };
            });
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {observation_type, location, site, observed_team_member, created_at} = search_val;
                const q = [
                    {key: 'observation_type', comp: 'LIKE', val: observation_type},
                    {key: 'location', comp: 'LIKE', val: location},
                    {key: 'site.name', comp: 'LIKE', val: site},
                    [
                        {key: 'observed_team_member.fname', comp: 'LIKE', val: observed_team_member},
                        {key: 'observed_team_member.lname', comp: 'LIKE', val: observed_team_member}
                    ],
                    {key: 'created_at', comp: '=', val: created_at}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();