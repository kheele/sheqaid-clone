import AStore from "../AStore";
import listAllActiveEmployeeByLoggedSite from "./listAllActiveEmployeeByLoggedSite";
import listAllActiveEmployeeByLoggedProject from "./listAllActiveEmployeeByLoggedProject";
import listAllActiveEmployeeByLoggedClient from "./listAllActiveEmployeeByLoggedClient";
import listAllActiveEmployeeByLoggedCompany from "./listAllActiveEmployeeByLoggedCompany";
import listAllActiveEmployeeByDepartment from "./listAllActiveEmployeeByDepartment";
import listAllActiveEmployeeByJobPosition from "./listAllActiveEmployeeByJobPosition";
import listAllActiveEmployeeByJobCategory from "./listAllActiveEmployeeByJobCategory";
import listAllActiveEmployeeBySupervisor from "./listAllActiveEmployeeBySupervisor";
import listAllActiveEmployeeByTeam from "./listAllActiveEmployeeByTeam";

class Store extends AStore{

    async listAllByLogged(removed= false) {
        return super.listAllByLogged(
            {
                removed,
                byLoggedSite: listAllActiveEmployeeByLoggedSite,
                byLoggedProject: listAllActiveEmployeeByLoggedProject,
                byLoggedClient: listAllActiveEmployeeByLoggedClient,
                byLoggedCompany: listAllActiveEmployeeByLoggedCompany,
            }
        );
    }

    async listAllByDepartment(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeByDepartment(id);
    }

    async listAllByJobPosition(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeByJobPosition(id);
    }

    async listAllByJobCategory(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeByJobCategory(id);
    }

    async listAllBySupervisor(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeBySupervisor(id);
    }

    async listAllByTeam(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeByTeam(id);
    }
}

const employeeActiveStore = new Store();
export default employeeActiveStore;