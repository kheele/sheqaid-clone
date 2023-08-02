import AStore from "../AStore";
import listAllPPEByLoggedSite from "./listAllPPEByLoggedSite";
import listAllPPEByLoggedProject from "./listAllPPEByLoggedProject";
import listAllPPEByLoggedClient from "./listAllPPEByLoggedClient";
import listAllPPEByLoggedCompany from "./listAllPPEByLoggedCompany";
import listAllPPEByDepartment from "./listAllPPEByDepartment";
import listAllPPEByJobPosition from "./listAllPPEByJobPosition";
import listAllPPEByTeam from "./listAllPPEByTeam";

class Store extends AStore{

    async listAllByLogged() {
        return super.listAllByLogged(
            {
                byLoggedSite: listAllPPEByLoggedSite,
                byLoggedProject: listAllPPEByLoggedProject,
                byLoggedClient: listAllPPEByLoggedClient,
                byLoggedCompany: listAllPPEByLoggedCompany,
            }
        );
    }

    async listAllByDepartment(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllPPEByDepartment(id);
    }

    async listAllByJobPosition(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllPPEByJobPosition(id);
    }

    async listAllByTeam(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllPPEByTeam(id);
    }

}

const ppeStore = new Store();
export default ppeStore;