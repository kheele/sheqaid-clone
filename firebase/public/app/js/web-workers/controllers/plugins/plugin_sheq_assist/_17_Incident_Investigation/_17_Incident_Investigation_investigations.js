
(() => {
    class Controller extends AControllerAssist {

        constructor(events, db) {
            super(events, db, {singular: "Incident Investigation", plural: "Incident Investigations"}, "plugin_sheq_assist/17_Incident_Investigation/investigations/");

            this.tbl = 'plugin_sheq_assist_17_Incident_Investigation';

            this.filter = this.filter.bind(this);
            const {addAction, search_by_name, filter, stats} = this;
            
            addAction("add-status", this.addStatus.bind(this));
            addAction("remove-status", this.removeStatus.bind(this));
            addAction("list/filter", filter);
        }

        async updateStatus(evt, id, status, action) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                const snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                const old_data = snapshot.data();
                const {created_at} = old_data;
                if (created_at && created_at.toDate) {
                    old_data.created_at = created_at.toDate();
                }

                const updated = await doc_ref.update({investigation: {status: this.getDB().FieldValue["array" + action](status)}});//Promise < void >

                const auditData = {id: snapshot.id, data: old_data};

                this.editAudit(loggedUser, new Date().getTime(), auditData);

                console.log('update', updated)
                return !!updated;
            });
        }

        async addStatus(evt, id, status) {
            return this.updateStatus(evt, id, status, "Union");
        }

        async removeStatus(evt, id, status) {
            return this.updateStatus(evt, id, status, "Remove");
        }

        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerAssist.prototype.list.call(this, evt);
                return list.filter(({data: {investigation}}) => {
                    return !!investigation;
                });
            });
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {incident_date_range, incident_status, investigation_status, type} = search_val;
                const q = [
                    {key: 'incident_status', comp: '=', val: incident_status},
                    {key: 'investigation_status', comp: '=', val: investigation_status},
                    {key: 'type', comp: '=', val: type}
                ];
                if (incident_date_range) {
                    q.push(...[
                        {key: 'incident_date', comp: '>=', val: incident_date_range.start},
                        {key: 'incident_date', comp: '<=', val: incident_date_range.end}
                    ]);
                }
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();