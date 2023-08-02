import AStore from "../AStore";
import listAllCompanyCategoryByLoggedSite from "./listAllCompanyCategoryByLoggedSite";
import listAllCompanyCategoryByLoggedProject from "./listAllCompanyCategoryByLoggedProject";
import listAllCompanyCategoryByLoggedClient from "./listAllCompanyCategoryByLoggedClient";
import listAllCompanyCategoryByLoggedCompany from "./listAllCompanyCategoryByLoggedCompany";

class Store extends AStore{

    async listAllByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;
        if(sess_my_site_id) {
            return listAllCompanyCategoryByLoggedSite(sess_my_site_id);
        }
        if(sess_my_project_id) {
            return listAllCompanyCategoryByLoggedProject(sess_my_project_id);
        }
        if(sess_my_client_id) {
            return listAllCompanyCategoryByLoggedClient(sess_my_client_id);
        }
        return listAllCompanyCategoryByLoggedCompany(sess_company_id);
    }
}

const companyCategoryStore = new Store();
export default companyCategoryStore;