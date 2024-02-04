import findByIdClient from "./findByIdClient";
import findBySiteIdClient from "./findBySiteIdClient";
import findByProjectIdClient from "./findByProjectIdClient";
import listAllClientByLoggedCompanySelectMenu from "./listAllClientByLoggedCompanySelectMenu";
import AOrgStore from "../AOrgStore";

class Store extends AOrgStore {
	
	key = "sess_my_client_id";
	org = "client";
	
	//<editor-fold desc="listAllByLogged">
	async listAllByLogged() {
		const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;
		const {isConsultant, isNoProjects} = storage.is;
		
		// console.log('listAllByLogged', sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id)
		
		if (sess_my_site_id) {
			return [await findBySiteIdClient(sess_my_site_id)];
		}
		if (sess_my_project_id) {
			return [await findByProjectIdClient(sess_my_site_id)];
		}
		if (sess_my_client_id) {
			return [await findByIdClient(sess_my_client_id)];
		}
		
		return listAllClientByLoggedCompanySelectMenu(sess_company_id);
	}
	
	//</editor-fold>
	
}

const clientStore = new Store();
export default clientStore;
//487
