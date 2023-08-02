import listAllByGroupEmployeeContractByLoggedClient from "./ByGroup/listAllByGroupEmployeeContractByLoggedClient";
import listAllEachEmployeeContractByLoggedClient from "./ByEach/listAllEachEmployeeContractByLoggedClient";

export default async ({input, removed = false, view = 'Employee', expiry_date = 'ALL'}) => {
    if(expiry_date === "ALL") {
        if (view === 'Employee') {
            return listAllByGroupEmployeeContractByLoggedClient({input, removed});
        }
        return listAllEachEmployeeContractByLoggedClient({input, removed});
    } else {
        if (view === 'Employee') {
            return listAllByGroupAndExpiryDateEmployeeContractByLoggedClient({input, removed});
        }
        return listAllEachAndExpiryDateEmployeeContractByLoggedClient({input, removed});
    }
}
