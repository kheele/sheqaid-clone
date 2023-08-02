// import listAllByGroupEmployeeCompetencyByLoggedSite from "./ByGroup/listAllByGroupEmployeeCompetencyByLoggedSite";
// import listAllEachEmployeeCompetencyByLoggedSite from "./ByEach/listAllEachEmployeeCompetencyByLoggedSite";
// import listAllByGroupAndExpiryDateEmployeeCompetencyByLoggedSite
//     from "./ByGroup/listAllByGroupAndExpiryDateEmployeeCompetencyByLoggedSite";

export default async ({input, removed = false, view = 'Employee', expiry_date = 'ALL'}) => {
    if (expiry_date === "ALL") {
        if (view === 'Employee') {
            return listAllByGroupEmployeeCompetencyByLoggedSite({input, removed});
        }
        return listAllEachEmployeeCompetencyByLoggedSite({input, removed});
    } else {
        if (view === 'Employee') {
            return listAllByGroupAndExpiryDateEmployeeCompetencyByLoggedSite({input, removed});
        }
        return listAllEachAndExpiryDateEmployeeCompetencyByLoggedSite({input, removed});
    }
}
