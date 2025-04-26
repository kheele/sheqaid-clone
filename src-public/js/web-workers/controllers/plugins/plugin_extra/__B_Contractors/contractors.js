//const update = require('./update');
(() => {
    class Controller extends AControllerRead {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events) {
            super(events, {
                singular: "Contractor",
                plural: "Contractors"
            }, "plugin_sheq_assist/contractors/", "plugin_sheq_assist_contractors");

            const {addAction} = this;
            addAction("active/login", this.active_login.bind(this));
            addAction("active/logout", this.active_logout.bind(this));
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="active_login">
        async active_login(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                loggedUser.contractor_id = id;

                return true;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="active_logout">
        async active_logout(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                delete loggedUser.contractor_id;

                return true;
            });
        }

        // </editor-fold>

    }

    new Controller(events);
})();