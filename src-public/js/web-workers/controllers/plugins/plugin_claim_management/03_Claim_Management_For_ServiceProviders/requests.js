
(function () {
    class Controller extends AControllerRead {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events, db) {
            super(events, db,
                    {singular: "COID Service Provider Request", plural: "COID Service Providers Requests"},
                    "plugin_sheq_assist/COIDA_Management/coid-provider/companies/requests/",
                    "plugin_sheq_assist_coida_claims_coid_provider_requests");

            const {addAction} = this;
//            addAction("list/filter", this.filter.bind(this));
            addAction("accept", this.accept.bind(this));
            addAction("decline", this.decline.bind(this));
            addAction("remove", this.remove.bind(this));

            this.setQueryWhere(company_id => {
                return ['ALL'];
            });
        }
        // </editor-fold>

        getDB() {
            return db2;
        }

        // <editor-fold defaultstate="collapsed" desc="accept">
        async accept(evt, sender_company_id) {
            return Events.whenLoggedIn(async loggedUser => {
                const cntr = await Events.get('plugin_sheq_assist/COIDA_Management/coid-provider/companies/');
                const res = await cntr.find_by_id.call(cntr, null, sender_company_id);
                if (!res) {
                    return 'NOT_FOUND';
                }

                let {
                    company: {id: receipient_coid_provider_id, data: {consultant, name: receipient_name}},
                    client_id, project_id, site_id
                } = loggedUser;

                receipient_coid_provider_id = client_id || receipient_coid_provider_id;

                const query_ref = await this.getDB().collection(this.tbl).
                        where('sender_company_id', '==', sender_company_id).
                        where('receipient_coid_provider_id', '==', receipient_coid_provider_id).limit(1);//Promise < DocumentReference < T > >
                const querySnapshot = await query_ref.get();
                if (querySnapshot.empty) {
                    return 'NOT_FOUND_REQUEST';
                }

                const doc = querySnapshot.docs[0];

                const savedItem = await this.update(evt, doc.id, {status: 'Accepted'});
                if (!savedItem) {
                    return 'UPDATE_ERROR';
                }

                await sendEmail(
                        loggedUser,
                        sender_company_id,
                        'Claim Management (Request Accepted)',
                        `<p>The request that was sent from your company (__), to ${receipient_name}, has been accepted.</p>\n`
                        );

                return true;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="decline">
        async decline(evt, sender_company_id) {
            return Events.whenLoggedIn(async loggedUser => {
                const cntr = await Events.get('plugin_sheq_assist/COIDA_Management/coid-provider/companies/');
                const res = await cntr.find_by_id.call(cntr, null, sender_company_id);
                if (!res) {
                    return 'NOT_FOUND';
                }

                let {
                    company: {id: receipient_coid_provider_id, data: {consultant, name: receipient_name}},
                    client_id, project_id, site_id
                } = loggedUser;

                receipient_coid_provider_id = client_id || receipient_coid_provider_id;

                const query_ref = await this.getDB().collection(this.tbl).
                        where('sender_company_id', '==', sender_company_id).
                        where('receipient_coid_provider_id', '==', receipient_coid_provider_id).limit(1);//Promise < DocumentReference < T > >
                const querySnapshot = await query_ref.get();
                if (querySnapshot.empty) {
                    return 'NOT_FOUND_REQUEST';
                }

                const doc = querySnapshot.docs[0];

                const savedItem = await this.update(evt, doc.id, {status: 'Declined'});
                if (!savedItem) {
                    return 'UPDATE_ERROR';
                }

                await sendEmail(
                        loggedUser,
                        sender_company_id,
                        'Claim Management (Request Declined)',
                        `<p>The request that was sent from your company (__), to ${receipient_name}, has been declined.</p>\n`
                        );

                return true;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="remove">
        async remove(evt, sender_company_id) {
            return Events.whenLoggedIn(async loggedUser => {
                const cntr = await Events.get('plugin_sheq_assist/COIDA_Management/coid-provider/companies/');
                const res = await cntr.find_by_id.call(cntr, null, sender_company_id);
                if (!res) {
                    return 'NOT_FOUND';
                }

                let {
                    company: {id: receipient_coid_provider_id, data: {consultant, name: receipient_name}},
                    client_id, project_id, site_id
                } = loggedUser;

                receipient_coid_provider_id = client_id || receipient_coid_provider_id;

                const query_ref = await this.getDB().collection(this.tbl).
                        where('sender_company_id', '==', sender_company_id).
                        where('receipient_coid_provider_id', '==', receipient_coid_provider_id).limit(1);//Promise < DocumentReference < T > >
                const querySnapshot = await query_ref.get();
                if (querySnapshot.empty) {
                    return 'NOT_FOUND_REQUEST';
                }

                const doc = querySnapshot.docs[0];

                const {status} = doc.data();
                if (status === 'ReceipientRemoved') {
                    return 'ALREADY_REMOVED';
                }

                const savedItem = await this.update(evt, doc.id, {status: 'ReceipientRemoved'});
                if (!savedItem) {
                    return 'UPDATE_ERROR';
                }

                await sendEmail(
                        loggedUser,
                        sender_company_id,
                        'Claim Management (Your Account Removed)',
                        `<p>Your company (__), will no longer be able to send claims to ${receipient_name}. ${receipient_name} has removed your company (__) from its claim management.</p>\n`
                        );

                return true;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="find_by_sender_company_id_approved">
        async find_by_sender_company_id_approved(evt, sender_company_id) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: 1}, q => {
                    q = q.where('sender_company_id', '==', sender_company_id);
                    q = q.where('status', '==', 'Accepted');
                    return q;
                });

                console.log('find_by_sender_company_id_approved', sender_company_id, list);
                return list[0];
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}, filter) {
            return Events.whenLoggedIn(async loggedUser => {
                let {
                    company: {id: receipient_coid_provider_id, data: {consultant}},
                    client_id, project_id, site_id
                } = loggedUser;

                receipient_coid_provider_id = client_id || receipient_coid_provider_id;

                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, q => {
                    q = q.where('receipient_coid_provider_id', '==', receipient_coid_provider_id);
                    filter && (q = filter(q));
                    return q;
                });

                console.log('list receipient_coid_provider_id', receipient_coid_provider_id, list);
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
            sender_company_id,
            subject, msg) {

        let {
            company: {id: receipient_coid_provider_id, data: {consultant, name: receipient_name}},
            client_id, project_id, site_id
        } = loggedUser;

        receipient_coid_provider_id = client_id || receipient_coid_provider_id;

        const getUsers = async (receive_claim_notifs = true) => {
            let qUsers = db.collection('default_users');
            qUsers = qUsers.where('company_id', '==', sender_company_id);
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
                from: '"SHEQ Aid" <support@sheqsolve.com>',
                bcc: emails.join(','),
                subject,
                html: `<h3><b>Dear SHEQ Aid User</b></h3>\n
                    <p>SHEQ Aid would like to notify you of the following:</p>\n
                    ${msg}\n
                    <p>Kind Regards<br/>SHEQ Aid</p>`
            };

            console.log('email to send', opts)
//                            const sendEmail = functions.httpsCallable('callables-sendEmail');
//                            const mailRes = await sendEmail(opts);
//                            console.log('mailRes', mailRes)
        }
    }
    // </editor-fold>

    new Controller(events, db);

})();