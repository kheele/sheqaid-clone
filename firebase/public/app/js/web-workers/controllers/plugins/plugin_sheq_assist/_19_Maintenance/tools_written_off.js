
(() => {
    class Controller extends AControllerAssist {
        //tool_id, store_keeper_signature, manager_signature
        //store_keeper_signature, manager_signature, tool_list[ids]
        constructor(events, db) {
            super(events, db, {singular: "Asset Written-Off", plural: "Assets Written-Off"}, "plugin_sheq_assist/19_Maintenance/tools-witten-off/", "plugin_sheq_assist_19_Maintenance_tools_witten_off");

            this.pending_create = this.pending_create.bind(this);
            this.approved_create = this.approved_create.bind(this);

            this.pending_list = this.pending_list.bind(this);
            this.approved_list = this.approved_list.bind(this);

            const {addAction, pending_create, approved_create, pending_list, approved_list} = this;
            addAction("pending/create", pending_create);//store_keeper_signature, manager_signature, tool_list[ids]
            addAction("approved/create", approved_create);//tool_id, store_keeper_signature, manager_signature
            addAction("pending/list", pending_list);//tool_id, store_keeper_signature, manager_signature
            addAction("approved/list", approved_list);//tool_id, store_keeper_signature, manager_signature
        }

        async pending_create(evt, list) {
            return Events.whenLoggedIn(async loggedUser => {
                const res = await Promise.all(list.map(async data => {
                    this.injectSavable(evt, loggedUser, data);
                    const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
                    let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                    data = doc_snapshot.data();
                    const {created_at} = data;
                    if (created_at && created_at.toDate) {
                        data.created_at = created_at.toDate();
                    }
                    return {id: doc_snapshot.id, data};
                }));
                console.log(this.tbl, 'res', res)
                return res;
            });
        }

        async approved_create(evt, data) {
            return this.createAndUploadHasFile(evt, data, "doc", data => {
                data.type = data.doc.endsWith('.pdf') ? "Document" : "Video";
            });
        }

        async pending_list(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await this.list(evt);
                const filtered = list.filter(val => {
                    const {key, value} = search_val;
                    return val.data[key] === value;
                });

                //console.log(this.tbl, 'filtered', filtered.length)
                return filtered;
            });
        }

        async approved_list(evt, search_val) {
            return this.filter_by(evt, search_val, search_val => {
                return val => {
                    let {type, job_title, course_or_module} = val.data;
                    let search_val_type = search_val.type;
                    let search_val_value = search_val.value.toLowerCase();
                    return type === search_val_type && (job_title.toLowerCase().startsWith(search_val_value) || course_or_module.toLowerCase().startsWith(search_val_value))
                };
            });
        }
    }

    new Controller(events, db);
})();