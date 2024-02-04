import findByIdSite from "./findByIdSite";
import listAllSiteByLoggedClient from "./listAllSiteByLoggedClient";
import listAllSiteByLoggedCompany from "./listAllSiteByLoggedCompany";
import listAllSiteByLoggedProject from "./listAllSiteByLoggedProject";
import AOrgStore from "../AOrgStore";

class Store extends AOrgStore{
    
    key = "sess_my_site_id";
    org = "site";
    
    //<editor-fold desc="listAllByLogged">
    async listAllByLogged() {
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;
        const {isConsultant, isNoProjects} = storage.is;

        if (sess_my_site_id) {
            return [await findByIdSite(sess_my_site_id)];
        }
        if (sess_my_project_id) {
            return listAllSiteByLoggedProject(sess_my_project_id);
        }
        if (sess_my_client_id) {
            if (selectedProject) {
                return listAllSiteByLoggedProject(selectedProject.id);
            }
            return listAllSiteByLoggedClient(sess_my_client_id);
        }

        if (isConsultant) {
            if (selectedProject) {
                console.log('listAllSiteByLoggedProject', selectedProject.id)
                return listAllSiteByLoggedProject(selectedProject.id);
            }
            if (selectedClient) {
                return listAllSiteByLoggedClient(selectedClient.id);
            }
        } else if(!isNoProjects) {//client with projects
            if (selectedProject) {
                return listAllSiteByLoggedProject(selectedProject.id);
            }
        }
        return listAllSiteByLoggedCompany(sess_company_id);
    }
    //</editor-fold>

}

const siteStore = new Store();
export default siteStore;
