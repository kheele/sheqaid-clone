
(function () {
    class Controller extends AControllerRead {
        //fname, lname, email, message
        constructor(events, db) {
            super(events, db, {singular: "Error Reporting", plural: "Error Reporting"}, "error-reporting/", "default_error_reporting");
        }

        async create(evt, data) {
            const doc_ref = await db2.collection(this.tbl).add(data);//Promise < DocumentReference < T > >
            let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

            const {
                message, stack, error_info, 
                company, client, project, site, contractor, loggedContractor, 
                selectedClient, selectedProject, selectedSite, selectedContractorSite,
                user = {}
            } = data;
            
            const getName = v => {
                if(!v) {
                    return 'N/A';
                }
                const {id, data: __data = {}, name} = v;
                return __data.name || name;
            };
            
            const {data: user_data = {}} = user;
            
            const {fname, lname, username, email} = user_data;

            const d = new Date();

            const opts = {
                from: '"SHEQ Aid - Support" <support@sheqsolve.com>',
                to: "support@sheqsolve.com",
                subject: 'Error Reporting',
                html: '<h3>System Error</h3>\n\
                <p><b>------Loaction Details------</b></p>\n\
                <p>Company: ' + getName(company) + '</p>\n\
                <p>Client: ' + getName(client) + '</p>\n\
                <p>Project: ' + getName(project) + '</p>\n\
                <p>Site: ' + getName(site) + '</p>\n\
                <p>Contractor: ' + getName(contractor) + '</p>\n\
                <p><b>------------</b></p>\n\
                <p>Logged Contractor: ' + getName(loggedContractor) + '</p>\n\
                <p>Selected Client: ' + getName(selectedClient) + '</p>\n\
                <p>Selected Project: ' + getName(selectedProject) + '</p>\n\
                <p>Selected Site: ' + getName(selectedSite) + '</p>\n\
                <p>Selected Contractor Site: ' + getName(selectedContractorSite) + '</p>\n\
                <p><b>------User Details------</b></p>\n\
                <p>User:<br/>First Name: ' + (fname || 'N/A') + ',<br/>Last Name: ' + (lname || 'N/A') + ',<br/>Username: ' + (username || 'N/A') + ',<br/>Email Address: ' + (email || 'N/A') + '</p>\n\
                <p><b>------Date & Time Details------</b></p>\n\
                <p>Date & Time: ' + d + '</p>\n\
                <p><b>------Message Details------</b></p>\n\
                <p>' + message + '</p>\n\
                <p><b>------Error Stack Details------</b></p>\n\
                <p>' + stack + '</p>\n\
                <p><b>------Error Info Details------</b></p>\n\
                <p>' + error_info + '</p>'
            };

            const sendEmail = functions.httpsCallable('callables-sendEmail');
            const mailRes = await sendEmail(opts);
            console.log('mailRes', mailRes)
            return true;
        }
    }

    new Controller(events, db);
})();