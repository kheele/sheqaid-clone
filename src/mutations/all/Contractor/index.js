// import listAllContractorByLoggedSite from "./listAllContractorByLoggedSite";
// import listAllContractorByLoggedProject from "./listAllContractorByLoggedProject";
// import listAllContractorByLoggedClient from "./listAllContractorByLoggedClient";
// import listAllContractorByLoggedCompany from "./listAllContractorByLoggedCompany";
import AOrgStore from "../AOrgStore";

class Store extends AOrgStore {

    key = "sess_my_contractor_id";
    org = "contractor";

    // async listAllByLogged() {
    //     const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;
    //     if (sess_my_site_id) {
    //         return listAllContractorByLoggedSite(sess_my_site_id);
    //     }
    //     if (sess_my_project_id) {
    //         return listAllContractorByLoggedProject(sess_my_project_id);
    //     }
    //     if (sess_my_client_id) {
    //         return listAllContractorByLoggedClient(sess_my_client_id);
    //     }
    //     return listAllContractorByLoggedCompany(sess_company_id);
    // }

}

const contractorStore = new Store();
export default contractorStore;
