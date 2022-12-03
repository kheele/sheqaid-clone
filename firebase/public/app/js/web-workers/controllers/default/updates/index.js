
(function() {
    class Controller extends AControllerRead {
        //fname, lname, email, message
        constructor(events, db) {
            super(events, db, {singular: "Update", plural: "Updates"}, "updates/", "default_updates_desktop");
            
            this.check = this.check.bind(this);
            const {addAction, check} = this;
            addAction("check", check);
        }

        async check(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
//                const {name, user_type} = search_val;
//                const q = [
//                    [
//                        {key: 'fname', comp: 'LIKE', val: name},
//                        {key: 'lname', comp: 'LIKE', val: name}
//                    ],
//                    {key: 'user_type', comp: '=', val: user_type}
//                ];
//                return this.filter_impl(evt, q);
            });
        }
    }
    
    new Controller(events, db);
})();