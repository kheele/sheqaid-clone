
(function () {
    class Controller extends AControllerRead {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events) {
            super(events,
                    {singular: "COID Service Provider Request", plural: "COID Service Providers Requests"},
                    "plugin_sheq_assist/COIDA_Management/companies/coid-provider/requests/",
                    "plugin_sheq_assist_coida_claims_coid_provider_requests");

            const {addAction} = this;
//            addAction("list/filter", this.filter.bind(this));
            addAction("send", this.send.bind(this));
            addAction("cancel", this.cancel.bind(this));
            addAction("remove", this.remove.bind(this));

            this.setQueryWhere(company_id => {
                return [['company_id', '==', company_id]];
            });
        }
        // </editor-fold>

        getDB() {
            return db2;
        }

        // <editor-fold defaultstate="collapsed" desc="send">
        async send(evt, receipient_coid_provider_id) {
            return Events.whenLoggedIn(async loggedUser => {
                const cntr = await Events.get('plugin_sheq_assist/COIDA_Management/companies/coid-provider/');
                const res = await cntr.find_by_id.call(cntr, null, receipient_coid_provider_id);
                if (!res) {
                    return 'NOT_FOUND';
                }

                let {
                    company: {id: sender_company_id, data: {consultant, name: sender_name}},
                    client_id, project_id, site_id
                } = loggedUser;

                sender_company_id = client_id || sender_company_id;

                const query_ref = await this.getDB().collection(this.tbl).
                        where('sender_company_id', '==', sender_company_id).
                        where('receipient_coid_provider_id', '==', receipient_coid_provider_id).limit(1);//Promise < DocumentReference < T > >
                const querySnapshot = await query_ref.get();
                if (!querySnapshot.empty) {
                    return 'ALREADY_SENT';
                }

                const savedItem = await this.create(evt, {sender_company_id, receipient_coid_provider_id, status: 'New'});
                if (!savedItem) {
                    return 'UPDATE_ERROR';
                }

                await sendEmail(
                        loggedUser,
                        receipient_coid_provider_id,
                        'ClaimsClient Management (New Request)',
                        `<p>Your company (__), has received the request from ${sender_name} to manage your company's (__) claims.</p>\n`
                        );

                return savedItem;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="cancel">
        async cancel(evt, receipient_coid_provider_id) {
            return Events.whenLoggedIn(async loggedUser => {
                const cntr = await Events.get('plugin_sheq_assist/COIDA_Management/companies/coid-provider/');
                const res = await cntr.find_by_id.call(cntr, null, receipient_coid_provider_id);
                if (!res) {
                    return 'NOT_FOUND';
                }

                let {
                    company: {id: sender_company_id, data: {consultant, name: sender_name}},
                    client_id, project_id, site_id
                } = loggedUser;

                sender_company_id = client_id || sender_company_id;

                const query_ref = await this.getDB().collection(this.tbl).
                        where('sender_company_id', '==', sender_company_id).
                        where('receipient_coid_provider_id', '==', receipient_coid_provider_id).limit(1);//Promise < DocumentReference < T > >
                const querySnapshot = await query_ref.get();
                if (querySnapshot.empty) {
                    return 'NOT_FOUND_REQUEST';
                }

                const doc = querySnapshot.docs[0];

                const savedItem = await this.update(evt, doc.id, {status: 'Cancelled'});
                if (!savedItem) {
                    return 'UPDATE_ERROR';
                }

                await sendEmail(
                        loggedUser,
                        receipient_coid_provider_id,
                        'ClaimsClient Management (Request Cancelled)',
                        `<p>The request that was sent to your company (__), from ${sender_name}, for claim management has been cancelled.</p>\n`
                        );

                return true;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="remove">
        async remove(evt, receipient_coid_provider_id) {
            return Events.whenLoggedIn(async loggedUser => {
                const cntr = await Events.get('plugin_sheq_assist/COIDA_Management/companies/coid-provider/');
                const res = await cntr.find_by_id.call(cntr, null, receipient_coid_provider_id);
                if (!res) {
                    return 'NOT_FOUND';
                }

                let {
                    company: {id: sender_company_id, data: {consultant, name: sender_name}},
                    client_id, project_id, site_id
                } = loggedUser;

                sender_company_id = client_id || sender_company_id;

                const query_ref = await this.getDB().collection(this.tbl).
                        where('sender_company_id', '==', sender_company_id).
                        where('receipient_coid_provider_id', '==', receipient_coid_provider_id).limit(1);//Promise < DocumentReference < T > >
                const querySnapshot = await query_ref.get();
                if (querySnapshot.empty) {
                    return 'NOT_FOUND_REQUEST';
                }

                const doc = querySnapshot.docs[0];

                const {status} = doc.data();
                if (status === 'SenderRemoved') {
                    return 'ALREADY_REMOVED';
                }

                const savedItem = await this.update(evt, doc.id, {status: 'SenderRemoved'});
                if (!savedItem) {
                    return 'UPDATE_ERROR';
                }

                await sendEmail(
                        loggedUser,
                        receipient_coid_provider_id,
                        'ClaimsClient Management (Your Account Removed)',
                        `<p>Your company (__), will no longer have access to manage ${sender_name} claims. ${sender_name} has removed your company (__) from its claim management.</p>\n`
                        );

                return true;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="find_by_receipient_coid_provider_id">
        async find_by_receipient_coid_provider_id(evt, receipient_coid_provider_id) {
            return Events.whenLoggedIn(async loggedUser => {
                let {
                    company: {id: sender_company_id, data: {consultant}},
                    client_id, project_id, site_id
                } = loggedUser;

                sender_company_id = client_id || sender_company_id;

                let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: 1}, q => {
                    q = q.where('sender_company_id', '==', sender_company_id);
                    q = q.where('receipient_coid_provider_id', '==', receipient_coid_provider_id);
//                    q = q.where('status', 'in', ['New', 'Accepted', 'Cancelled', 'SenderRemoved']);
                    return q;
                });

                console.log('find_by_receipient_coid_provider_id', sender_company_id, receipient_coid_provider_id, list);
                return list[0];
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}, filter) {
            return Events.whenLoggedIn(async loggedUser => {
                let {
                    company: {id: sender_company_id, data: {consultant}},
                    client_id, project_id, site_id
                } = loggedUser;

                sender_company_id = client_id || sender_company_id;

                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, q => {
                    q = q.where('sender_company_id', '==', sender_company_id);
                    filter && (q = filter(q));
                    return q;
                });

                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
//        async filter(evt, search_val) {
//            return Events.whenLoggedIn(async loggedUser => {
//                const {name} = search_val;
//                const q = [
//                    {key: 'name', comp: 'LIKE', val: name}
//                ];
//                return this.filter_impl(evt, q);
//            });
//        }
        // </editor-fold>

        sortBy() {
            return "created_at";
        }
    }

    // <editor-fold defaultstate="collapsed" desc="sendEmail">
    async function sendEmail(
            loggedUser,
            receipient_coid_provider_id,
            subject, msg) {

        let {
            company: {id: sender_company_id, data: {consultant, name: sender_name}},
            client_id, project_id, site_id
        } = loggedUser;

        sender_company_id = client_id || sender_company_id;

        const getUsers = async (receive_claim_notifs = true) => {
            let qUsers = db.collection('default_users');
            qUsers = qUsers.where('company_id', '==', receipient_coid_provider_id);
            if (receive_claim_notifs) {
                qUsers = qUsers.where('receive_claim_notifs', '==', true);
            }

            if (company_id !== client_id) {//is client
                qUsers = qUsers.where('client_id', '==', client_id);
            }

            const snapshot_users = await qUsers.get();
            return snapshot_users;
        };
        let snapshot_users = await getUsers();
        if (snapshot_users.empty) {
            snapshot_users = await getUsers(false);
        }
        const emails = snapshot_users.docs.map(doc => doc.data().username);

        if (!emails.isEmpty()) {
            const opts = {
                from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
                bcc: emails.join(','),
                subject,
                html: `<h3><b>Dear SHEQ Aid User</b></h3>\n
                    <p>SHEQ Aid would like to notify you of the following:</p>\n
                    ${msg}\n
                    <p>Kind Regards<br/>SHEQ Aid</p>`
            };

            await Utils.sendEmail(opts);
        }
    }
    // </editor-fold>

    new Controller(events);

})();
