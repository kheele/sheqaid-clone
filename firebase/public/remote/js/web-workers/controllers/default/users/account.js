

(function () {
    class Controller extends AController {

        constructor(events, db) {
            super(events, db, {singular: "Administrator / User", plural: "Administrators / Users"}, "users/accounts/");

            const {addAction} = this;
            addAction("login", this.login.bind(this));
            addAction("logout", this.logout.bind(this));
        }

        async login(evt, data) {
            const {username, password} = data;
            const res = await auth.signInWithEmailAndPassword(username, password).then(async userCredential => {//{user}
                return true;
            }).catch(err => {
                console.error('login', err)
                if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/network-request-failed") {
                    return null;
                } else if (err.code === "auth/too-many-requests") {
                    return err.code;
                } else {//"Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later."
                    throw err;
                }
            });
//            console.log('login', res)
            return res;
        }

        async logout(evt) {
            return db.whenLoggedIn(loggedUser => {
                return auth.signOut().then(() => true);
            });
        }
    }

    const userCntr = new Controller(events, db);

    auth.onAuthStateChanged(userCredential => {
        console.log('userCredential', userCredential);
        if (userCredential) {
            const {uid, email} = userCredential;
            db.session.loginUser({uid, email});
            self.emit(userCntr.root + 'login', {uid, email});
        } else if (db.session.isLoggedIn()) {
            db.session.logout();
            self.emit(userCntr.root + 'logout', !db.session.isLoggedIn());
        } else {
            self.emit(userCntr.root + 'login');
        }
    });
})();