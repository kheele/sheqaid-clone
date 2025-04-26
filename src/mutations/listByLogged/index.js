/* eslint-disable camelcase */

const listByLogged = (path) => async (args) => {
    try {
        const socket = sockets.of(path);
        return await socket.listByLogged(args).then((res) => {
            console.log('onLoadList(', path, ') res:', res)
            return res;
        });
    } catch (err) {
        throw err;
    }
};

export default listByLogged;

//General
export const listAuditLogs = listByLogged("audit-logs");

//Orgs
export const listClients = listByLogged("clients");
export const listProjects = listByLogged("projects");
export const listSites = listByLogged("sites");
export const listSectors = listByLogged("sectors");

//Assets
export const listAssets = listByLogged("assets");
export const listAssetCalibrationRecords = listByLogged("assets/calibration-records");
export const listAssetDocs = listByLogged("assets/docs");
export const listAssetMaintenancePlans = listByLogged("assets/maintenance-plans");
export const listAssetMonitoringPlans = listByLogged("assets/monitoring-plans");
export const listAssetRegisters = listByLogged("assets/registers");

//HR
export const listDepartment = listByLogged("departments");
export const listJobCategory = listByLogged("job-categories");
export const listJobPosition = listByLogged("job-positions");
export const listTeam = listByLogged("teams");

export const listPPEInventory = listByLogged("ppe-inventory");
export const listPPEItems = listByLogged("ppe-items");
export const listPPESuppliers = listByLogged("ppe-suppliers");
export const listPPETypes = listByLogged("ppe-types");
export const listPPEDisposals = listByLogged("ppe-disposals");
export const listPPEFitTests = listByLogged("ppe-fit-tests");
export const listPPEReturns = listByLogged("ppe-returns");
export const listPPERequisitions = listByLogged("ppe-requisitions");
export const listApplicableRegulations = listByLogged("applicable-regulations");
export const listComplianceRequirements = listByLogged("compliance-requirements");
export const listJobTaskCategories = listByLogged("job-tasks/categories");
export const listJobTasks = listByLogged("job-tasks");

export const listEmployee = listByLogged("employees");
export const listEmployeeExternal = listByLogged("employees-external");
export const listEmployeeCompetency = listByLogged("employees/docs/competencies");
export const listEmployeeContract = listByLogged("employees/docs/contracts");
export const listEmployeeCounselling = listByLogged("employees/docs/counsellings");
export const listEmployeeExpense = listByLogged("employees/docs/expenses");
export const listEmployeeJobAppointment = listByLogged("structure-and-responsibility/job-appointments");
export const listEmployeeLeave = listByLogged("employees/docs/leaves");
export const listEmployeeMedical = listByLogged("employees/docs/medicals");
export const listEmployeeWarning = listByLogged("employees/docs/warnings");

export const listEmployeeLicense = listByLogged("employees/docs/licenses");
export const listEmployeePrDP = listByLogged("employees/documents/prdp");
export const listEmployeeIDOrPassport = listByLogged("employees/documents/id-or-passports");
export const listEmployeeWorkPermit = listByLogged("employees/docs/work-permits");

//Incidents
export const listIncidents = listByLogged("incidents");
export const listIncidentInvestigations = listByLogged("incidents/investigations");
export const listQuickIncidents = listByLogged("incidents-quick");
//
//Training
export const listTrainingCourses = listByLogged("trainings/courses");

