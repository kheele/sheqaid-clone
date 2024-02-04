import AOrgStore from "../AOrgStore";

class Store extends AOrgStore{
    
    key = "sess_company_id";
    org = "company";
    
}

const companyStore = new Store();
export default companyStore;
