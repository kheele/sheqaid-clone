/* eslint-disable camelcase */

const upsert = path => async (attrs) => {
    try {
        const {upsert} = sockets.of(path);
        return await upsert(attrs);
    } catch (err) {
        throw err;
    }
};

//Assets
export const upsertAssetCalibrationRecord = upsert("assets/calibration-records");
export const upsertAssetCalibrationRecordListItem = upsert("assets/calibration-record-list");
export const upsertAssetDoc = upsert("assets/docs");
export const upsertAssetMaintenancePlan = upsert("assets/maintenance-plans");
export const upsertAssetMaintenancePlanListItem = upsert("assets/maintenance-plan-list");
export const upsertAssetMonitoringPlanFuelUsageListItem = upsert("assets/monitoring-plan-fuel-usage-list");
export const upsertAssetMonitoringPlanWorkingHrsOrKmListItem = upsert("assets/monitoring-plan-working-hrs-or-km-list");
export const upsertAssetDepreciation = upsert("assets/depreciation");
export const upsertAssetDetails = upsert("assets/details");
export const upsertAssetPhoto = upsert("assets/photos");
export const upsertAssetPurchaseInfo = upsert("assets/purchase-info");

//
export const upsertPermissionOther = upsert("permissions/others");
export const upsertPermissionModule = upsert("permissions/modules");
export const upsertNotificationSetting = upsert("notification-settings");
