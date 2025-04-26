/* eslint-disable camelcase */

const _delete = path => async (id) => {
    try {
        const {delete: _delete} = sockets.of(path);
        return await _delete(id);
    } catch (err) {
        throw err;
    }
};

//General
export const deleteProxySectorClient = _delete("sectors/proxy/clients");

//Assets
export const deleteAssetCalibrationRecordListItem = _delete("assets/calibration-record-list");
export const deleteAssetMaintenancePlanListItem = _delete("assets/maintenance-plan-list");
export const deleteAssetMonitoringPlanFuelUsageListItem = _delete("assets/monitoring-plan-fuel-usage-list");
export const deleteAssetMonitoringPlanWorkingHrsOrKmListItem = _delete("assets/monitoring-plan-working-hrs-or-km-list");
export const deleteAssets = _delete("assets");

//Audits
export const deleteAuditDefinition = _delete("audits/definitions");
export const deleteAuditItem = _delete("audits/items");

//Incidents
export const deleteIncident = _delete("incidents");

//NCR
export const deleteNCRProgress = _delete("ncr/progress");

export const deleteProxyNCRAssignedPerson = _delete("ncr/proxy/assigned-person");
export const deleteProxyNCRAssignedJobPosition = _delete("ncr/proxy/assigned-job-position");
export const deleteProxyNCRAssignedUser = _delete("ncr/proxy/assigned-user");
export const deleteProxyNCRApprovingPerson = _delete("ncr/proxy/approving-person");
export const deleteProxyNCRResponsibleParty = _delete("ncr/proxy/responsible-party");
export const deleteProxyNCRDocument = _delete("ncr/proxy/document");

//Chemicals
export const deleteChemicalSupplier = _delete("chemicals/suppliers");

export const deleteOHSDoc = _delete("documents/ohs-docs");
export const deleteSettings = _delete("settings");
export const deleteNotificationSettings = _delete("notification-settings");

//