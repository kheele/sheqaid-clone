(function () {
    class Controller extends AAccountsCntr {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events) {
            super(events, {
                singular: "Contractor Administrator/User",
                plural: "Contractor Administrators/Users"
            }, "plugin_sheq_assist/contractors/users/", "plugin_sheq_assist_contractors_users");

            const {addAction} = this;
            addAction("relogin", this.relogin.bind(this));
        }

        // </editor-fold>

        get isContractorUser() {
            return true;
        }

        get access_type() {
            return 'ContractorUser';
        }

        get auth() {
            return auth2;
        }

    }

    const userCntr = new Controller(events);

    // <editor-fold defaultstate="collapsed" desc="auth2.onAuthStateChanged">
    auth2.onAuthStateChanged((user) => {
        const {selfLogin} = userCntr;
    });
    // </editor-fold>

})();//627
