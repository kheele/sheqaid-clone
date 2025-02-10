import AStore from "../AStore";
import listForSelectionNCRByLoggedSite from "./listForSelectionNCRByLoggedSite";
import listForSelectionNCRByLoggedProject from "./listForSelectionNCRByLoggedProject";
import listForSelectionNCRByLoggedClient from "./listForSelectionNCRByLoggedClient";
import listForSelectionNCRByLoggedCompany from "./listForSelectionNCRByLoggedCompany";
import listAllNCRByLoggedSite from "./listAllNCRByLoggedSite";
import listAllNCRByLoggedProject from "./listAllNCRByLoggedProject";
import listAllNCRByLoggedClient from "./listAllNCRByLoggedClient";
import listAllNCRByLoggedCompany from "./listAllNCRByLoggedCompany";

class Store extends AStore{

    async listAllByLogged() {
        return super.listAllByLogged(
            {
                byLoggedSite: listAllNCRByLoggedSite,
                byLoggedProject: listAllNCRByLoggedProject,
                byLoggedClient: listAllNCRByLoggedClient,
                byLoggedCompany: listAllNCRByLoggedCompany,
            }
        );
    }

    async listForSelectionByLogged() {
        return super.listForSelectionByLogged(
            {
                listForSelectionByLoggedSite: listForSelectionNCRByLoggedSite,
                listForSelectionByLoggedProject: listForSelectionNCRByLoggedProject,
                listForSelectionByLoggedClient: listForSelectionNCRByLoggedClient,
                listForSelectionByLoggedCompany: listForSelectionNCRByLoggedCompany,
            }
        );
    }

}

const NCRStore = new Store();
export default NCRStore;