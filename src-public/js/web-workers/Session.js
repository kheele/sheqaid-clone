
class Session {

    constructor() {
        this.data = {};
    }

    get(key) {
        return this.data[key];
    }

    set(key, value) {
        this.data[key] = value;
    }

    has(key) {
        return !!this.data[key];
    }

    loginUser(value, auth) {
        this.set("logged_user", value);//user, company
        this.set("auth", auth);
        Utils.onLogin();
    }

    logout() {
        delete this.data["logged_user"];//user, company
        delete this.data["auth"];
        Utils.onLogout();
    }

    getLoggedUser() {
        return this.data["logged_user"];//user, company
    }

    get auth() {
        return this.data["auth"];
    }

    get isLoggedIn() {
        if(!this.has("logged_user")) return false;
        if(!this.has("auth")) return false;
        return !!this.auth.currentUser;
    }
}

self.session = new Session();