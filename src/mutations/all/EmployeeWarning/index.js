import AStore from "../AStore";
import listAllActiveEmployeeWarningByLoggedSite from "./listAllActiveEmployeeWarningByLoggedSite";
import listAllActiveEmployeeWarningByLoggedProject from "./listAllActiveEmployeeWarningByLoggedProject";
import listAllActiveEmployeeWarningByLoggedClient from "./listAllActiveEmployeeWarningByLoggedClient";
import listAllActiveEmployeeWarningByLoggedCompany from "./listAllActiveEmployeeWarningByLoggedCompany";
import listAllActiveEmployeeWarningByDepartment from "./listAllActiveEmployeeWarningByDepartment";
import listAllActiveEmployeeWarningByJobPosition from "./listAllActiveEmployeeWarningByJobPosition";
import listAllActiveEmployeeWarningByJobCategory from "./listAllActiveEmployeeWarningByJobCategory";
import listAllActiveEmployeeWarningBySupervisor from "./listAllActiveEmployeeWarningBySupervisor";
import listAllActiveEmployeeWarningByTeam from "./listAllActiveEmployeeWarningByTeam";
import updateEmployeeWarning from "./updateEmployeeWarning";

class Store extends AStore{

    async restore(item) {
        return updateEmployeeWarning({id: item.id, removed: false});
    }

    async listAllByLogged(removed) {
        return super.listAllByLogged(
            {
                removed,
                byLoggedSite: listAllActiveEmployeeWarningByLoggedSite,
                byLoggedProject: listAllActiveEmployeeWarningByLoggedProject,
                byLoggedClient: listAllActiveEmployeeWarningByLoggedClient,
                byLoggedCompany: listAllActiveEmployeeWarningByLoggedCompany,
            }
        );
    }

    async listAllByDepartment(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeWarningByDepartment(id);
    }

    async listAllByJobPosition(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeWarningByJobPosition(id);
    }

    async listAllByJobCategory(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeWarningByJobCategory(id);
    }

    async listAllBySupervisor(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeWarningBySupervisor(id);
    }

    async listAllByTeam(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeWarningByTeam(id);
    }
}

const employeeWarningActiveStore = new Store();
export default employeeWarningActiveStore;