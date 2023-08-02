import AStore from "../AStore";
import listForSelectionTrainingRegisterByLoggedSite from "./listForSelectionTrainingRegisterByLoggedSite";
import listForSelectionTrainingRegisterByLoggedProject from "./listForSelectionTrainingRegisterByLoggedProject";
import listForSelectionTrainingRegisterByLoggedClient from "./listForSelectionTrainingRegisterByLoggedClient";
import listForSelectionTrainingRegisterByLoggedCompany from "./listForSelectionTrainingRegisterByLoggedCompany";
import listAllTrainingRegisterByLoggedSite from "./listAllTrainingRegisterByLoggedSite";
import listAllTrainingRegisterByLoggedProject from "./listAllTrainingRegisterByLoggedProject";
import listAllTrainingRegisterByLoggedClient from "./listAllTrainingRegisterByLoggedClient";
import listAllTrainingRegisterByLoggedCompany from "./listAllTrainingRegisterByLoggedCompany";

class Store extends AStore{

    async listAllByLogged() {
        return super.listAllByLogged(
            {
                byLoggedSite: listAllTrainingRegisterByLoggedSite,
                byLoggedProject: listAllTrainingRegisterByLoggedProject,
                byLoggedClient: listAllTrainingRegisterByLoggedClient,
                byLoggedCompany: listAllTrainingRegisterByLoggedCompany,
            }
        );
    }

    async listForSelectionByLogged() {
        return super.listForSelectionByLogged(
            {
                listForSelectionByLoggedSite: listForSelectionTrainingRegisterByLoggedSite,
                listForSelectionByLoggedProject: listForSelectionTrainingRegisterByLoggedProject,
                listForSelectionByLoggedClient: listForSelectionTrainingRegisterByLoggedClient,
                listForSelectionByLoggedCompany: listForSelectionTrainingRegisterByLoggedCompany,
            }
        );
    }

}

const trainingCourseStore = new Store();
export default trainingCourseStore;