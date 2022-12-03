
(function() {
    class Controller extends AController {
        //fname, lname, email, message
        constructor(events, db) {
            super(events, db, {singular: "Error Reporting", plural: "Error Reporting"}, "error-reporting/", "default_error_reporting");
        }

        async create(evt, data) {
            const doc_ref = await db.collection(this.tbl).add(data);//Promise < DocumentReference < T > >
            let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
            
            const {message, stack, error_info} = data;
            
            const d = new Date();
            
            const opts = {
                from: '"SHEQ Assist - Support" <support@sheqsolve.com>',
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
            
            const mailRes = await EmailUtils.send(opts);
            console.log('mailRes', mailRes)
            return true;
        }
    }
    
    new Controller(events, db);
})();