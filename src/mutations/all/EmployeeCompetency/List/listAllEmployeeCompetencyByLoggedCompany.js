// import listAllByGroupEmployeeCompetencyByLoggedCompany from "./ByGroup/listAllByGroupEmployeeCompetencyByLoggedCompany";
// import listAllEachEmployeeCompetencyByLoggedCompany from "./ByEach/listAllEachEmployeeCompetencyByLoggedCompany";

export default async ({input, removed = false, view = 'Employee', expiry_date = 'ALL'}) => {
    if (expiry_date === "ALL") {
        if (view === 'Employee') {
            return listAllByGroupEmployeeCompetencyByLoggedCompany({input, removed});
        }
        return listAllEachEmployeeCompetencyByLoggedCompany({input, removed});
    } else {
        if (view === 'Employee') {
            return listAllByGroupAndExpiryDateEmployeeCompetencyByLoggedCompany({input, removed});
        }
        return listAllEachAndExpiryDateEmployeeCompetencyByLoggedCompany({input, removed});
    }
}
