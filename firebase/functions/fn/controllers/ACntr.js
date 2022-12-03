
class ACntr {
    constructor(eventManager, root, tbl) {
        eventManager.add(root, this);

        this.eventManager = eventManager;
        this.root = root;
        this.tbl = tbl;

        this.addAction = this.addAction.bind(this);

        const {addAction} = this;

        this.createPDF && addAction("create/pdf", this.createPDF.bind(this));
        addAction("find_by_id", this.find_by_id.bind(this));
        addAction("find_by_ids", this.find_by_ids.bind(this));
        addAction("count", this.count.bind(this));
        addAction("list", this.list.bind(this));
    }

    addAction(name, fn) {
        const {root, eventManager} = this;
        eventManager.on(root + name, fn);
    }

    async whenLoggedIn(ctx) {
        if (ctx.auth.uid) {
            const {auth: {uid, token: {name, picture, email}}} = ctx;
            let doc_ref = await db.collection('default_users').doc(uid);
            const snapshot = await doc_ref.get();
            if (!snapshot.exists) {
                return null;
            }
            const db_user = {id: snapshot.id, data: snapshot.data()};
            //company_name, company_phone, country, zone
            let db_company = await db.collection('default_companies').doc(db_user.data.company_id).get();

            const company_data = db_company.data();
            company_data.created_at = company_data.created_at.toDate();

            db_company = {id: db_company.id, data: company_data};
            const loggedUser = {user: db_user, company: db_company};
//            const loggedUser = {user: db_user, company: db_company, access_type: 'User'};

            return loggedUser;
        } else {
            throw new Error('Not authenticated');
        }
    }

    async find_by_id(ctx, id) {
        let doc_ref = db.collection(this.tbl).doc(id);//Promise < DocumentReference < T > >
        const snapshot = await doc_ref.get();
        return {id: snapshot.id, data: snapshot.data()};
    }

    async find_by_ids(ctx, data, ids) {
        let list = await this.list(ctx, data);
        const res = list.filter(v => ids.contains(v.id));
//            console.log(this.tbl, 'find_by_id', res, id)
        return res;
    }

    async list(ctx, data) {
        return this.whenLoggedIn(ctx).then(async loggedUser => {
//        const {auth: {uid, token: {name, picture, email}}} = ctx;
//        console.log('total_stats', data);
            const {client_id, project_id, site_id} = data;
            let q = db.collection(this.tbl);//Promise < DocumentReference < T > >
            q = q.where("company_id", "=", loggedUser.company.id);
            if (client_id) {
                q = q.where("client_id", "=", client_id);
            }
            if (project_id) {
                q = q.where("project_id", "=", project_id);
            }
            if (site_id) {
                q = q.where("site_id", "=", site_id);
            }
            const querySnapshot = await q.get();//Promise < DocumentReference < T > >
            const list = [];
            querySnapshot.docs.forEach(doc => {
                const data = {id: doc.id, data: doc.data()};
                if (data.created_at) {
                    data.created_at = data.created_at.toDate();
                }
                list.push(data);
            });
            return list;
        });
    }

    async count(ctx, data) {
        return this.whenLoggedIn(ctx).then(async loggedUser => {
//        console.log('total_stats', data);
            const {client_id, project_id, site_id} = data;
            let q = db.collection(this.tbl);//Promise < DocumentReference < T > >
            q = q.where("company_id", "=", loggedUser.company.id);
            if (client_id) {
                q = q.where("client_id", "=", client_id);
            }
            if (project_id) {
                q = q.where("project_id", "=", project_id);
            }
            if (site_id) {
                q = q.where("site_id", "=", site_id);
            }
            const querySnapshot = await q.get();//Promise < DocumentReference < T > >
            return querySnapshot.size;
        });
    }

    async onCreateHTMLImpl(template, data, orientation = "portrait") {
        return new Promise((resolve, reject) => {
            ejs.renderFile(template, data, (err, data) => {
                if (err) {
//                    console.log('err.message1', err.message)
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    async onCreatePDFImpl(template, data, orientation = "portrait") {
        return new Promise((resolve, reject) => {
            ejs.renderFile(template, data, (err, data) => {
                if (err) {
//                    console.log('err.message1', err.message)
                    reject(new functions.https.HttpsError('unknown', err.message, err));
                } else {
                    const options = {
                        "format": 'A4',
                        "orientation": orientation
                    };
                    pdf.create(data, options).toStream((err, stream) => {
                        if (err) {
//                            console.log('err.message2', err.message)
                            reject(new functions.https.HttpsError('unknown', err.message, err));
                        } else {
                            const chunks = [];
                            stream.on('data', chunk => {
                                chunks.push(chunk);
                            });
                            stream.on('end', () => {
                                const result = Buffer.concat(chunks);
                                resolve(result.toString('base64'));
                            });
                        }
                    });
                }
            });
        });
    }

}

exports.ACntr = ACntr;