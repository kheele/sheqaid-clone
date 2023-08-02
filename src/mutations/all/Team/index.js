import AStore from "../AStore";
import listAllTeamByLoggedSite from "./listAllTeamByLoggedSite";
import listAllTeamByLoggedProject from "./listAllTeamByLoggedProject";
import listAllTeamByLoggedClient from "./listAllTeamByLoggedClient";
import listAllTeamByLoggedCompany from "./listAllTeamByLoggedCompany";
import listAllTeamByPPE from "./listAllTeamByPPE";

class Store extends AStore{

    async listAllByLogged() {
        return super.listAllByLogged(
            {
                byLoggedSite: listAllTeamByLoggedSite,
                byLoggedProject: listAllTeamByLoggedProject,
                byLoggedClient: listAllTeamByLoggedClient,
                byLoggedCompany: listAllTeamByLoggedCompany,
            }
        );
    }

    async listAllByPPE(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllTeamByPPE(id);
    }

}

const teamStore = new Store();
export default teamStore;