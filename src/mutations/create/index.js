/* eslint-disable camelcase */

import crudUtils from "../all/CRUDUtils/CRUDUtils";

const create = (path, crudUtils, onProcess) => async (input) => {
    try {
        crudUtils && crudUtils.injectCreate(input);
        onProcess && onProcess(input);

        const {create} = sockets.of(path);
        return await create(input);
    } catch (err) {
        throw err;
    }
};

//Assets
export const insertAsset = create("assets");
export const insertAssetCalibrationRecord = create("assets");
export const insertAssetCalibrationRecordListItem = create("assets");
export const insertAssetDepreciation = create("assets");
export const insertAssetDetails = create("assets");
export const insertAssetDoc = create("assets/docs");
export const insertAssetMaintenancePlan = create("assets");
export const insertAssetMaintenancePlanListItem = create("assets");
export const insertAssetMonitoringPlan = create("assets");
export const insertAssetMonitoringPlanFuelUsageListItem = create("assets");
export const insertAssetMonitoringPlanWorkingHrsOrKmListItem = create("assets");
export const insertAssetPhoto = create("assets");
export const insertAssetPurchaseInfo = create("assets");
export const insertProxyAssetAsset = create("assets");
export const insertAssetRegister = create("assets/registers");

//Incidents
export const insertIncident = create("incidents", crudUtils, input => {
    const {
        //0
        site,
        project,
        client,
        //6.1
        person_involved_list,
        //6.2
        person_reporting,
        person_reporting_other,
        //6.3
        person_reported_to_other,
        //6.4
        witness_list,
        //6.5
        distribution_list,

        //7.1
        person_injured_other,//
    } = input;

    //6
    if (person_involved_list) {
        person_involved_list.data.forEach(({person_involved_other}) => {
            if (person_involved_other) {
                crudUtils.injectCreate(person_involved_other.data);
            }
        });
    }
    if (witness_list) {
        witness_list.data.forEach(({witness_other}) => {
            if (witness_other) {
                crudUtils.injectCreate(witness_other.data);
            }
        });
    }
    if (distribution_list) {
        distribution_list.data.forEach(({other_person}) => {
            if (other_person) {
                crudUtils.injectCreate(other_person.data);
            }
        });
    }

    if (person_reported_to_other && person_reported_to_other.data) {
        crudUtils.injectCreate(person_reported_to_other.data);
    }
    if (person_reporting_other && person_reporting_other.data) {
        crudUtils.injectCreate(person_reporting_other.data);
    }
    if (person_injured_other && person_injured_other.data) {
        crudUtils.injectCreate(person_injured_other.data);
    }
});

export const insertProxyNCRAssignedPerson = create("ncr/proxy/assigned-person");
export const insertProxyNCRAssignedJobPosition = create("ncr/proxy/assigned-job-position");
export const insertProxyNCRAssignedUser = create("ncr/proxy/assigned-user");
export const insertProxyNCRApprovingPerson = create("ncr/proxy/approving-person");
export const insertProxyNCRResponsibleParty = create("ncr/proxy/responsible-party");
export const insertProxyNCRDocument = create("ncr/proxy/document");
// export const insertProxyJobPositionNCRAssignedPerson = create("ncr/proxy/job-position_assigned-person", crudUtils);

export const insertOHSDoc = create("documents/ohs-docs");
export const insertDocument = create("documents");
export const insertSignableDocTemplate = create("doc-signing-settings/api/docuseal/templates");
export const insertSettings = create("settings");
export const insertNotificationSettings = create("notification-settings");
export const insertContractor = create("contractors");
export const insertNCR = create("ncr");

//