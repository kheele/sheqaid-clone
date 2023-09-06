
(function () {
    class Controller extends AControllerRead {
        //fname, lname, email, message
        constructor(events) {
            super(events, {singular: "Error Reporting", plural: "Error Reporting"}, "admin/error-reporting/", "admin_error_reporting");
        }

        getDB() {
            return db2;
        }

        async create(evt, data) {
            const doc_ref = await db2.collection(this.tbl).add(data);//Promise < DocumentReference < T > >
            let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

            const {message, stack, error_info} = data;

            const d = new Date();

            const opts = {
                from: '"SHEQ Aid - Support" <no-reply@sheqsolve.com>',
                to: "support@sheqsolve.com",
                subject: 'Error Reporting',
                html: '<h3>System Error</h3>\n\
                <p>Date & Time: ' + d + '</p>\n\
                <p><b>------Message------</b></p>\n\
                <p>' + message + '</p>\n\
                <p><b>------Error------</b></p>\n\
                <p>' + stack + '</p>\n\
                <p><b>------Error Info------</b></p>\n\
                <p>' + error_info + '</p>'
            };

            await Utils.sendEmail(opts);
            return true;
        }
    }

    new Controller(events);
})();