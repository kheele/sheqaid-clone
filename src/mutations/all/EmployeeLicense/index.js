import AStore from "../AStore";
import listAllActiveEmployeeLicenseByLoggedSite from "./listAllActiveEmployeeLicenseByLoggedSite";
import listAllActiveEmployeeLicenseByLoggedProject from "./listAllActiveEmployeeLicenseByLoggedProject";
import listAllActiveEmployeeLicenseByLoggedClient from "./listAllActiveEmployeeLicenseByLoggedClient";
import listAllActiveEmployeeLicenseByLoggedCompany from "./listAllActiveEmployeeLicenseByLoggedCompany";
import listAllActiveEmployeeLicenseByDepartment from "./listAllActiveEmployeeLicenseByDepartment";
import listAllActiveEmployeeLicenseByJobPosition from "./listAllActiveEmployeeLicenseByJobPosition";
import listAllActiveEmployeeLicenseByJobCategory from "./listAllActiveEmployeeLicenseByJobCategory";
import listAllActiveEmployeeLicenseBySupervisor from "./listAllActiveEmployeeLicenseBySupervisor";
import listAllActiveEmployeeLicenseByTeam from "./listAllActiveEmployeeLicenseByTeam";
import updateEmployeeLicense from "./updateEmployeeLicense";

class Store extends AStore{

    async restore(item) {
        return updateEmployeeLicense({id: item.id, removed: false});
    }

    async listAllByLogged(removed) {
        return super.listAllByLogged(
            {
                removed,
                byLoggedSite: listAllActiveEmployeeLicenseByLoggedSite,
                byLoggedProject: listAllActiveEmployeeLicenseByLoggedProject,
                byLoggedClient: listAllActiveEmployeeLicenseByLoggedClient,
                byLoggedCompany: listAllActiveEmployeeLicenseByLoggedCompany,
            }
        );
    }

    async listAllByDepartment(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeLicenseByDepartment(id);
    }

    async listAllByJobPosition(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeLicenseByJobPosition(id);
    }

    async listAllByJobCategory(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeLicenseByJobCategory(id);
    }

    async listAllBySupervisor(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeLicenseBySupervisor(id);
    }

    async listAllByTeam(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeLicenseByTeam(id);
    }
}

const employeeLicenseActiveStore = new Store();
export default employeeLicenseActiveStore;