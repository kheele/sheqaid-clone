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
export const exportExcelPPESuppliers = exportExcel("ppe-suppliers");
export const exportExcelApplicableRegulations = exportExcel("applicable-regulations");
export const exportExcelComplianceRequirements = exportExcel("compliance-requirements");
export const exportExcelJobTaskCategories = exportExcel("job-tasks/categories");
export const exportExcelJobTasks = exportExcel("job-tasks");