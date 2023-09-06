
(() => {
    class Controller extends AControllerAid {
        /*area, section, 
         name_of_injured_person, age, occupation,
         employer, employer_or_contractor,
         incident_date, incident_time, location_of_incident, incident_type,
         desc_of_incident,
         severity, immediate_causes_of_incident,
         immediate_actions_taken_to_prevent_a_similar_incident, distributions,
         reported_by, position, date_reported*/
        constructor(events) {
            super(events, {singular: "Incident Investigation Flash Report", plural: "Incident Investigation Flash Reports"}, "plugin_sheq_assist/17_Incident_Investigation/flash-reports/", "plugin_sheq_assist_17_Incident_Investigation_flash_reports");

            this.search_by_name = this.search_by_name.bind(this);
            this.filter = this.filter.bind(this);
            const {addAction, search_by_name, filter} = this;
            addAction("list/search_by_name", search_by_name);
            addAction("list/filter", filter);
        }

        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                this.injectSavable(evt, loggedUser, data);

                let {photo_list} = data;
                delete data.photo_list;

                const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >

                let doc_snapshot = await doc_ref.get();

                photo_list = await Promise.all(photo_list.map(async path => {
                    const gcsUri = await files.upload.call(this, path, async bucketFile => {
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/' + bucketFile.name;
                        return new_name;
                    }).catch(e => {
//                    doc_ref.delete();//Promise < void >
                        throw e;
                    });
                    return gcsUri;
                }));

                const updated = await doc_ref.update({photo_list});//Promise < void >

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
            return this.removeWithFile(evt, id, async ({data: {photo_list}}) => {
                await Promise.all(photo_list.map(async v => {
                    return v && await files.remove(v);
                }));
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
                const {name_of_injured_person, occupation, employer, incident_type, reported_by} = search_val;
                const q = [
                    {key: 'name_of_injured_person', comp: 'LIKE', val: name_of_injured_person},
                    {key: 'occupation', comp: 'LIKE', val: occupation},
                    {key: 'employer', comp: 'LIKE', val: employer},
                    {key: 'incident_type', comp: '=', val: incident_type},
                    {key: 'reported_by', comp: 'LIKE', val: reported_by}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events);
})();