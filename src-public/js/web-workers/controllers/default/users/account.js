(function () {
    class Controller extends AAccountsCntr {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events) {
            super(events, {singular: "Administrator / User", plural: "Administrators / Users"}, "users/accounts/");

            this.tbl = 'default_users';

            const {addAction} = this;
            addAction("relogin/customToken", this.reloginWithCustomToken.bind(this));
            addAction("relogin/username", this.reloginWithUsername.bind(this));
        }

        // </editor-fold>

        get isUser() {
            return true;
        }

        get access_type() {
            return 'User';
        }

        get auth() {
            return auth;
        }

        get functions() {
            return functions;
        }

        // <editor-fold defaultstate="collapsed" desc="reloginWithCustomToken">
        async reloginWithCustomToken(evt, customToken) {
            const userCredential = await this.auth.signInWithCustomToken(customToken);
            if (!userCredential) return;

            const loggedUser = await this.onSetCustomUserClaims(userCredential.user);
            return this.loginImpl(loggedUser);
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="reloginWithUsername">
        async reloginWithUsername(evt, {username, password}) {
            const userCredential = await this.auth.signInWithEmailAndPassword(username, password);
            if (!userCredential) return;

            const loggedUser = await this.onSetCustomUserClaims(userCredential.user);
            return this.loginImpl(loggedUser);
        }

        // </editor-fold>

    }

    new Controller(events);
})();//585