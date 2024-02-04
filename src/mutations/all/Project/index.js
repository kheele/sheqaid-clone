import findByIdProject from "./findByIdProject";
import findBySiteIdProject from "./findBySiteIdProject";
import listAllProjectByLoggedCompanySelectMenu from "./listAllProjectByLoggedCompanySelectMenu";
import listAllProjectByLoggedClientSelectMenu from "./listAllProjectByLoggedClientSelectMenu";
import AOrgStore from "../AOrgStore";

class Store extends AOrgStore{
    
    key = "sess_my_project_id";
    org = "project";
    
    //<editor-fold desc="listAllByLogged">
    async listAllByLogged() {
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;
        const {isConsultant, isNoProjects} = storage.is;

        if (sess_my_site_id) {
            return [await findBySiteIdProject(sess_my_site_id)];
        }
        if (sess_my_project_id) {
            return [await findByIdProject(sess_my_project_id)];
        }
        if (sess_my_client_id) {
            return listAllProjectByLoggedClientSelectMenu(sess_my_client_id);
        }

        if (isConsultant) {
            if (selectedClient) {
                console.log('listAllProjectByLoggedClientSelectMenu', selectedClient.id)
                return listAllProjectByLoggedClientSelectMenu(selectedClient.id);
            }
            return [];
        } else if(!isNoProjects) {//client with projects

        }
        return listAllProjectByLoggedCompanySelectMenu(sess_company_id);
    }
    //</editor-fold>

}

const projectStore = new Store();
export default projectStore;
