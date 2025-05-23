/* eslint-disable camelcase */

const findById = path => async (id) => {
    try {
        const {findById} = sockets.of(path);
        return await findById(id);
    } catch (err) {
        throw err;
    }
};

//General
export const findByIdManual = findById("manuals");

//Users
export const findByIdUser = findById("users");
export const findByIdContractorUser = findById("contractors/users");

//Assets
export const findByIdAsset = findById("assets");
export const findByIdAssetCalibrationRecordListItem = findById("assets/calibration-record-list");
export const findByIdAssetDepreciation = findById("assets/depreciation");
export const findByIdAssetDetails = findById("assets/details");
export const findByIdAssetDoc = findById("assets/docs");
export const findByIdAssetMaintenancePlanListItem = findById("assets/maintenance-plan-list");
export const findByIdAssetMonitoringPlanFuelUsageListItem = findById("assets/monitoring-plan-fuel-usage-list");
export const findByIdAssetMonitoringPlanWorkingHrsOrKmListItem = findById("assets/monitoring-plan-working-hrs-or-km-list");
export const findByIdAssetPurchaseInfo = findById("assets/purchase-info");

//Audits
export const findByIdAudit = findById("audits");
export const findByIdAuditItem = findById("audits/items");
export const findByIdAuditDefinition = findById("audits/definitions");

//Incidents
export const findByIdIncident = findById("incidents");
export const findByIdIncidentCauseAnalysis = findById("incidents/cause-analysis");
export const findByIdIncidentCauseAnalysisCause = findById("incidents/cause-analysis/cause");
export const findByIdIncidentCauseAnalysisImmediate = findById("incidents/cause-analysis/immediate");
export const findByIdIncidentCauseAnalysisRoot = findById("incidents/cause-analysis/root");
export const findByIdIncidentCorrectiveAction = findById("incidents/corrective-actions");
export const findByIdIncidentInvestigation = findById("incidents/investigations");

//NCR
export const findByIdNCR = findById("ncr");
export const findByIdProxyNCRAssignedPerson = findById("ncr/proxy/assigned-person");
export const findByIdProxyNCRAssignedJobPosition = findById("ncr/proxy/assigned-job-position");
export const findByIdProxyNCRAssignedUser = findById("ncr/proxy/assigned-user");
export const findByIdProxyNCRApprovingPerson = findById("ncr/proxy/approving-person");
export const findByIdProxyNCRResponsibleParty = findById("ncr/proxy/responsible-party");
export const findByIdProxyNCRDocument = findById("ncr/proxy/document");

export const findByIdOHSDoc = findById("documents/ohs-docs");
export const findByIdSignableDoc = findById("doc-signing-settings/api/docuseal/templates");

export const findByIdCompany = findById("companies");
export const findByIdClient = findById("clients");
export const findByIdProject = findById("projects");
export const findByIdSite = findById("sites");
export const findByIdContractor = findById("contractors");
export const findByIdContractorSite = findById("contractors/sites");

//HR
export const findByIdDepartment = findById("departments");
export const findByIdJobCategory = findById("job-categories");
export const findByIdJobPosition = findById("job-positions");
export const findByIdTeam = findById("teams");

export const findByIdPPESupplier = findById("ppe-suppliers");
export const findByIdPPE = findById("ppe-types");
export const findByIdPPEInventory = findById("ppe-inventory");
export const findByIdPPEItem = findById("ppe-items");
export const findByIdPPEDisposal = findById("ppe-disposals");
export const findByIdPPEFitTest = findById("ppe-fit-tests");
export const findByIdPPEReturn = findById("ppe-returns");
export const findByIdPPERequisition = findById("ppe-requisitions");
export const findByIdApplicableRegulation = findById("applicable-regulations");
export const findByIdComplianceRequirement = findById("compliance-requirements");
export const findByIdJobTaskCategory = findById("job-tasks/categories");
export const findByIdJobTask = findById("job-tasks");

export const findByIdEmployee = findById("employees");
export const findByIdEmployeeExternal = findById("employees-external");
export const findByIdEmployeeCompetency = findById("employees/docs/competencies");
export const findByIdEmployeeContract = findById("employees/docs/contracts");
export const findByIdEmployeeCounselling = findById("employees/docs/counsellings");
export const findByIdEmployeeExpense = findById("employees/docs/expenses");
export const findByIdEmployeeJobAppointment = findById("structure-and-responsibility/job-appointments");
export const findByIdEmployeeMedical = findById("employees/docs/medicals");
export const findByIdEmployeeWarning = findById("employees/docs/warnings");
export const findByIdEmployeeLeave = findById("employees/docs/leaves");
export const findByIdEmployeeLeaveType = findById("employees/docs/leaves/types");
export const findByIdEmployeeLeavePolicy = findById("employees/docs/leaves/policies");
export const findByIdEmployeeLeaveAllocation = findById("employees/docs/leaves/allocations");

export const findByIdEmployeeLicense = findById("employees/docs/licenses");
export const findByIdEmployeeWorkPermit = findById("employees/docs/work-permits");

export const findByIdEmployeeDocBankingDetail = findById("employees/documents/banking-details");
export const findByIdEmployeeDocLivingAddress = findById("employees/documents/living-address");
export const findByIdEmployeeDocDocumentIDOrPassport = findById("employees/documents/id-or-passports");
export const findByIdEmployeeDocDocumentPrDP = findById("employees/documents/prdp");
export const findByIdEmployeeDependant = findById("employees/dependents");
export const findByIdEmployeeNextOfKin = findById("employees/next-of-kins");

//Questionnaires
export const findByIdQuestion = findById("questionnaires/questions");

//Chemicals
export const findByIdChemicalHazchemsheet = findById("chemicals/hazchem-sheets");
export const findByIdChemicalProduct = findById("chemicals/products");
export const findByIdChemicalSDS = findById("chemicals/sds");

//Documents
export const findByIdDocument = findById("documents");

//HIRA
export const findByIdBaselineRA = findById("hira-and-opportunities/baseline-ra");
export const findByIdBaselineRAListItem = findById("hira-and-opportunities/task-based-ra-list");
export const findByIdSOP = findById("hira-and-opportunities/sop");
export const findByIdSWP = findById("hira-and-opportunities/swp");
export const findByIdTaskbasedRA = findById("hira-and-opportunities/task-based-ra");
export const findByIdTaskbasedRAListItem = findById("hira-and-opportunities/task-based-ra-list");

//Claims
export const findByIdClaimsClient = findById("claims/clients");
export const findByIdAnnexture1 = findById("claims/clients/annexture1");
export const findByIdWCL2 = findById("claims/clients/wcl2");
export const findByIdWCL4 = findById("claims/clients/wcl4");
export const findByIdWCL5 = findById("claims/clients/wcl5");
export const findByIdWCL6 = findById("claims/clients/wcl6");
export const findByIdWCL5Proxy = findById("claims/clients/wcl5-proxy");

//Training
export const findByIdTrainingRegister = findById("trainings/register");
