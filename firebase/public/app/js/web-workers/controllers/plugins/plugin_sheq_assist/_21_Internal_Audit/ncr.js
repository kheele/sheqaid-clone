
(() => {
    class Controller extends AControllerAssist {
        //date, type, auditor, company, representative, scope, definition_list, list
        constructor(events, db) {
            super(events, db, {singular: "Internal Audit Non-Conformance Report", plural: "Internal Audit Non-Conformance Reports"}, "plugin_sheq_assist/21_Internal_Audit/ncr/", "plugin_sheq_assist_21_Internal_Audit_ncr");

            const {addAction} = this;

            addAction("list/filter", this.filter.bind(this));
        }

        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                this.injectSavable(evt, loggedUser, data);

                let {document_list, source, selected_source_id} = data;
                if (document_list) {
                    delete data.document_list;
                }

                let selected_source_tbl;
                switch (source) {
                    case "Audit":
                        selected_source_tbl = 'plugin_sheq_assist_21_Internal_Audit_audit';
                        break;
                    case "Checklist":
                        selected_source_tbl = 'plugin_sheq_assist_21_Internal_Audit_checklist';
                        break;
                    case "Inspection":
                        selected_source_tbl = 'plugin_sheq_assist_21_Internal_Audit_inspection';
                        break;
                    case "Incident Investigation":
                        selected_source_tbl = 'plugin_sheq_assist_17_Incident_Investigation';
                        break;
                    default:
                        return 'SOURCE_UNKNOWN';
                }
                const selected_source_ref = await this.getDB().collection(selected_source_tbl).doc(selected_source_id);
                const selected_source_snapshot = await selected_source_ref.get();
                if (!selected_source_snapshot.exists) {
                    return 'SELECTED_SOURCE_NOT_FOUND';
                }

                data.selected_source_ref = selected_source_ref;

                const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >;

                if (document_list) {
                    document_list = await Promise.all(document_list.map(async (file, n) => {
                        const gcsUri = await files.upload.call(this, file, async function (bucketFile) {
                            const name = fileUtils.getFileName(file).replaceAll(' ', '_');
                            const new_name = this.tbl + '/' + doc_snapshot.id + '/document_list/' + n + '/' + name;
                            return new_name;
                        }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                            throw e;
                        });
                        return gcsUri;
                    }));
                    await doc_ref.set({document_list}, {merge: true});//Promise < void >
                }

                doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >;
                data = doc_snapshot.data();
                data.selected_source_ref = {id: selected_source_snapshot.id, data: selected_source_snapshot.data()};
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }

                const auditData = {id: doc_snapshot.id, data};

                this.createAudit(loggedUser, data.created_at.getTime(), auditData);

                return auditData;
            });
        }

        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerAssist.prototype.list.call(this, evt);
                return await Promise.all(list.map(async val => {
                    const {id, data: {source, selected_source_ref}} = val;
                    console.log('selected_source_ref', selected_source_ref)
                    if (isFunction(selected_source_ref.get)) {
                        const selected_source_snapshot = await selected_source_ref.get();
                        if (selected_source_snapshot.exists) {
                            const data = selected_source_snapshot.data();
                            const {created_at} = data;
                            if (created_at && created_at.toDate) {
                                data.created_at = created_at.toDate();
                            }
                            val.data.selected_source_ref = {id: selected_source_snapshot.id, data};
                        }
                    }
                    return val;
                }));
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