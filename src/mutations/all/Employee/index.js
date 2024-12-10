import AStore from "../AStore";
import listForSelectionEmployeeByLoggedSite from "./listForSelectionEmployeeByLoggedSite";
import listForSelectionEmployeeByLoggedProject from "./listForSelectionEmployeeByLoggedProject";
import listForSelectionEmployeeByLoggedClient from "./listForSelectionEmployeeByLoggedClient";
import listForSelectionEmployeeByLoggedCompany from "./listForSelectionEmployeeByLoggedCompany";

class Store extends AStore {

    async listForSelectionByLogged() {
        return super.listForSelectionByLogged(
            {
                listForSelectionByLoggedSite: listForSelectionEmployeeByLoggedSite,
                listForSelectionByLoggedProject: listForSelectionEmployeeByLoggedProject,
                listForSelectionByLoggedClient: listForSelectionEmployeeByLoggedClient,
                listForSelectionByLoggedCompany: listForSelectionEmployeeByLoggedCompany,
            }
        );
    }

}

const employeeStore = new Store();
export default employeeStore;
