/* eslint-disable camelcase */

const listByLogged = path => async (args) => {
    try {
        const socket = sockets.of(path);
        return await socket.listByLogged(args);
    } catch (err) {
        throw err;
    }
};

//Assets
export const listAssets = listByLogged("assets");
export const listAssetCalibrationRecords = listByLogged("assets/calibration-records");
export const listAssetDocs = listByLogged("assets/docs");
export const listAssetMaintenancePlans = listByLogged("assets/maintenance-plans");
export const listAssetMonitoringPlans = listByLogged("assets/monitoring-plans");
export const listAssetRegisters = listByLogged("assets/registers");
