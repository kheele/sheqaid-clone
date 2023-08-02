import listAllByGroupEmployeeContractByLoggedProject from "./ByGroup/listAllByGroupEmployeeContractByLoggedProject";
import listAllEachEmployeeContractByLoggedProject from "./ByEach/listAllEachEmployeeContractByLoggedProject";

export default async ({input, removed = false, view = 'Employee', expiry_date = 'ALL'}) => {
    if (expiry_date === "ALL") {
        if (view === 'Employee') {
            return listAllByGroupEmployeeContractByLoggedProject({input, removed});
        }
        return listAllEachEmployeeContractByLoggedProject({input, removed});
    } else {
        if (view === 'Employee') {
            return listAllByGroupAndExpiryDateEmployeeContractByLoggedProject({input, removed});
        }
        return listAllEachAndExpiryDateEmployeeContractByLoggedProject({input, removed});
    }
}
