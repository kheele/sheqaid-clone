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
export const updateContractorUser = update("contractors/users");
export const updateClient = update("clients");
export const updateProject = update("projects");
export const updateSite = update("sites");
export const updateContractor = update("contractors");
export const updateSector = update("sectors");

export const sendOTPContractor = update("contractors/otp");

//Assets
export const updateAsset = update("assets");

//Audits
export const updateAudit = update("audits");
export const updateAuditDefinition = update("audits/definitions");
export const updateAuditItem = update("audits/items");
export const updateProxyEmployeeAuditor = update("audits/ProxyEmployeeAuditor");
export const updateProxyEmployeeAuditRepresentative = update("audits/ProxyEmployeeAuditRepresentative");

// Incidents
export const updateIncident = update("incidents");
export const updateIncidentCauseAnalysis = update("IncidentCauseAnalysis");
export const updateIncidentCauseAnalysisCause = update("IncidentCauseAnalysisCause");
export const updateIncidentCauseAnalysisImmediate = update("IncidentCauseAnalysisImmediate");
export const updateIncidentCauseAnalysisRoot = update("IncidentCauseAnalysisRoot");
export const updateIncidentCorrectiveAction = update("IncidentCorrectiveAction");
export const updateIncidentDocument = update("IncidentDocument");
export const updateIncidentInvestigation = update("IncidentInvestigation");
export const updateIncidentSeverity = update("IncidentSeverity");
export const updateIncidentTestType = update("IncidentTestType");
export const updateIncidentVehicle = update("IncidentVehicle");
export const updateInvestigationDocument = update("InvestigationDocument");
export const updateInvestigationFinding = update("InvestigationFinding");
export const updateProxyEmployeeIncidentInvestigator = update("ProxyEmployeeIncidentInvestigator");
export const updateProxyIncidentActivity = update("incidents/proxy/activities");
export const updateProxyIncidentCategory = update("incidents/proxy/categories");
export const updateProxyIncidentDistribution = update("incidents/proxy/distributions");
export const updateProxyIncidentInjuryList = update("incidents/proxy/injuries");
export const updateProxyIncidentPersonInvolved = update("incidents/proxy/persons-involved");
export const updateProxyIncidentSector = update("incidents/proxy/sectors");
export const updateProxyIncidentSubCategory = update("incidents/proxy/sub-categories");
export const updateProxyIncidentWitness = update("incidents/proxy/witnesses");

//NCR
export const updateNCR = update("ncr");
export const updateNCRProgress = update("ncr/progress");

export const updateProxyNCRAssignedPerson = update("ncr/proxy/assigned-person");
export const updateProxyNCRAssignedJobPosition = update("ncr/proxy/assigned-job-position");
export const updateProxyNCRAssignedUser = update("ncr/proxy/assigned-user");
export const updateProxyNCRApprovingPerson = update("ncr/proxy/approving-person");
export const updateProxyNCRResponsibleParty = update("ncr/proxy/responsible-party");
export const updateProxyNCRDocument = update("ncr/proxy/document");

//Chemicals
export const updateChemicalProduct = update("chemicals/products");
export const updateChemicalHazchemsheet = update("chemicals/hazchem-sheets");
export const updateChemicalSDS = update("chemicals/sds");
export const updateChemicalSupplier = update("chemicals/suppliers");

//Documents
export const updateDocument = update("documents");
export const updateOHSDoc = update("documents/ohs-docs");
export const updateSignableDocTemplate = update("doc-signing-settings/api/docuseal/templates");

//HR
export const updateDepartment = update("departments");
export const updateJobCategory = update("job-categories");
export const updateJobPosition = update("job-positions");
export const updateTeam = update("teams");

export const updatePPESupplier = update("ppe-suppliers");
export const updatePPE = update("ppe-types");
export const updatePPEInventory = update("ppe-inventory");
export const updatePPEItem = update("ppe-items");
export const updatePPEDisposal = update("ppe-disposals");
export const updatePPEFitTest = update("ppe-fit-tests");
export const updatePPEReturn = update("ppe-returns");
export const updatePPERequisition = update("ppe-requisitions");
export const updateApplicableRegulation = update("applicable-regulations");
export const updateComplianceRequirement = update("compliance-requirements");
export const updateJobTaskCategory = update("job-tasks/categories");
export const updateJobTask = update("job-tasks");

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

//
export const updateOrganogram = update("structure-and-responsibility/organograms");

// Contractors
export const updateProxyContractorSite = update("ProxyContractorSite");
export const updateContractorsQuestionnaireLibrary = update("ContractorsQuestionnaireLibrary");
export const updateContractorsQuestionnaire = update("ContractorsQuestionnaire");
export const updateInspectionsQuestionnaire = update("InspectionsQuestionnaire");
export const updateInspectionsQuestionnaireTemplate = update("InspectionsQuestionnaireTemplate");
export const updateJobObservationsQuestionnaireTemplate = update("JobObservationsQuestionnaireTemplate");
export const updateQuestionNotifiedList = update("QuestionNotifiedList");
export const updateSafetyFilesQuestionnaire = update("SafetyFilesQuestionnaire");
export const updateSafetyFilesQuestionnaireTemplate = update("SafetyFilesQuestionnaireTemplate");

//Questionnaires
export const updateQuestionnaire = update("questionnaires");
export const updateQuestion = update("questionnaires/questions");
export const updateQuestionOption = update("questionnaires/question-options");
export const updateJobObservationsQuestionnaire = update("job-observations");

//HIRA
export const updateBaselineRA = update("hira-and-opportunities/baseline-ra");
export const updateTaskbasedRA = update("hira-and-opportunities/task-based-ra");
export const updateBaselineRAListItem = update("hira-and-opportunities/baseline-ra-list");
export const updateTaskbasedRAListItem = update("hira-and-opportunities/task-based-ra-list");
export const updateSOP = update("hira-and-opportunities/sop");
export const updateSWP = update("hira-and-opportunities/swp");

// Claims
export const updateClaimsClient = update("ClaimsClient");
export const updateClaimsEmployerDetails = update("ClaimsEmployerDetails");
export const updateClaimsProviderMessage = update("ClaimsProviderMessage");
export const updateWCL2 = update("WCL2");
export const updateWCL4 = update("WCL4");
export const updateWCL5 = update("WCL5");
export const updateWCL5Proxy = update("WCL5Proxy");
export const updateWCL6 = update("WCL6");
export const updateAnnexture1 = update("Annexture1");

// Trainings
export const updateTrainingManual = update("trainings/manuals");
export const updateTrainingToolboxTalk = update("trainings/toolbox-talks");
export const updateProxyJobCategoryTrainingMatrix = update("ProxyJobCategoryTrainingMatrix");
export const updateProxyJobPositionTrainingCourse = update("ProxyJobPositionTrainingCourse");
export const updateProxyJobPositionTrainingMatrix = update("ProxyJobPositionTrainingMatrix");
export const updateProxySectorTrainingCourse = update("ProxySectorTrainingCourse");
export const updateProxySectorTrainingMatrix = update("ProxySectorTrainingMatrix");
