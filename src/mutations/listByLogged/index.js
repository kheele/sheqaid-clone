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

//Assets
export const listAssets = listByLogged("assets");
export const listAssetCalibrationRecords = listByLogged("assets/calibration-records");
export const listAssetDocs = listByLogged("assets/docs");
export const listAssetMaintenancePlans = listByLogged("assets/maintenance-plans");
export const listAssetMonitoringPlans = listByLogged("assets/monitoring-plans");
export const listAssetRegisters = listByLogged("assets/registers");

//HR
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
