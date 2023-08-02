import AStore from "../AStore";
// import listAllSectorByLoggedCompany from "./listAllSectorByLoggedCompany";
// import listAllSectorByLoggedClient from "./listAllSectorByLoggedClient";
// import listForSelectionSectorByLoggedClient from "./listForSelectionSectorByLoggedClient";
// import listForSelectionSectorByLoggedCompany from "./listForSelectionSectorByLoggedCompany";
// import listAllSectorByPublic from "./listAllSectorByPublic";

class Store extends AStore{

    async listAllByLogged() {
        return super.listAllByLogged(
            {
                byLoggedClient: listAllSectorByLoggedClient,
                byLoggedCompany: listAllSectorByLoggedCompany,
            }
        );
    }

    async listForSelectionByLogged() {
        return super.listForSelectionByLogged(
            {
                listForSelectionByLoggedClient: listForSelectionSectorByLoggedClient,
                listForSelectionByLoggedCompany: listForSelectionSectorByLoggedCompany,
            }
        );
    }

    async listAllByPublic() {
        return listAllSectorByPublic();
    }
}

const incidentSubCategoryStore = new Store();
export default incidentSubCategoryStore;