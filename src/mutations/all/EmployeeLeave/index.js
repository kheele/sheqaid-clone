import AStore from "../AStore";
import listAllActiveEmployeeLeaveByLoggedSite from "./listAllActiveEmployeeLeaveByLoggedSite";
import listAllActiveEmployeeLeaveByLoggedProject from "./listAllActiveEmployeeLeaveByLoggedProject";
import listAllActiveEmployeeLeaveByLoggedClient from "./listAllActiveEmployeeLeaveByLoggedClient";
import listAllActiveEmployeeLeaveByLoggedCompany from "./listAllActiveEmployeeLeaveByLoggedCompany";
import listAllActiveEmployeeLeaveByDepartment from "./listAllActiveEmployeeLeaveByDepartment";
import listAllActiveEmployeeLeaveByJobPosition from "./listAllActiveEmployeeLeaveByJobPosition";
import listAllActiveEmployeeLeaveByJobCategory from "./listAllActiveEmployeeLeaveByJobCategory";
import listAllActiveEmployeeLeaveBySupervisor from "./listAllActiveEmployeeLeaveBySupervisor";
import listAllActiveEmployeeLeaveByTeam from "./listAllActiveEmployeeLeaveByTeam";
import updateEmployeeLeave from "./updateEmployeeLeave";

class Store extends AStore{

    async restore(item) {
        return updateEmployeeLeave({id: item.id, removed: false});
    }

    async listAllByLogged(removed) {
        return super.listAllByLogged(
            {
                removed,
                byLoggedSite: listAllActiveEmployeeLeaveByLoggedSite,
                byLoggedProject: listAllActiveEmployeeLeaveByLoggedProject,
                byLoggedClient: listAllActiveEmployeeLeaveByLoggedClient,
                byLoggedCompany: listAllActiveEmployeeLeaveByLoggedCompany,
            }
        );
    }

    async listAllByDepartment(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeLeaveByDepartment(id);
    }

    async listAllByJobPosition(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeLeaveByJobPosition(id);
    }

    async listAllByJobCategory(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeLeaveByJobCategory(id);
    }

    async listAllBySupervisor(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeLeaveBySupervisor(id);
    }

    async listAllByTeam(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeLeaveByTeam(id);
    }
}

const employeeLeaveActiveStore = new Store();
export default employeeLeaveActiveStore;