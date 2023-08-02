import AStore from "../AStore";
import listAllUserByLoggedSite from "./listAllUserByLoggedSite";
import listAllUserByLoggedProject from "./listAllUserByLoggedProject";
import listAllUserByLoggedClient from "./listAllUserByLoggedClient";
import listAllUserByLoggedCompany from "./listAllUserByLoggedCompany";

class Store extends AStore{

    async listAllByLogged() {
        return super.listAllByLogged(
            {
                byLoggedSite: listAllUserByLoggedSite,
                byLoggedProject: listAllUserByLoggedProject,
                byLoggedClient: listAllUserByLoggedClient,
                byLoggedCompany: listAllUserByLoggedCompany,
            }
        );
    }
}

const userStore = new Store();
export default userStore;