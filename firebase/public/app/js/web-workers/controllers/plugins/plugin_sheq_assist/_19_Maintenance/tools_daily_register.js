
(() => {
    class Controller extends AControllerAssist {
        //team_id, store_keeper_signature, team_supervisor_signature, tool_list[ids]
        constructor(events, db) {
            super(events, db, {singular: "Asset Register", plural: "Assets Registers"}, "plugin_sheq_assist/19_Maintenance/tools/daily-register/", "plugin_sheq_assist_19_Maintenance_tools_daily_register");
//        this.search_by_name = this.search_by_name.bind(this);
//        const {addAction, search_by_name} = this;
//        addAction("list/search_by_name", search_by_name);
        }

        async create(evt, list) {
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

                    const auditData = {id: doc_snapshot.id, data};

                    this.createAudit(loggedUser, data.created_at.getTime(), auditData);

                    return auditData;
                }));
                console.log(this.tbl, 'res', res)
                return res;
            });
        }

        async remove(evt, id) {
            return this.removeWithFile(evt, id, async ({data: {doc}}) => {
                doc && await files.remove(doc);
            });
        }

    }

    new Controller(events, db);
})();