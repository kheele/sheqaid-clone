import {is, list} from './';

class Logout {

    async logoutOrg(data) {
        const {currentUser} = this.storage.login.currAuth;
        return currentUser.getIdToken(true).then(idToken => {
            const logout = sockets.of('orgs').fn('logout');
            return logout({data, idToken}).then(res => {
                if (res === "RETRY") {
                    return this.logoutOrg(data);
                }

                return this.storage.updateSessionByIdToken();
            });
        }).catch(err => {
            console.error(err)
        });
    }

    async logoutClient() {
        return this.logoutOrg({
            selected_client_id: null,
            selected_project_id: null,
            selected_site_id: null,
        }).then(res => {
            this.storage.attrs.delete("loggedClient");
        });
    }

    async logoutProject() {
        return this.logoutOrg({
            selected_project_id: null,
            selected_site_id: null,
        }).then(res => {
            this.storage.attrs.delete("loggedProject");
        });
    }

    async logoutSite() {
        return this.logoutOrg({selected_site_id: null}).then(res => {
            this.storage.attrs.delete("loggedSite");
        });
    }

    async logoutContractor() {
        return this.logoutOrg({
            logged_contractor_id: null,
            selected_contractor_client_id: null,
            selected_contractor_site_id: null,
        }).then(res => {
            this.storage.attrs.delete("contractor");
        });
    }

    async logoutContractorClient() {
        return this.logoutOrg({
            selected_contractor_client_id: null,
            selected_contractor_site_id: null,
        }).then(res => {
            this.storage.attrs.delete("loggedContractorClient");
        });
    }

    async logoutContractorSite() {
        return this.logoutOrg({selected_contractor_site_id: null}).then(res => {
            this.storage.attrs.delete("loggedContractorSite");
        });
    }

    async logoutUser() {
        // await indexedStorage.loggedUser.clear();

        const countries = list.countries;
        const permissionOtherKeys = list.permissionOtherKeys;

        this.storage.attrs.clear();

        this.storage.attrs.set("countries", countries);
        this.storage.attrs.set("permissionOtherKeys", permissionOtherKeys);
        this.storage.loggedUserAuthChecked = true;
    }

    async signOutAndConfirm() {
        confirmDialog.open("Are you sure you want to logout?").then(res => {
            if (res === 1) {
                return this.signOut();
            }
        });
    }

    async signOutOnlyAuth() {
        const {isEmployee, isUser, isContractorAuth} = is;

        let currAuth;
        if (isContractorAuth) {
            currAuth = auth2;
        } else {
            currAuth = auth;
        }

        return currAuth.signOut();
    }

    async signOut() {
        const {isEmployee, isUser, isContractorAuth} = is;
        let path;
        if (isContractorAuth) {
            path = "plugin_sheq_assist/contractors/users/";
        } else if (isEmployee) {
            path = "plugin_sheq_assist/employees/accounts/";
        } else if (isUser) {
            path = "users/accounts/";
        }

        return this.signOutOnlyAuth().then(() => {
            neonBinding.events.emit(path + "logout").then(res => {
                console.log("res", res)
                if (res) {
                    infoDialog.open("You have successfully logged out.");
                    this.logoutUser();
                    setTimeout(() => {
                        infoDialog.close();
                    }, 2000);
                } else {
                    infoDialog.open("An error occurred. Please try again.");
                }
            }).catch(e => {
                console.error(e)
                infoDialog.open("An error occurred. Please try again.");
            });
        });
    }

}

const logout = new Logout();
export default logout;
