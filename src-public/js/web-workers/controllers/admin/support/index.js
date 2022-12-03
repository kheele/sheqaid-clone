
(function () {
    class Controller extends AControllerRead {
        //fname, lname, email, message
        constructor(events, db) {
            super(events, db, {singular: "Support", plural: "Support"}, "admin/support/", "admin_support");
        }

        getDB() {
            return db2;
        }

        async create(evt, data) {
            const doc_ref = await db2.collection(this.tbl).add(data);//Promise < DocumentReference < T > >
            let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
            const {fname, lname, email, message} = data;
            const opts = {
                from: '"SHEQ Aid - Support" <support@sheqsolve.com>',
                to: "support@sheqsolve.com",
                subject: 'Support',
                html: '<h3><b>Message Details</b></h3>\n\
                <p>From: ' + fname + ' ' + lname + '</p>\n\
                <p>Email: ' + email + '</p>\n\
                <p>' + message + '</p>'
            };
            const sendEmail = functions.httpsCallable('callables-sendEmail');
            const mailRes = await sendEmail(opts);
            console.log('mailRes', mailRes)
            return true;
        }
    }

    new Controller(events, db);
})();