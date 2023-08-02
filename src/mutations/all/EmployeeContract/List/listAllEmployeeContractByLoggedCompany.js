import listAllByGroupEmployeeContractByLoggedCompany from "./ByGroup/listAllByGroupEmployeeContractByLoggedCompany";
import listAllEachEmployeeContractByLoggedCompany from "./ByEach/listAllEachEmployeeContractByLoggedCompany";

export default async ({input, removed = false, view = 'Employee', expiry_date = 'ALL'}) => {
    if (expiry_date === "ALL") {
        if (view === 'Employee') {
            return listAllByGroupEmployeeContractByLoggedCompany({input, removed});
        }
        return listAllEachEmployeeContractByLoggedCompany({input, removed});
    } else {
        if (view === 'Employee') {
            return listAllByGroupAndExpiryDateEmployeeContractByLoggedCompany({input, removed});
        }
        return listAllEachAndExpiryDateEmployeeContractByLoggedCompany({input, removed});
    }
}
