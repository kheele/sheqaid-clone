import AStore from "../AStore";
import listForSelectionTrainingCourseByLoggedSite from "./listForSelectionTrainingCourseByLoggedSite";
import listForSelectionTrainingCourseByLoggedProject from "./listForSelectionTrainingCourseByLoggedProject";
import listForSelectionTrainingCourseByLoggedClient from "./listForSelectionTrainingCourseByLoggedClient";
import listForSelectionTrainingCourseByLoggedCompany from "./listForSelectionTrainingCourseByLoggedCompany";
import listAllTrainingCourseByLoggedSite from "./listAllTrainingCourseByLoggedSite";
import listAllTrainingCourseByLoggedProject from "./listAllTrainingCourseByLoggedProject";
import listAllTrainingCourseByLoggedClient from "./listAllTrainingCourseByLoggedClient";
import listAllTrainingCourseByLoggedCompany from "./listAllTrainingCourseByLoggedCompany";

class Store extends AStore{

    async listAllByLogged() {
        return super.listAllByLogged(
            {
                byLoggedSite: listAllTrainingCourseByLoggedSite,
                byLoggedProject: listAllTrainingCourseByLoggedProject,
                byLoggedClient: listAllTrainingCourseByLoggedClient,
                byLoggedCompany: listAllTrainingCourseByLoggedCompany,
            }
        );
    }

    async listForSelectionByLogged() {
        return super.listForSelectionByLogged(
            {
                listForSelectionByLoggedSite: listForSelectionTrainingCourseByLoggedSite,
                listForSelectionByLoggedProject: listForSelectionTrainingCourseByLoggedProject,
                listForSelectionByLoggedClient: listForSelectionTrainingCourseByLoggedClient,
                listForSelectionByLoggedCompany: listForSelectionTrainingCourseByLoggedCompany,
            }
        );
    }

}

const trainingCourseStore = new Store();
export default trainingCourseStore;