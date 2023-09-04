import {is, list} from './';

class Logout {

    async logoutClient() {
        // return neonBinding.events.emit("plugin_sheq_assist/clients/logout").then(res => {
        //     res && this.storage.attrs.delete("loggedClient");
            this.storage.attrs.delete("loggedClient");
        // }).catch(e => {
        //     console.log(e)
        // });
    }

    async logoutProject() {
        // return neonBinding.events.emit("plugin_sheq_assist/projects/logout").then(res => {
            // res && this.storage.attrs.delete("loggedProject");
            this.storage.attrs.delete("loggedProject");
        // }).catch(e => {
        //     console.log(e)
        // });
    }

    async logoutSite() {
        // return neonBinding.events.emit("plugin_sheq_assist/sites/logout").then(res => {
        //     res && this.storage.attrs.delete("loggedSite");
            this.storage.attrs.delete("loggedSite");
        // }).catch(e => {
        //     console.log(e)
        // });
    }

    async logoutContractor() {
        await this.logoutContractorClient();
        this.storage.attrs.delete("contractor");

//         return neonBinding.events.emit("plugin_sheq_assist/contractors/active/logout").then(async res => {
// //            console.log("sites/logout", res)
//         }).catch(e => {
//             console.log(e)
//         });
    }

    async logoutContractorClient() {
        await this.logoutContractorSite();
        this.storage.attrs.delete("loggedContractorClient");
    }

    async logoutContractorSite() {
        this.storage.attrs.delete("loggedContractorSite");

//         return neonBinding.events.emit("plugin_sheq_assist/sites/contractor/logout").then(res => {
// //            console.log("sites/logout", res)
//         }).catch(e => {
//             console.log(e)
//         });
    }

    async logoutUser() {
        // await indexedStorage.loggedUser.clear();

        const countries = list.countries;
        const permissionOtherKeys = list.permissionOtherKeys;

        this.storage.attrs.clear();

        this.storage.attrs.set("countries", countries);
        this.storage.attrs.set("permissionOtherKeys", permissionOtherKeys);
    }

    async signOutAndConfirm() {
        confirmDialog.open("Are you sure you want to logout?").then(res => {
            if (res === 1) {
                return this.signOut();
            }
        });
    }

    async signOutOnlyAuth() {
        const {isEmployee, isUser, isContractor} = is;
        
        let currAuth;
        if(isContractor) {
            currAuth = auth2;
        } else {
            currAuth = auth;
        }

        return currAuth.signOut();
    }

    async signOut() {
        const {isEmployee, isUser, isContractor} = is;
        let path;
        if (isAdminApp) {
            path = "admin/users/accounts/";
        } else {
            if (isContractor) {
                path = "plugin_sheq_assist/contractors/users/";
            } else if (isEmployee) {
                path = "plugin_sheq_assist/employees/accounts/";
            } else if (isUser) {
                path = "users/accounts/";
            }
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