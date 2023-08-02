// import listAllByGroupEmployeeCompetencyByLoggedClient from "./ByGroup/listAllByGroupEmployeeCompetencyByLoggedClient";
// import listAllEachEmployeeCompetencyByLoggedClient from "./ByEach/listAllEachEmployeeCompetencyByLoggedClient";

export default async ({input, removed = false, view = 'Employee', expiry_date = 'ALL'}) => {
    if (expiry_date === "ALL") {
        if (view === 'Employee') {
            return listAllByGroupEmployeeCompetencyByLoggedClient({input, removed});
        }
        return listAllEachEmployeeCompetencyByLoggedClient({input, removed});
    } else {
        if (view === 'Employee') {
            return listAllByGroupAndExpiryDateEmployeeCompetencyByLoggedClient({input, removed});
        }
        return listAllEachAndExpiryDateEmployeeCompetencyByLoggedClient({input, removed});
    }
}
