import AStore from "../AStore";
import listAllDocumentCategoryByLoggedSite from "./listAllDocumentCategoryByLoggedSite";
import listAllDocumentCategoryByLoggedProject from "./listAllDocumentCategoryByLoggedProject";
import listAllDocumentCategoryByLoggedClient from "./listAllDocumentCategoryByLoggedClient";
import listAllDocumentCategoryByLoggedCompany from "./listAllDocumentCategoryByLoggedCompany";

class Store extends AStore{

    async listAllByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;
        if(sess_my_site_id) {
            return listAllDocumentCategoryByLoggedSite(sess_my_site_id);
        }
        if(sess_my_project_id) {
            return listAllDocumentCategoryByLoggedProject(sess_my_project_id);
        }
        if(sess_my_client_id) {
            return listAllDocumentCategoryByLoggedClient(sess_my_client_id);
        }
        return listAllDocumentCategoryByLoggedCompany(sess_company_id);
    }
}

const documentCategoryStore = new Store();
export default documentCategoryStore;