/* eslint-disable camelcase */

const listByLogged = (path) => async (args) => {
    try {
        const socket = sockets.of(path);
        return await socket.listByLogged(args);
    } catch (err) {
        throw err;
    }
};

export default listByLogged;

//General
export const listAuditLogs = listByLogged("audit-logs");

//General
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
