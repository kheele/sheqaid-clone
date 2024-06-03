import AStore from "../AStore";
import listAllActiveEmployeeExpenseByLoggedSite from "./listAllActiveEmployeeExpenseByLoggedSite";
import listAllActiveEmployeeExpenseByLoggedProject from "./listAllActiveEmployeeExpenseByLoggedProject";
import listAllActiveEmployeeExpenseByLoggedClient from "./listAllActiveEmployeeExpenseByLoggedClient";
import listAllActiveEmployeeExpenseByLoggedCompany from "./listAllActiveEmployeeExpenseByLoggedCompany";
import listAllActiveEmployeeExpenseByDepartment from "./listAllActiveEmployeeExpenseByDepartment";
import listAllActiveEmployeeExpenseByJobPosition from "./listAllActiveEmployeeExpenseByJobPosition";
import listAllActiveEmployeeExpenseByJobCategory from "./listAllActiveEmployeeExpenseByJobCategory";
import listAllActiveEmployeeExpenseBySupervisor from "./listAllActiveEmployeeExpenseBySupervisor";
import listAllActiveEmployeeExpenseByTeam from "./listAllActiveEmployeeExpenseByTeam";
import updateEmployeeExpense from "./updateEmployeeExpense";

class Store extends AStore{

    async restore(item) {
        return updateEmployeeExpense({id: item.id, removed: false});
    }

    async listAllByLogged(removed) {
        return super.listAllByLogged(
            {
                removed,
                byLoggedSite: listAllActiveEmployeeExpenseByLoggedSite,
                byLoggedProject: listAllActiveEmployeeExpenseByLoggedProject,
                byLoggedClient: listAllActiveEmployeeExpenseByLoggedClient,
                byLoggedCompany: listAllActiveEmployeeExpenseByLoggedCompany,
            }
        );
    }

    async listAllByDepartment(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeExpenseByDepartment(id);
    }

    async listAllByJobPosition(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeExpenseByJobPosition(id);
    }

    async listAllByJobCategory(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeExpenseByJobCategory(id);
    }

    async listAllBySupervisor(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeExpenseBySupervisor(id);
    }

    async listAllByTeam(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeExpenseByTeam(id);
    }
}

const employeeExpenseActiveStore = new Store();
export default employeeExpenseActiveStore;