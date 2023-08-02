import AStore from "../AStore";
import listAllDepartmentByLoggedCompany from "./listAllDepartmentByLoggedCompany";
import listAllDepartmentByLoggedClient from "./listAllDepartmentByLoggedClient";

class Store extends AStore{

    async listAllByLogged() {
        return super.listAllByLogged(
            {
                byLoggedClient: listAllDepartmentByLoggedClient,
                byLoggedCompany: listAllDepartmentByLoggedCompany,
            }
        );
    }

}

const departmentStore = new Store();
export default departmentStore;