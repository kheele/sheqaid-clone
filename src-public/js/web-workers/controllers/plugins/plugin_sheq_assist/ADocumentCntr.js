
class ADocumentCntr extends AControllerAid {
    //title, type, doc
    constructor(events, db, name, root, fn) {
        super(events, db, name, root, "plugin_sheq_assist_documents", fn);

        const {addAction} = this;

        addAction("update_rev", this.update_rev.bind(this));
        addAction("get_last_doc_num", this.get_last_doc_num.bind(this));

        addAction("shared/approve", this.approveShared.bind(this));
        addAction("shared/remove", this.removeShared.bind(this));
        addAction("shared/list/calendar", this.listByCalendarShared.bind(this));
        addAction("list/filter", this.filter.bind(this));

        this.setQueryWhere(company_id => {
            const loggedUser = self.session.getLoggedUser();
            let {
                user: {data: {
                        client: my_client, project: my_project, site: my_site, contractor_id
                    }
                },
                client_id, project_id, site_id
            } = loggedUser;

            const list = [
                ['company_id', '==', company_id]
            ];
//            let inUsed;
//            if (my_site) {
//                list.push(['site_id', '==', my_site.id]);
//            } else if (site_id) {
//                list.push(['site_id', 'in', [null, site_id]]);
//                inUsed = true;
//            }
//            if (my_project) {
//                list.push(['project_id', '==', my_project.id]);
//            } else if (project_id && !inUsed) {
//                list.push(['project_id', 'in', [null, project_id]]);
//                inUsed = true;
//            }
//            if (my_client) {
//                list.push(['company.id', '==', my_client.id]);
//            } else if (client_id) {
//                list.push(['company.id', '==', client_id]);
//            }
            return list;
        });

        const exec = async () => {
            if (!this.doc_type_key)
                return;
            const doc_ref = await this.getDB().collection(this.doc_type_key);//Promise < DocumentReference < T > >
            const querySnapshot = await doc_ref.get();
            const list = [];
            querySnapshot.forEach((doc) => {
                list.push(doc);
            });

            await Promise.all(list.map(async (doc) => {
                let doc_ref = await this.getDB().collection(this.doc_type_key).doc(doc.id);
                let snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                const data = snapshot.data();

                data.doc_type_key = this.doc_type_key;
                doc_ref = await this.getDB().collection(this.tbl).doc(doc.id);
                const updated = await doc_ref.set(data, {merge: true});//Promise < void >

                console.log('documents done', doc.id);
            }));
            console.log('documents final');
        };

//        setTimeout(() => {
//            exec().catch(err => {
//                console.error('documents error', err)
//            });
//        }, 500);
    }

    async create(evt, data) {
//            {responsible_department, responsible_person, expiry, internal_or_external, desc,
//            title, doc, 
//            client, 
//            doc_num, doc_rev_num}
        data.doc_type_key = this.doc_type_key;
        data.keywords = this.generateKeywords([data.title]);
        return AControllerAid.prototype.create.call(this, evt, data);
    }

    async update_rev(evt, data) {
//            {type, client, title, doc_num, doc: [{doc_rev_num, doc}]}
//            if (data.type === "Upload") {
//                return this.createAndUploadHasManyDocs(evt, data);
//            } else {
//                return AControllerAid.prototype.create.call(this, evt, data);
//            }
    }

    async approveShared(evt, id) {
        return Events.whenLoggedIn(async loggedUser => {
            const tbl = 'sheqassist_shared_docs';
            const doc_ref = await db2.collection(tbl).doc(id);
            let snapshot = await doc_ref.get();
            if (!snapshot.exists) {
                return "NO_EXIST";
            }

            const data = snapshot.data();
            const {created_at} = data;
            if (created_at && created_at.toDate) {
                data.created_at = created_at.toDate();
            }

            const auditData = {id: snapshot.id, data};

            const {
                fname, lname, email, doc_expiry_date, allow_doc_editing, notes,
                doc_tbl, doc_name, doc_id, doc_ref: sharedDoc,
                edited_doc, edited_doc_approved
            } = data;

            let sharedDocTitle;
            if (sharedDoc) {
                const sharedDocRef = await sharedDoc.get();
                let {title, doc} = sharedDocRef.data();
                const lastDoc = doc.pop();
                const removedDoc = doc.pop();
                if (removedDoc) {
                    allow_doc_editing && edited_doc && await files.remove(removedDoc.doc);
                }
                const newDoc = {doc_rev_num: lastDoc.doc_rev_num + 1, doc: edited_doc};
                await sharedDoc.update({doc: [lastDoc, newDoc]});

                sharedDocTitle = title;
            }
            const res = await doc_ref.delete();

            const now = new Date().getTime();
            if (!edited_doc_approved && doc_expiry_date > now) {
                const opts = {
                    from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
                    to: email,
                    subject: doc_name.singular + ' Document Approved From SHEQ Aid',
                    html: '<h3><b>Dear ' + fname + ' ' + lname + '</b></h3>\n\
                        <p>Please note that the link of the document that was sent to you has been approved, therefore it is no more accessible.</p>\n\
                        <hr />\n\
                        <p>Document Title: <b>' + (sharedDocTitle || doc_name.singular) + '</b></p>\n\
                        <p>Document Editing Allowed: <b>' + (allow_doc_editing || "No") + '</b></p>\n\
                        <hr />\n\
                        <p>The link expires on: <b>' + Dates.formatDate(doc_expiry_date) + '</b></p>\n\
                        <p>Kind Regards<br/>SHEQ Aid</p>'
                };
                await Utils.sendEmail(opts);
            }

            this.editAudit(loggedUser, new Date().getTime(), auditData, {name: {singular: "Document Sharing", plural: "Document Sharings"}, tbl});

            return true;
        });
    }

    async removeShared(evt, id) {
        return Events.whenLoggedIn(async loggedUser => {
            const tbl = 'sheqassist_shared_docs';
            const doc_ref = await db2.collection(tbl).doc(id);
            let snapshot = await doc_ref.get();
            if (!snapshot.exists) {
                return "NO_EXIST";
            }

            const data = snapshot.data();
            const {created_at} = data;
            if (created_at && created_at.toDate) {
                data.created_at = created_at.toDate();
            }

            const auditData = {id: snapshot.id, data};

            const {
                fname, lname, email, doc_expiry_date, allow_doc_editing, notes,
                doc_tbl, doc_name, doc_id, doc_ref: sharedDoc,
                edited_doc, edited_doc_approved
            } = data;

            let sharedDocTitle;
            if (sharedDoc) {
                const sharedDocRef = await sharedDoc.get();
                sharedDocTitle = sharedDocRef.data().title;
            }
            allow_doc_editing && edited_doc && await files.remove(edited_doc);
            const res = await doc_ref.delete();

            const now = new Date().getTime();
            if (!edited_doc_approved && doc_expiry_date > now) {
                const opts = {
                    from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
                    to: email,
                    subject: doc_name.singular + ' Document Removed From SHEQ Aid',
                    html: '<h3><b>Dear ' + fname + ' ' + lname + '</b></h3>\n\
                        <p>Please note that the link of the document that was sent to you has been removed.</p>\n\
                        <hr />\n\
                        <p>Document Title: <b>' + (sharedDocTitle || doc_name.singular) + '</b></p>\n\
                        <p>Document Editing Allowed: <b>' + (allow_doc_editing || "No") + '</b></p>\n\
                        <hr />\n\
                        <p>The link expires on: <b>' + Dates.formatDate(doc_expiry_date) + '</b></p>\n\
                        <p>Kind Regards<br/>SHEQ Aid</p>'
                };
                await Utils.sendEmail(opts);
            }

            this.removeAudit(loggedUser, new Date().getTime(), auditData, {name: {singular: "Document Sharing", plural: "Document Sharings"}, tbl});

            return true;
        });
    }

    async remove(evt, id) {
        return this.removeWithFile(evt, id, async ({data: {type, doc}}) => {
            (type === "Upload" && doc && await files.remove(doc));
        });
    }

    async list(evt, opts = {}) {
        return Events.whenLoggedIn(async loggedUser => {
            let list = await AControllerRead.prototype.list.call(this, evt);
            const {
                access_type, user, user: {
                    data: {
                        client: my_client, project: my_project, site: my_site
                    }
                },
                company, client_id, project_id, site_id
            } = loggedUser;

            list = list.filter(({data}) => data.doc_type_key === this.doc_type_key);

            if (my_client) {
                list = list.filter(val => {
                    const {company} = val.data;
                    return company && my_client.id === company.id;
                });
            } else if (client_id) {
                list = list.filter(val => {
                    const {company} = val.data;
                    return company && client_id === company.id;
                });
            }

            list = await Promise.all(list.map(async item => {
                let {id, data, data: {doc}} = item;
                if (Array.isArray(doc)) {
                    doc = doc.getLastElement().doc;
                    console.log('list', id, doc)
                    await this.update(evt, id, {doc_old: doc, doc: null});
                    data.doc_old = doc;
                    delete data.doc;
                    item = await Events.emit("mock/docs/doc/new", item);
                    await this.update(evt, id, {doc: item.data.doc});
                } else if (doc === null) {
                    item = await Events.emit("mock/docs/doc/new", item);
                    await this.update(evt, id, {doc: item.data.doc});
                }
                return item;
            }));
            list.sortBy('data.title');
            return list;
        });
    }

    async filter(evt, search_val) {
        return Events.whenLoggedIn(async loggedUser => {
            let {type, title, expiry_date} = search_val;
            const q = [
                {key: 'type', comp: '=', val: type},
                {key: 'title', comp: 'LIKE', val: title}
            ];
            if (expiry_date === null) {
                q.push({key: 'expiry_date', comp: '==', val: expiry_date})
            } else if (expiry_date) {
                let d = new Date().toDayEndDate();
                if (expiry_date === -1) {
                    expiry_date = d.getTime();
                } else if (expiry_date === 1) {
                    expiry_date = d.addMonths(1).addDays(-1).getTime();
                } else if (expiry_date === 2) {
                    expiry_date = d.addMonths(1).getTime();
                } else if (expiry_date === 3) {
                    expiry_date = d.addMonths(2).getTime();
                } else if (expiry_date === 4) {
                    expiry_date = d.addMonths(3).getTime();
                }
                q.push({key: 'expiry_date', comp: '<=', val: expiry_date})
            }
            return this.filter_impl(evt, q);
        });
    }

    async listByCalendarShared(evt, date, view) {
        let list = await this.listByCalendar(evt, date, view, {
            otherTbl: 'sheqassist_shared_docs',
            filter: [{key: 'doc_tbl', value: this.doc_type_key}],
            listByCalendarKey: 'doc_expiry_date'
        });
        list = await Promise.all(list.map(async item => {
            let {doc_ref} = item.data;
            if (!doc_ref)
                return item;

            doc_ref = await doc_ref.get();
            doc_ref = {id: doc_ref.id, data: doc_ref.data()};
            if (doc_ref.data.created_at) {
                if (isFunction(doc_ref.data.created_at.toDate)) {
                    doc_ref.data.created_at = doc_ref.data.created_at.toDate();
                }
            } else if (doc_ref.data.created_at === null) {
                doc_ref.data.created_at = new Date();
            }
            item.data.doc_ref = doc_ref;
            return item;
        }));
        return list;
    }

    async get_last_doc_num(evt) {
        return Events.whenLoggedIn(async loggedUser => {
            const list = await this.list(evt);
            const nums = list.map(({data: {doc_num}}) => doc_num);
            console.log('nums:', nums)
            if (nums.isEmpty())
                return 0;
            return Math.max(...nums);
        });
    }

    getListByCalendarKey() {
        return 'expiry';
    }
}