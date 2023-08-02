import AStore from "../AStore";
import listAllActiveEmployeeCounsellingByLoggedSite from "./listAllActiveEmployeeCounsellingByLoggedSite";
import listAllActiveEmployeeCounsellingByLoggedProject from "./listAllActiveEmployeeCounsellingByLoggedProject";
import listAllActiveEmployeeCounsellingByLoggedClient from "./listAllActiveEmployeeCounsellingByLoggedClient";
import listAllActiveEmployeeCounsellingByLoggedCompany from "./listAllActiveEmployeeCounsellingByLoggedCompany";
import listAllActiveEmployeeCounsellingByDepartment from "./listAllActiveEmployeeCounsellingByDepartment";
import listAllActiveEmployeeCounsellingByJobPosition from "./listAllActiveEmployeeCounsellingByJobPosition";
import listAllActiveEmployeeCounsellingByJobCategory from "./listAllActiveEmployeeCounsellingByJobCategory";
import listAllActiveEmployeeCounsellingBySupervisor from "./listAllActiveEmployeeCounsellingBySupervisor";
import listAllActiveEmployeeCounsellingByTeam from "./listAllActiveEmployeeCounsellingByTeam";
import updateEmployeeCounselling from "./updateEmployeeCounselling";

class Store extends AStore{

    async restore(item) {
        return updateEmployeeCounselling({id: item.id, removed: false});
    }

    async listAllByLogged(removed) {
        return super.listAllByLogged(
            {
                removed,
                byLoggedSite: listAllActiveEmployeeCounsellingByLoggedSite,
                byLoggedProject: listAllActiveEmployeeCounsellingByLoggedProject,
                byLoggedClient: listAllActiveEmployeeCounsellingByLoggedClient,
                byLoggedCompany: listAllActiveEmployeeCounsellingByLoggedCompany,
            }
        );
    }

    async listAllByDepartment(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeCounsellingByDepartment(id);
    }

    async listAllByJobPosition(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeCounsellingByJobPosition(id);
    }

    async listAllByJobCategory(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeCounsellingByJobCategory(id);
    }

    async listAllBySupervisor(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeCounsellingBySupervisor(id);
    }

    async listAllByTeam(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeCounsellingByTeam(id);
    }
}

const employeeCounsellingActiveStore = new Store();
export default employeeCounsellingActiveStore;