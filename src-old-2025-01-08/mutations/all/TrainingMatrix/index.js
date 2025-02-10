import AStore from "../AStore";
import listForSelectionTrainingMatrixByLoggedSite from "./listForSelectionTrainingMatrixByLoggedSite";
import listForSelectionTrainingMatrixByLoggedProject from "./listForSelectionTrainingMatrixByLoggedProject";
import listForSelectionTrainingMatrixByLoggedClient from "./listForSelectionTrainingMatrixByLoggedClient";
import listForSelectionTrainingMatrixByLoggedCompany from "./listForSelectionTrainingMatrixByLoggedCompany";
import listAllTrainingMatrixByLoggedSite from "./listAllTrainingMatrixByLoggedSite";
import listAllTrainingMatrixByLoggedProject from "./listAllTrainingMatrixByLoggedProject";
import listAllTrainingMatrixByLoggedClient from "./listAllTrainingMatrixByLoggedClient";
import listAllTrainingMatrixByLoggedCompany from "./listAllTrainingMatrixByLoggedCompany";

class Store extends AStore{

    async listAllByLogged() {
        return super.listAllByLogged(
            {
                byLoggedSite: listAllTrainingMatrixByLoggedSite,
                byLoggedProject: listAllTrainingMatrixByLoggedProject,
                byLoggedClient: listAllTrainingMatrixByLoggedClient,
                byLoggedCompany: listAllTrainingMatrixByLoggedCompany,
            }
        );
    }

    async listForSelectionByLogged() {
        return super.listForSelectionByLogged(
            {
                listForSelectionByLoggedSite: listForSelectionTrainingMatrixByLoggedSite,
                listForSelectionByLoggedProject: listForSelectionTrainingMatrixByLoggedProject,
                listForSelectionByLoggedClient: listForSelectionTrainingMatrixByLoggedClient,
                listForSelectionByLoggedCompany: listForSelectionTrainingMatrixByLoggedCompany,
            }
        );
    }

}

const trainingMatrixStore = new Store();
export default trainingMatrixStore;