/* eslint-disable camelcase */

const findById = path => async (id) => {
    try {
        const {findById} = sockets.of(path);
        return await findById(id);
    } catch (err) {
        throw err;
    }
};

//General
export const findByIdManual = findById("manuals");

//Assets
export const findByIdAsset = findById("assets");
export const findByIdAssetCalibrationRecordListItem = findById("assets/calibration-record-list");
export const findByIdAssetDepreciation = findById("assets/depreciation");
export const findByIdAssetDetails = findById("assets/details");
export const findByIdAssetDoc = findById("assets/docs");
export const findByIdAssetMaintenancePlanListItem = findById("assets/maintenance-plan-list");
export const findByIdAssetMonitoringPlanFuelUsageListItem = findById("assets/monitoring-plan-fuel-usage-list");
export const findByIdAssetMonitoringPlanWorkingHrsOrKmListItem = findById("assets/monitoring-plan-working-hrs-or-km-list");
export const findByIdAssetPurchaseInfo = findById("assets/purchase-info");

//Incidents
export const findByIdIncident = findById("incidents");

export const findByIdProxyNCRAssignedPerson = findById("ncr/proxy/assigned-person");
export const findByIdProxyNCRAssignedJobPosition = findById("ncr/proxy/assigned-job-position");
export const findByIdProxyNCRAssignedUser = findById("ncr/proxy/assigned-user");
export const findByIdProxyNCRApprovingPerson = findById("ncr/proxy/approving-person");
export const findByIdProxyNCRResponsibleParty = findById("ncr/proxy/responsible-party");
export const findByIdProxyNCRDocument = findById("ncr/proxy/document");

export const findByIdOHSDoc = findById("documents/ohs-docs");
export const findByIdSignableDoc = findById("doc-signing-settings/api/docuseal/templates");

export const findByIdCompany = findById("companies");
export const findByIdClient = findById("clients");
export const findByIdProject = findById("projects");
export const findByIdSite = findById("sites");
export const findByIdContractor = findById("contractors");
export const findByIdContractorSite = findById("contractors/sites");

export const findByIdEmployeeCompetency = findById("employees/docs/competencies");
