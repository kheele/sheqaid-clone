/* eslint-disable camelcase */

const update = path => async (attrs) => {
    try {
        const {update} = sockets.of(path);
        return await update(attrs);
    } catch (err) {
        throw err;
    }
};

//General
export const updateUser = update("users");
export const updateClient = update("clients");
export const updateProject = update("projects");
export const updateSite = update("sites");
export const updateSector = update("sectors");

//Assets
export const updateAsset = update("assets");

export const updateIncident = update("incidents");

export const updateProxyNCRAssignedPerson = update("ncr/proxy/assigned-person");
export const updateProxyNCRAssignedJobPosition = update("ncr/proxy/assigned-job-position");
export const updateProxyNCRAssignedUser = update("ncr/proxy/assigned-user");
export const updateProxyNCRApprovingPerson = update("ncr/proxy/approving-person");
export const updateProxyNCRResponsibleParty = update("ncr/proxy/responsible-party");
export const updateProxyNCRDocument = update("ncr/proxy/document");

export const updateOHSDoc = update("documents/ohs-docs");
export const updateSignableDocTemplate = update("doc-signing-settings/api/docuseal/templates");
export const updateContractor = update("contractors");

//HR
export const updateDepartment = update("departments");
export const updateJobCategory = update("job-categories");
export const updateJobPosition = update("job-positions");
export const updateTeam = update("teams");
export const updatePPE = update("ppe-types");
export const updatePPEItem = update("ppe-items");

export const updateEmployee = update("employees");
export const updateEmployeeExternal = update("employees-external");
export const updateEmployeeCompetency = update("employees/docs/competencies");
export const updateEmployeeContract = update("employees/docs/contracts");
export const updateEmployeeContractDetails = update("employees/docs/contracts/contract-details");
export const updateEmployeeContractSalaryInfo = update("employees/docs/contracts/salary-info");
export const updateEmployeeCounselling = update("employees/docs/counsellings");
export const updateEmployeeExpense = update("employees/docs/expenses");
export const updateEmployeeJobAppointment = update("structure-and-responsibility/job-appointments");
export const updateEmployeeLeave = update("employees/docs/leaves");
export const updateEmployeeMedical = update("employees/docs/medicals");
export const updateEmployeeWarning = update("employees/docs/warnings");

export const updateEmployeeLicense = update("employees/docs/licenses");
export const updateEmployeeWorkPermit = update("employees/docs/work-permits");

export const updateEmployeeDocBankingDetail = update("employees/documents/banking-details");
export const updateEmployeeDocLivingAddress = update("employees/documents/living-address");
export const updateEmployeeDocDocumentIDOrPassport = update("employees/documents/id-or-passports");
export const updateEmployeeDocDocumentPrDP = update("employees/documents/prdp");
export const updateEmployeeDependant = update("employees/dependents");
export const updateEmployeeNextOfKin = update("employees/next-of-kins");
