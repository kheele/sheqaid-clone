// import listAllByGroupEmployeeCompetencyByLoggedProject from "./ByGroup/listAllByGroupEmployeeCompetencyByLoggedProject";
// import listAllEachEmployeeCompetencyByLoggedProject from "./ByEach/listAllEachEmployeeCompetencyByLoggedProject";

export default async ({input, removed = false, view = 'Employee', expiry_date = 'ALL'}) => {
    if (expiry_date === "ALL") {
        if (view === 'Employee') {
            return listAllByGroupEmployeeCompetencyByLoggedProject({input, removed});
        }
        return listAllEachEmployeeCompetencyByLoggedProject({input, removed});
    } else {
        if (view === 'Employee') {
            return listAllByGroupAndExpiryDateEmployeeCompetencyByLoggedProject({input, removed});
        }
        return listAllEachAndExpiryDateEmployeeCompetencyByLoggedProject({input, removed});
    }
}
