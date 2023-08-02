import AStore from "../AStore";
import listAllContractorByLoggedSite from "./listAllContractorByLoggedSite";
import listAllContractorByLoggedProject from "./listAllContractorByLoggedProject";
import listAllContractorByLoggedClient from "./listAllContractorByLoggedClient";
import listAllContractorByLoggedCompany from "./listAllContractorByLoggedCompany";
import listAllTeamByLoggedSite from "../Team/listAllTeamByLoggedSite";
import listAllTeamByLoggedProject from "../Team/listAllTeamByLoggedProject";
import listAllTeamByLoggedClient from "../Team/listAllTeamByLoggedClient";
import listAllTeamByLoggedCompany from "../Team/listAllTeamByLoggedCompany";

class Store extends AStore{

    async listAllByLogged() {
        return super.listAllByLogged(
            {
                byLoggedSite: listAllTeamByLoggedSite,
                byLoggedProject: listAllTeamByLoggedProject,
                byLoggedClient: listAllTeamByLoggedClient,
                byLoggedCompany: listAllTeamByLoggedCompany,
            }
        );
    }

    async listAllByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;
        if(sess_my_site_id) {
            return listAllContractorByLoggedSite(sess_my_site_id);
        }
        if(sess_my_project_id) {
            return listAllContractorByLoggedProject(sess_my_project_id);
        }
        if(sess_my_client_id) {
            return listAllContractorByLoggedClient(sess_my_client_id);
        }
        return listAllContractorByLoggedCompany(sess_company_id);
    }
}

const contractorStore = new Store();
export default contractorStore;