
(() => {
    class Controller extends AControllerAssist {
        //audit_findings, audit_summary, possible_score, achieved_score
        constructor(events, db) {
            super(events, db, {singular: "Internal Audit Construction Audit", plural: "Internal Audit Construction Audits"}, "plugin_sheq_assist/21_Internal_Audit/construction-audits/", "plugin_sheq_assist_21_Internal_Audit_construction_audits");

            this.search_by_name = this.search_by_name.bind(this);
            this.filter = this.filter.bind(this);
            const {addAction, search_by_name, filter} = this;
            addAction("list/search_by_name", search_by_name);
            addAction("list/filter", filter);
        }

        async create(evt, list) {
            return Events.whenLoggedIn(async loggedUser => {
                let res = await Promise.all(list.map(async data => {
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
                const {date, type, auditor, company} = search_val;
                const q = [
                    {key: 'date', comp: '=', val: date},
                    {key: 'type', comp: 'LIKE', val: type},
                    {key: 'auditor', comp: 'LIKE', val: auditor},
                    {key: 'company', comp: 'LIKE', val: company}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();