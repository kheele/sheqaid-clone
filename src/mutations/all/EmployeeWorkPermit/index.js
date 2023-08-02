import AStore from "../AStore";
import listAllActiveEmployeeWorkPermitByLoggedSite from "./listAllActiveEmployeeWorkPermitByLoggedSite";
import listAllActiveEmployeeWorkPermitByLoggedProject from "./listAllActiveEmployeeWorkPermitByLoggedProject";
import listAllActiveEmployeeWorkPermitByLoggedClient from "./listAllActiveEmployeeWorkPermitByLoggedClient";
import listAllActiveEmployeeWorkPermitByLoggedCompany from "./listAllActiveEmployeeWorkPermitByLoggedCompany";
import listAllActiveEmployeeWorkPermitByDepartment from "./listAllActiveEmployeeWorkPermitByDepartment";
import listAllActiveEmployeeWorkPermitByJobPosition from "./listAllActiveEmployeeWorkPermitByJobPosition";
import listAllActiveEmployeeWorkPermitByJobCategory from "./listAllActiveEmployeeWorkPermitByJobCategory";
import listAllActiveEmployeeWorkPermitBySupervisor from "./listAllActiveEmployeeWorkPermitBySupervisor";
import listAllActiveEmployeeWorkPermitByTeam from "./listAllActiveEmployeeWorkPermitByTeam";
import updateEmployeeWorkPermit from "./updateEmployeeWorkPermit";

class Store extends AStore{

    async restore(item) {
        return updateEmployeeWorkPermit({id: item.id, removed: false});
    }

    async listAllByLogged(removed) {
        return super.listAllByLogged(
            {
                removed,
                byLoggedSite: listAllActiveEmployeeWorkPermitByLoggedSite,
                byLoggedProject: listAllActiveEmployeeWorkPermitByLoggedProject,
                byLoggedClient: listAllActiveEmployeeWorkPermitByLoggedClient,
                byLoggedCompany: listAllActiveEmployeeWorkPermitByLoggedCompany,
            }
        );
    }

    async listAllByDepartment(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeWorkPermitByDepartment(id);
    }

    async listAllByJobPosition(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeWorkPermitByJobPosition(id);
    }

    async listAllByJobCategory(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeWorkPermitByJobCategory(id);
    }

    async listAllBySupervisor(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeWorkPermitBySupervisor(id);
    }

    async listAllByTeam(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeWorkPermitByTeam(id);
    }
}

const employeeWorkPermitActiveStore = new Store();
export default employeeWorkPermitActiveStore;