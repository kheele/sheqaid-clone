import AStore from "../AStore";
import listAllActiveEmployeeMedicalByLoggedSite from "./listAllActiveEmployeeMedicalByLoggedSite";
import listAllActiveEmployeeMedicalByLoggedProject from "./listAllActiveEmployeeMedicalByLoggedProject";
import listAllActiveEmployeeMedicalByLoggedClient from "./listAllActiveEmployeeMedicalByLoggedClient";
import listAllActiveEmployeeMedicalByLoggedCompany from "./listAllActiveEmployeeMedicalByLoggedCompany";
import listAllActiveEmployeeMedicalByDepartment from "./listAllActiveEmployeeMedicalByDepartment";
import listAllActiveEmployeeMedicalByJobPosition from "./listAllActiveEmployeeMedicalByJobPosition";
import listAllActiveEmployeeMedicalByJobCategory from "./listAllActiveEmployeeMedicalByJobCategory";
import listAllActiveEmployeeMedicalBySupervisor from "./listAllActiveEmployeeMedicalBySupervisor";
import listAllActiveEmployeeMedicalByTeam from "./listAllActiveEmployeeMedicalByTeam";
import updateEmployeeMedical from "./updateEmployeeMedical";

class Store extends AStore{

    async restore(item) {
        return updateEmployeeMedical({id: item.id, removed: false});
    }

    async listAllByLogged(removed) {
        return super.listAllByLogged(
            {
                removed,
                byLoggedSite: listAllActiveEmployeeMedicalByLoggedSite,
                byLoggedProject: listAllActiveEmployeeMedicalByLoggedProject,
                byLoggedClient: listAllActiveEmployeeMedicalByLoggedClient,
                byLoggedCompany: listAllActiveEmployeeMedicalByLoggedCompany,
            }
        );
    }

    async listAllByDepartment(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeMedicalByDepartment(id);
    }

    async listAllByJobPosition(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeMedicalByJobPosition(id);
    }

    async listAllByJobCategory(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeMedicalByJobCategory(id);
    }

    async listAllBySupervisor(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeMedicalBySupervisor(id);
    }

    async listAllByTeam(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeMedicalByTeam(id);
    }
}

const employeeMedicalActiveStore = new Store();
export default employeeMedicalActiveStore;