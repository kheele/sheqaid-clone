import AStore from "../AStore";
import listAllInactiveEmployeeByLoggedSite from "./listAllInactiveEmployeeByLoggedSite";
import listAllInactiveEmployeeByLoggedProject from "./listAllInactiveEmployeeByLoggedProject";
import listAllInactiveEmployeeByLoggedClient from "./listAllInactiveEmployeeByLoggedClient";
import listAllInactiveEmployeeByLoggedCompany from "./listAllInactiveEmployeeByLoggedCompany";
import listAllInactiveEmployeeByDepartment from "./listAllInactiveEmployeeByDepartment";
import listAllInactiveEmployeeByJobPosition from "./listAllInactiveEmployeeByJobPosition";
import listAllInactiveEmployeeByJobCategory from "./listAllInactiveEmployeeByJobCategory";
import listAllInactiveEmployeeBySupervisor from "./listAllInactiveEmployeeBySupervisor";
import listAllInactiveEmployeeByTeam from "./listAllInactiveEmployeeByTeam";

class Store extends AStore{

    async listAllByLogged() {
        return super.listAllByLogged(
            {
                byLoggedSite: listAllInactiveEmployeeByLoggedSite,
                byLoggedProject: listAllInactiveEmployeeByLoggedProject,
                byLoggedClient: listAllInactiveEmployeeByLoggedClient,
                byLoggedCompany: listAllInactiveEmployeeByLoggedCompany,
            }
        );
    }

    async listAllByDepartment(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllInactiveEmployeeByDepartment(id);
    }

    async listAllByJobPosition(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllInactiveEmployeeByJobPosition(id);
    }

    async listAllByJobCategory(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllInactiveEmployeeByJobCategory(id);
    }

    async listAllBySupervisor(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllInactiveEmployeeBySupervisor(id);
    }

    async listAllByTeam(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllInactiveEmployeeByTeam(id);
    }
}

const employeeInactiveStore = new Store();
export default employeeInactiveStore;