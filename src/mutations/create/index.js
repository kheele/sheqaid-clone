/* eslint-disable camelcase */

const create = (path, crudUtils, onProcess) => async (input) => {
    try {
        crudUtils && crudUtils.injectCreate(input);
        onProcess && onProcess(input);

        const {create} = sockets.of(path);
        return await create(input);
    } catch (err) {
        throw err;
    }
};

export default create;

//General
export const insertUser = create("users");
export const insertContractorUser = create("contractors/users");
export const insertClient = create("clients");
export const insertProject = create("projects");
export const insertSector = create("sectors");
export const insertSite = create("sites");
export const insertContractor = create("contractors");
export const insertProxySectorClient = create("sectors/proxy/clients");

//Audits
export const insertAudit = create("audits");
export const insertAuditDefinition = create("audits/definitions");
export const insertAuditItem = create("audits/items");
export const insertProxyEmployeeAuditor = create("ProxyEmployeeAuditor");
export const insertProxyEmployeeAuditRepresentative = create("ProxyEmployeeAuditRepresentative");

//Assets
export const insertAsset = create("assets");
export const insertAssetCalibrationRecord = create("assets/calibration-records");
export const insertAssetCalibrationRecordListItem = create("assets/calibration-record-list");
export const insertAssetDepreciation = create("assets/depreciation");
export const insertAssetDetails = create("assets/details");
export const insertAssetDoc = create("assets/docs");
export const insertAssetMaintenancePlan = create("assets/maintenance-plans");
export const insertAssetMaintenancePlanListItem = create("assets/maintenance-plan-list");
export const insertAssetMonitoringPlan = create("assets/monitoring-plans");
export const insertAssetMonitoringPlanFuelUsageListItem = create("assets/monitoring-plan-fuel-usage-list");
export const insertAssetMonitoringPlanWorkingHrsOrKmListItem = create("assets/monitoring-plan-working-hrs-or-km-list");
export const insertAssetPhoto = create("assets/photos");
export const insertAssetPurchaseInfo = create("assets/purchase-info");
export const insertProxyAssetAsset = create("assets");
export const insertAssetRegister = create("assets/registers");

//Incidents
export const insertIncidentCauseAnalysis = create("IncidentCauseAnalysis");
export const insertIncidentCauseAnalysisCause = create("IncidentCauseAnalysisCause");
export const insertIncidentCauseAnalysisImmediate = create("IncidentCauseAnalysisImmediate");
export const insertIncidentCauseAnalysisRoot = create("IncidentCauseAnalysisRoot");
export const insertIncidentCorrectiveAction = create("IncidentCorrectiveAction");
export const insertIncidentDocument = create("IncidentDocument");
export const insertIncidentInvestigation = create("IncidentInvestigation");
export const insertIncidentSeverity = create("IncidentSeverity");
export const insertIncidentTestType = create("IncidentTestType");
export const insertIncidentVehicle = create("IncidentVehicle");
export const insertInvestigationDocument = create("InvestigationDocument");
export const insertInvestigationFinding = create("InvestigationFinding");
export const insertProxyEmployeeIncidentInvestigator = create("ProxyEmployeeIncidentInvestigator");
export const insertProxyIncidentActivity = create("incidents/proxy/activities");
export const insertProxyIncidentCategory = create("incidents/proxy/categories");
export const insertProxyIncidentDistribution = create("incidents/proxy/distributions");
export const insertProxyIncidentInjuryList = create("incidents/proxy/injuries");
export const insertProxyIncidentPersonInvolved = create("incidents/proxy/persons-involved");
export const insertProxyIncidentSector = create("incidents/proxy/sectors");
export const insertProxyIncidentSubCategory = create("incidents/proxy/sub-categories");
export const insertProxyIncidentWitness = create("incidents/proxy/witnesses");

//NCR
export const insertNCRProgress = create("ncr/progress");
export const insertProxyNCRAssignedPerson = create("ncr/proxy/assigned-person");
export const insertProxyNCRAssignedJobPosition = create("ncr/proxy/assigned-job-position");
export const insertProxyNCRAssignedUser = create("ncr/proxy/assigned-user");
export const insertProxyNCRApprovingPerson = create("ncr/proxy/approving-person");
export const insertProxyNCRResponsibleParty = create("ncr/proxy/responsible-party");
export const insertProxyNCRDocument = create("ncr/proxy/document");
// export const insertProxyJobPositionNCRAssignedPerson = create("ncr/proxy/job-position_assigned-person", crudUtils);

//Chemicals
export const insertChemicalProduct = create("chemicals/products");
export const insertChemicalHazchemsheet = create("chemicals/hazchem-sheets");
export const insertChemicalSDS = create("chemicals/sds");
export const insertChemicalSupplier = create("chemicals/suppliers");

//Documents
export const insertOHSDoc = create("documents/ohs-docs");
export const insertDocument = create("documents");
export const insertSignableDocTemplate = create("doc-signing-settings/api/docuseal/templates");
export const insertSettings = create("settings");
export const insertNotificationSettings = create("notification-settings");
export const insertNCR = create("ncr");

//HR
export const insertDepartment = create("departments");
export const insertJobCategory = create("job-categories");
export const insertJobPosition = create("job-positions");
export const insertTeam = create("teams");

export const insertPPESupplier = create("ppe-suppliers");
export const insertPPE = create("ppe-types");
export const insertPPEInventory = create("ppe-inventory");
export const insertPPEItem = create("ppe-items");
export const insertPPEDisposal = create("ppe-disposals");
export const insertPPEFitTest = create("ppe-fit-tests");
export const insertPPEReturn = create("ppe-returns");
export const insertPPERequisition = create("ppe-requisitions");
export const insertApplicableRegulation = create("applicable-regulations");
export const insertComplianceRequirement = create("compliance-requirements");
export const insertJobTaskCategory = create("job-tasks/categories");
export const insertJobTask = create("job-tasks");

export const insertEmployeeImported = create("employees/imported/create");
export const insertEmployeeExternal = create("employees-external");
export const insertEmployeeCompetency = create("employees/docs/competencies");
export const insertEmployeeContract = create("employees/docs/contracts");
export const insertEmployeeCounselling = create("employees/docs/counsellings");
export const insertEmployeeExpense = create("employees/docs/expenses");
export const insertEmployeeJobAppointment = create("structure-and-responsibility/job-appointments");
export const insertEmployeeMedical = create("employees/docs/medicals");
export const insertEmployeeWarning = create("employees/docs/warnings");

export const insertEmployeeLeave = create("employees/docs/leaves");
export const insertEmployeeLeavePolicy = create("employees/docs/leaves/policies");
export const insertEmployeeLeaveType = create("employees/docs/leaves/types");
export const insertEmployeeLeaveAllocation = create("employees/docs/leaves/allocations");

export const insertEmployeeLicense = create("employees/docs/licenses");
export const insertEmployeeWorkPermit = create("employees/docs/work-permits");

export const insertEmployeeDocBankingDetail = create("employees/documents/banking-details");
export const insertEmployeeDocLivingAddress = create("employees/documents/living-address");
export const insertEmployeeDocDocumentIDOrPassport = create("employees/documents/id-or-passports");
export const insertEmployeeDocDocumentPrDP = create("employees/documents/prdp");
export const insertEmployeeDependant = create("employees/dependents");
export const insertEmployeeNextOfKin = create("employees/next-of-kins");

//
export const insertOrganogram = create("structure-and-responsibility/organograms");

// Contractors
export const insertContractorsQuestionnaireLibrary = create("ContractorsQuestionnaireLibrary");
export const insertContractorsQuestionnaire = create("ContractorsQuestionnaire");
export const insertJobObservationsQuestionnaire = create("job-observations");
export const insertInspectionsQuestionnaire = create("InspectionsQuestionnaire");
export const insertInspectionsQuestionnaireTemplate = create("InspectionsQuestionnaireTemplate");
export const insertJobObservationsQuestionnaireTemplate = create("JobObservationsQuestionnaireTemplate");
export const insertQuestionNotifiedList = create("QuestionNotifiedList");
export const insertSafetyFilesQuestionnaire = create("SafetyFilesQuestionnaire");
export const insertSafetyFilesQuestionnaireTemplate = create("SafetyFilesQuestionnaireTemplate");

//Questionnaires
export const insertQuestion = create("questionnaires/questions");
export const insertQuestionOption = create("questionnaires/question-options");
export const insertQuestionMessage = create("questionnaires/messages");

//HIRA
export const insertBaselineRA = create("hira-and-opportunities/baseline-ra");
export const insertTaskbasedRA = create("hira-and-opportunities/task-based-ra");
export const insertBaselineRAListItem = create("hira-and-opportunities/baseline-ra-list");
export const insertTaskbasedRAListItem = create("hira-and-opportunities/task-based-ra-list");
export const insertSOP = create("hira-and-opportunities/sop");
export const insertSWP = create("hira-and-opportunities/swp");

// Claims
export const insertClaimsClient = create("claims/clients");
export const insertClaimsEmployerDetails = create("claims/clients/employer-details");
export const insertWCL2 = create("claims/clients/wcl2");
export const insertWCL4 = create("claims/clients/wcl4");
export const insertWCL5 = create("claims/clients/wcl5");
export const insertWCL5Proxy = create("claims/clients/wcl5-proxy");
export const insertWCL6 = create("claims/clients/wcl6");
export const insertAnnexture1 = create("claims/clients/annexture1");

// Trainings
export const insertTrainingCourse = create("trainings/courses");
export const insertTrainingToolboxTalk = create("TrainingToolboxTalk");
export const insertProxyJobCategoryTrainingMatrix = create("ProxyJobCategoryTrainingMatrix");
export const insertProxyJobPositionTrainingMatrix = create("ProxyJobPositionTrainingMatrix");
export const insertProxySectorTrainingMatrix = create("ProxySectorTrainingMatrix");
