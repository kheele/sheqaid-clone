import AStore from "../AStore";
import listForSelectionTrainingPlanByLoggedSite from "./listForSelectionTrainingPlanByLoggedSite";
import listForSelectionTrainingPlanByLoggedProject from "./listForSelectionTrainingPlanByLoggedProject";
import listForSelectionTrainingPlanByLoggedClient from "./listForSelectionTrainingPlanByLoggedClient";
import listForSelectionTrainingPlanByLoggedCompany from "./listForSelectionTrainingPlanByLoggedCompany";
import listAllTrainingPlanByLoggedSite from "./listAllTrainingPlanByLoggedSite";
import listAllTrainingPlanByLoggedProject from "./listAllTrainingPlanByLoggedProject";
import listAllTrainingPlanByLoggedClient from "./listAllTrainingPlanByLoggedClient";
import listAllTrainingPlanByLoggedCompany from "./listAllTrainingPlanByLoggedCompany";

class Store extends AStore {

    async listAllByLogged(
        {
            view,
            employee_view,
            target_view
        }
    ) {
        return super.listAllByLogged(
            {
                byLoggedSite: (site_id, removed) => listAllTrainingPlanByLoggedSite({
                    input: site_id, removed, view, employee_view, target_view
                }),
                byLoggedProject: (project_id, removed) => listAllTrainingPlanByLoggedProject({
                    input: project_id, removed, view, employee_view, target_view
                }),
                byLoggedClient: (client_id, removed) => listAllTrainingPlanByLoggedClient({
                    input: client_id, removed, view, employee_view, target_view
                }),
                byLoggedCompany: (company_id, removed) => listAllTrainingPlanByLoggedCompany({
                    input: company_id, removed, view, employee_view, target_view
                }),
            }
        );
    }

    async listForSelectionByLogged() {
        return super.listForSelectionByLogged(
            {
                listForSelectionByLoggedSite: listForSelectionTrainingPlanByLoggedSite,
                listForSelectionByLoggedProject: listForSelectionTrainingPlanByLoggedProject,
                listForSelectionByLoggedClient: listForSelectionTrainingPlanByLoggedClient,
                listForSelectionByLoggedCompany: listForSelectionTrainingPlanByLoggedCompany,
            }
        );
    }

}

const trainingPlanStore = new Store();
export default trainingPlanStore;