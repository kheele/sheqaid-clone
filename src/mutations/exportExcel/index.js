/* eslint-disable camelcase */

const exportExcel = path => async (args) => {
    try {
        const socket = sockets.of(path);
        return await socket.exportExcel(args);
    } catch (err) {
        throw err;
    }
};

//Assets
export const exportExcelAssets = exportExcel("assets");
export const exportExcelAssetDocs = exportExcel("assets/docs");

// HR
export const exportExcelEmployees = exportExcel("employees");
export const exportExcelPPESuppliers = exportExcel("ppe-suppliers");
export const exportExcelApplicableRegulations = exportExcel("applicable-regulations");
export const exportExcelComplianceRequirements = exportExcel("compliance-requirements");
export const exportExcelJobTaskCategories = exportExcel("job-tasks/categories");
export const exportExcelJobTasks = exportExcel("job-tasks");
export const exportExcelPPERequisitions = exportExcel("ppe-requisitions");

export const exportExcelEmployeeCompetencies = exportExcel("employees/docs/competencies");
export const exportExcelEmployeeContracts = exportExcel("employees/docs/contracts");
export const exportExcelEmployeeCounselling = exportExcel("employees/docs/counsellings");
export const exportExcelEmployeeExpenses = exportExcel("employees/docs/expenses");
export const exportExcelEmployeeJobAppointments = exportExcel("structure-and-responsibility/job-appointments");
export const exportExcelEmployeeMedicals = exportExcel("employees/docs/medicals");
export const exportExcelEmployeeWarnings = exportExcel("employees/docs/warnings");
export const exportExcelEmployeeLicenses = exportExcel("employees/docs/licenses");
export const exportExcelEmployeeWorkPermits = exportExcel("employees/docs/work-permits");
export const exportExcelEmployeeDocDocumentIDOrPassports = exportExcel("employees/documents/id-or-passports");
export const exportExcelEmployeeDocDocumentPrDPs = exportExcel("employees/documents/prdp");

export const exportExcelEmployeeLeaves = exportExcel("employees/docs/leaves");
export const exportExcelEmployeeLeaveTypes = exportExcel("employees/docs/leaves/types");
export const exportExcelEmployeeLeavePolicies = exportExcel("employees/docs/leaves/policies");
export const exportExcelEmployeeLeaveAllocations = exportExcel("employees/docs/leaves/allocations");

//Incidents
export const exportExcelIncidents = exportExcel("incidents");
export const exportExcelIncidentInvestigations = exportExcel("incidents/investigations");
export const exportExcelQuickIncidents = exportExcel("incidents-quick");

