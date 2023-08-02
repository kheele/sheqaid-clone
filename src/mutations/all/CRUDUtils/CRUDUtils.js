import AStore from "../AStore";

class CRUDUtils extends AStore{
    injectCreate(input, skipOrgs = false) {
        // return;
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;
        const {isConsultant, isContractor, isNoProjects} = storage.is;

        const {
            client_id,
            project_id,
            site_id,
        } = input;

        const {user} = storage.loggedUser;

        if(isContractor) {
            input.contractor_user_id = user.id;
        } else {
            input.user_id = user.id;
        }

        if(skipOrgs) return;

        if(isContractor) {
            const {loggedContractor} = storage;
            input.contractor_id = loggedContractor && loggedContractor.id;
            input.company_id = 38;//TODO: THIS IS A HACK. THE COMPANY WITH THIS ID WAS CREATED ONLY TO ASSIGN CONTRACTORS DATA TO THE COMPANY. BECAUSE PGSQL THROWS NON-NULL ERROR.
            return;
        }

        input.company_id = sess_company_id;

        if (sess_my_site_id) {
            input.site_id = sess_my_site_id;
        } else if (isConsultant) {
            if(site_id || selectedSite) {
                input.site_id = site_id || selectedSite.id;
            }
        } else if (!isNoProjects) {
            if(site_id || selectedSite) {
                input.site_id = site_id || selectedSite.id;
            }
        }

        if (sess_my_project_id) {
            input.project_id = sess_my_project_id;
        } else if (isConsultant) {
            if(project_id || selectedProject) {
                input.project_id = project_id || selectedProject.id;
            }
        } else if (!isNoProjects) {
            if(project_id || selectedProject) {
                input.project_id = project_id || selectedProject.id;
            }
        }

        if (sess_my_client_id) {
            input.client_id = sess_my_client_id;
        } else if (isConsultant) {
            if(client_id || selectedClient) {
                input.client_id = client_id || selectedClient.id;
            }
        }
    }
}

const crudUtils = new CRUDUtils();
export default crudUtils;