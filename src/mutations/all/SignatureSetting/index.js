import {computed} from "mobx";

class Store {

    @computed get listAllByLogged() {
        const {isConsultant, isHasProjects} = storage.is;
        const {isLoggedClient, isLoggedProject, isLoggedSite, isContractor, isContractorViewVisited} = storage.is;
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {selectedContractorSite} = storage.selected;
        // if(isContractor) {
        //     if(selectedContractorSite) {
        //         rows = listAllContractorUserByLoggedSite(page_size, selectedContractorSite.id);
        //     } else {
        //         rows = listAllContractorUserByLoggedContractor(page_size, );
        //     }
        // }
    }
}

const signatureSettingStore = new Store();
export default signatureSettingStore;