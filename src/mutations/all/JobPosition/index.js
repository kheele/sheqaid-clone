import AStore from "../AStore";
import listAllJobPositionByLoggedClient from "./listAllJobPositionByLoggedClient";
import listAllJobPositionByLoggedCompany from "./listAllJobPositionByLoggedCompany";
import listForSelectionJobPositionByLoggedClient from "./listForSelectionJobPositionByLoggedClient";
import listForSelectionJobPositionByLoggedCompany from "./listForSelectionJobPositionByLoggedCompany";

class Store extends AStore{

    async listAllByLogged() {
        return super.listAllByLogged(
            {
                byLoggedClient: listAllJobPositionByLoggedClient,
                byLoggedCompany: listAllJobPositionByLoggedCompany,
            }
        );
    }

    async listForSelectionByLogged() {
        return super.listForSelectionByLogged(
            {
                listForSelectionByLoggedClient: listForSelectionJobPositionByLoggedClient,
                listForSelectionByLoggedCompany: listForSelectionJobPositionByLoggedCompany,
            }
        );
    }

}

const jobPositionStore = new Store();
export default jobPositionStore;