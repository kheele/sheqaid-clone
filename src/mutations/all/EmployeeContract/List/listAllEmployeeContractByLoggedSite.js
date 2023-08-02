import listAllByGroupEmployeeContractByLoggedSite from "./ByGroup/listAllByGroupEmployeeContractByLoggedSite";
import listAllEachEmployeeContractByLoggedSite from "./ByEach/listAllEachEmployeeContractByLoggedSite";

export default async ({input, removed = false, view = 'Employee', expiry_date = 'ALL'}) => {
    if (expiry_date === "ALL") {
        if (view === 'Employee') {
            return listAllByGroupEmployeeContractByLoggedSite({input, removed});
        }
        return listAllEachEmployeeContractByLoggedSite({input, removed});
    } else {
        if (view === 'Employee') {
            return listAllByGroupAndExpiryDateEmployeeContractByLoggedSite({input, removed});
        }
        return listAllEachAndExpiryDateEmployeeContractByLoggedSite({input, removed});
    }
}
