
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

    loginUser(value) {
        this.set("logged_user", value);//user, company
        Utils.onLogin();
    }

    logout() {
        delete this.data["logged_user"];//user, company
        Utils.onLogout();
    }

    getLoggedUser() {
        return this.data["logged_user"];//user, company
    }

    isLoggedIn() {
        return this.has("logged_user");
    }
}

self.session = new Session();