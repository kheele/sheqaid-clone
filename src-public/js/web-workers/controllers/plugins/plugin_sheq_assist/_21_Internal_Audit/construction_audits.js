
(() => {
    class Controller extends AControllerAid {
        //audit_findings, audit_summary, possible_score, achieved_score
        constructor(events, db) {
            super(events, db, {singular: "Internal Audit Construction Audit", plural: "Internal Audit Construction Audits"}, "plugin_sheq_assist/21_Internal_Audit/construction-audits/", "plugin_sheq_assist_21_Internal_Audit_construction_audits");

            const {addAction} = this;
            addAction("list/search_by_name", this.search_by_name.bind(this));
            addAction("list/filter", this.filter.bind(this));
        }

        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                this.injectSavable(evt, loggedUser, data);
                let {
                    auditor, contact_email, contact_person, contact_phone, contract_num, contractor, date, site_name,
                    list_admin, list_appointment_letters, list_registers, list_site_conditions,
                } = data;
                const mapItems = v => isArray(v.photos) && !v.photos.isEmpty();
                if (!!list_admin && list_admin.anyMatch(mapItems)) {
                    delete data.list_admin;
                }
                if (!!list_appointment_letters && list_appointment_letters.anyMatch(mapItems)) {
                    delete data.list_appointment_letters;
                }
                if (!!list_registers && list_registers.anyMatch(mapItems)) {
                    delete data.list_registers;
                }
                if (!!list_site_conditions && list_site_conditions.anyMatch(mapItems)) {
                    delete data.list_site_conditions;
                }

                const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

                const upload = (list, path) => {
                    return Promise.all(list.map(async (q, n) => {
                        if (!q.photos)
                            return q;

                        const photos = await Promise.all(q.photos.map(async (pic, n2) => {
                            const gcsUri = await files.upload.call(this, pic, async function (bucketFile) {
                                const new_name = this.tbl + '/' + doc_snapshot.id + '/' + path + '-' + n + '-' + n2 + '/' + bucketFile.name;
                                return new_name;
                            }.bind(this)).catch(e => {
                                //                        doc_ref.delete();//Promise < void >
                                throw e;
                            });
                            return gcsUri;
                        }));
                        q.photos = photos;
                        return q;
                    }));
                };

                let uploaded = false;
                if (!!list_admin) {
                    list_admin = await upload(list_admin, 'list_admin');
                    uploaded = true;
                }
                if (!!list_appointment_letters) {
                    list_appointment_letters = await upload(list_appointment_letters, 'list_appointment_letters');
                    uploaded = true;
                }
                if (!!list_registers) {
                    list_registers = await upload(list_registers, 'list_registers');
                    uploaded = true;
                }
                if (!!list_site_conditions) {
                    list_site_conditions = await upload(list_site_conditions, 'list_site_conditions');
                    uploaded = true;
                }
                if (uploaded) {
                    await doc_ref.set({list_admin, list_appointment_letters, list_registers, list_site_conditions}, {merge: true});//Promise < void >
                }

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
                const {date, auditor, company} = search_val;
                const q = [
                    {key: 'date', comp: '=', val: date},
                    {key: 'auditor', comp: 'LIKE', val: auditor},
                    {key: 'company', comp: 'LIKE', val: company}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();