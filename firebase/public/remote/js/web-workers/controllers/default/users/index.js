//importScripts(self.locationRoot + "/js/web-workers/controllers/default/users/account.js");
//importScripts(self.locationRoot + "/js/web-workers/controllers/default/users/update.js");

(function() {
    class Controller extends AController {
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events, db) {
            super(events, db, {singular: "Administrator / User", plural: "Administrators / Users"}, "users/", "default_users");

            this.send_app_link = this.send_app_link.bind(this);
            this.filter = this.filter.bind(this);
            this.search_by_name = this.search_by_name.bind(this);
            
            const {addAction, send_app_link, filter, search_by_name} = this;
            
            addAction("send-app-link", send_app_link);
            addAction("list/filter", filter);
            addAction("list/search_by_name", search_by_name);
        }

        async send_app_link(evt, id) {
            return db.whenLoggedIn(async loggedUser => {
                const item = await this.find_by_id(evt, id);
                if (item) {
                    const {id, data: {password, username, fname, lname}} = item;
                    if (username) {
                        const opts = {
                            from: '"SHEQ Assist" <support@sheqsolve.com>',
                            to: username,
                            subject: 'SHEQ Assist Application Link',
                            html: '<h3><b>Dear ' + fname + ' ' + lname + '</b></h3>\n\
                                <p>If you have not yet used SHEQ Assist Application, please use the link below to download the application.</p>\n\
                                <p>Your SHEQ Assist Username is <b>' + username + '</b>, Password is <b>' + password + '</b></p>\n\
                                <p>You are strongly adviced to change your password as soon as you login in to SHEQ Assist account</p>\n\
                                <p>Please click <a href="https://storage.googleapis.com/trading-ls.appspot.com/app/sheqassist-covid-1.0.0.exe">here</a> to download the application and use the above username and password to login.</p>\n\
                                <p>Yours Sincerely<br/>SHEQ Assist</p>'
                        };
                        const mailRes = await EmailUtils.send(opts);
                        console.log('mailRes', mailRes)
                        
                        return true;
                    }
                    return "NO_EMAIL";
                }

                return "NOT_FOUND";
            });
        }

        async search_by_name(evt, name) {
            return await this.filter(evt, {name});
        }

        async filter(evt, search_val) {
            return db.whenLoggedIn(async loggedUser => {
                const {name, user_type} = search_val;
                const q = [
                    [
                        {key: 'fname', comp: 'LIKE', val: name},
                        {key: 'lname', comp: 'LIKE', val: name}
                    ],
                    {key: 'user_type', comp: '=', val: user_type}
                ];
                return this.filter_impl(evt, q);
            });
        }

        sortBy(list) {
            list.sortBy("data.lname");
        }
    }
    
    new Controller(events, db);
})();