import AStore from "../AStore";
// import listAllActiveEmployeeCompetencyByDepartment from "./listAllActiveEmployeeCompetencyByDepartment";
// import listAllActiveEmployeeCompetencyByJobPosition from "./listAllActiveEmployeeCompetencyByJobPosition";
// import listAllActiveEmployeeCompetencyByJobCategory from "./listAllActiveEmployeeCompetencyByJobCategory";
// import listAllActiveEmployeeCompetencyBySupervisor from "./listAllActiveEmployeeCompetencyBySupervisor";
// import listAllActiveEmployeeCompetencyByTeam from "./listAllActiveEmployeeCompetencyByTeam";
import listAllEmployeeCompetencyByLoggedClient from "./List/listAllEmployeeCompetencyByLoggedClient";
import listAllEmployeeCompetencyByLoggedSite from "./List/listAllEmployeeCompetencyByLoggedSite";
import listAllEmployeeCompetencyByLoggedProject from "./List/listAllEmployeeCompetencyByLoggedProject";
import listAllEmployeeCompetencyByLoggedCompany from "./List/listAllEmployeeCompetencyByLoggedCompany";
import updateEmployeeCompetency from "./updateEmployeeCompetency";

class Store extends AStore{

    async restore(item) {
        return updateEmployeeCompetency({id: item.id, removed: false});
    }

    async listAllByLogged({removed, view, expiry_date}) {
        return super.listAllByLogged(
            {
                removed, expiry_date,
                byLoggedSite: (input, removed, expiry_date) => listAllEmployeeCompetencyByLoggedSite({input, removed, view, expiry_date}),
                byLoggedProject: (input, removed, expiry_date) => listAllEmployeeCompetencyByLoggedProject({input, removed, view, expiry_date}),
                byLoggedClient: (input, removed, expiry_date) => listAllEmployeeCompetencyByLoggedClient({input, removed, view, expiry_date}),
                byLoggedCompany: (input, removed, expiry_date) => listAllEmployeeCompetencyByLoggedCompany({input, removed, view, expiry_date}),
            }
        );
    }

    async listAllByDepartment(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeCompetencyByDepartment(id);
    }

    async listAllByJobPosition(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeCompetencyByJobPosition(id);
    }

    async listAllByJobCategory(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeCompetencyByJobCategory(id);
    }

    async listAllBySupervisor(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeCompetencyBySupervisor(id);
    }

    async listAllByTeam(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeCompetencyByTeam(id);
    }
}

const employeeCompetencyStore = new Store();
export default employeeCompetencyStore;