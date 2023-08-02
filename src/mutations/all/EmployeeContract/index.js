import AStore from "../AStore";
// import listAllActiveEmployeeContractByDepartment from "./listAllActiveEmployeeContractByDepartment";
// import listAllActiveEmployeeContractByJobPosition from "./listAllActiveEmployeeContractByJobPosition";
// import listAllActiveEmployeeContractByJobCategory from "./listAllActiveEmployeeContractByJobCategory";
// import listAllActiveEmployeeContractBySupervisor from "./listAllActiveEmployeeContractBySupervisor";
// import listAllActiveEmployeeContractByTeam from "./listAllActiveEmployeeContractByTeam";
import listAllEmployeeContractByLoggedSite from "./List/listAllEmployeeContractByLoggedSite";
import listAllEmployeeContractByLoggedProject
    from "./List/listAllEmployeeContractByLoggedProject";
import listAllEmployeeContractByLoggedClient
    from "./List/listAllEmployeeContractByLoggedClient";
import listAllEmployeeContractByLoggedCompany
    from "./List/listAllEmployeeContractByLoggedCompany";
import updateEmployeeContract from "./updateEmployeeContract";

class Store extends AStore {

    async restore(item) {
        return updateEmployeeContract({id: item.id, removed: false});
    }

    async listAllByLogged({removed, view, expiry_date}) {
        return super.listAllByLogged(
            {
                removed, expiry_date,
                byLoggedSite: (input, removed, expiry_date) => listAllEmployeeContractByLoggedSite({input, removed, view, expiry_date}),
                byLoggedProject: (input, removed, expiry_date) => listAllEmployeeContractByLoggedProject({input, removed, view, expiry_date}),
                byLoggedClient: (input, removed, expiry_date) => listAllEmployeeContractByLoggedClient({input, removed, view, expiry_date}),
                byLoggedCompany: (input, removed, expiry_date) => listAllEmployeeContractByLoggedCompany({input, removed, view, expiry_date}),
            }
        );
    }

    async listAllByDepartment(item) {
        let id = this.extractId(item);
        if (!id) return [];
        return listAllActiveEmployeeContractByDepartment(id);
    }

    async listAllByJobPosition(item) {
        let id = this.extractId(item);
        if (!id) return [];
        return listAllActiveEmployeeContractByJobPosition(id);
    }

    async listAllByJobCategory(item) {
        let id = this.extractId(item);
        if (!id) return [];
        return listAllActiveEmployeeContractByJobCategory(id);
    }

    async listAllBySupervisor(item) {
        let id = this.extractId(item);
        if (!id) return [];
        return listAllActiveEmployeeContractBySupervisor(id);
    }

    async listAllByTeam(item) {
        let id = this.extractId(item);
        if (!id) return [];
        return listAllActiveEmployeeContractByTeam(id);
    }
}

const employeeContractActiveStore = new Store();
export default employeeContractActiveStore;