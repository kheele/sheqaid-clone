
(function () {
    class Controller extends AControllerRead {
        //fname, lname, email, message
        constructor(events, db) {
            super(events, db, {singular: "Feedback", plural: "Feedbacks"}, "admin/feedback/", "admin_feedback");
        }

        getDB() {
            return db2;
        }

        async create(evt, data) {
            const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
            let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
            const opts = {
                from: '"SHEQ Aid - Feedback" <no-reply@sheqsolve.com>',
                to: "support@sheqsolve.com",
                subject: 'Feedback',
                html: '<h3><b>Message Details</b></h3>\n\
                <p>From: ' + data.fname + ' ' + data.lname + '</p>\n\
                <p>Email: ' + data.email + '</p>\n\
                <p>' + data.message + '</p>'
            };
            await Utils.sendEmail(opts);
            return true;
        }
    }

    new Controller(events, db);
})();