import AStore from "../AStore";
import listAllJobCategoryByLoggedClient from "./listAllJobCategoryByLoggedClient";
import listAllJobCategoryByLoggedCompany from "./listAllJobCategoryByLoggedCompany";
import listForSelectionJobCategoryByLoggedClient from "./listForSelectionJobCategoryByLoggedClient";
import listForSelectionJobCategoryByLoggedCompany from "./listForSelectionJobCategoryByLoggedCompany";

class Store extends AStore{

    async listAllByLogged() {
        return super.listAllByLogged(
            {
                byLoggedClient: listAllJobCategoryByLoggedClient,
                byLoggedCompany: listAllJobCategoryByLoggedCompany,
            }
        );
    }

    async listForSelectionByLogged() {
        return super.listForSelectionByLogged(
            {
                listForSelectionByLoggedClient: listForSelectionJobCategoryByLoggedClient,
                listForSelectionByLoggedCompany: listForSelectionJobCategoryByLoggedCompany,
            }
        );
    }

}

const jobCategoryStore = new Store();
export default jobCategoryStore;