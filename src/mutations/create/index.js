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

//General
export const insertErrorReporting = create("error-reporting", null, input => {
    const {
        error,
        errorInfo,
    } = input;

    input.message = error.message || "";
    input.stack = error.stack || "";
    input.error_info = errorInfo && errorInfo.componentStack || "";

    delete input.error;
    delete input.errorInfo;

    const {is: {isLoggedIn, isConsultant}} = storage;
    if (isLoggedIn) {
        const {loggedUser = {}, selected = {}, loggedContractor} = storage;
        const {access_type, company = {}, user = {}} = loggedUser;
        const {data: user_data = {}} = user;

        const {client, project, site, contractor} = user_data;

        const {selectedClient, selectedProject, selectedSite, selectedContractorSite} = selected;

        input.access_type = access_type;

        input.company_id = company.id;
        if (isConsultant) {
            input.client_id = client && client.id;
            input.project_id = project && project.id;
            input.site_id = site && site.id;

            input.selected_client_id = selectedClient && selectedClient.id;
            input.selected_project_id = selectedProject && selectedProject.id;
            input.selected_site_id = selectedSite && selectedSite.id;
        }
        input.contractor_id = contractor && contractor.id;
        input.logged_contractor_id = loggedContractor && loggedContractor.id;
        input.selected_contractor_site_id = selectedContractorSite && selectedContractorSite.id;

        input.user_id = user && user.id;
    }

    // return onCreate(data).then(res => {
    //     infoDialog.open(<>
    //         <p>Problem successfully reported!</p>
    //         <p>We will fix it as soon as possible.</p>
    //     </>);
    //     infoDialog.close(5000);
    // });
});
export const insertUser = create("users");
export const insertClient = create("clients");
export const insertProject = create("projects");
export const insertSector = create("sectors");
export const insertSite = create("sites");

//Assets
export const insertAsset = create("assets");
export const insertAssetCalibrationRecord = create("assets/calibration-records");
export const insertAssetCalibrationRecordListItem = create("assets/calibration-record-list");
export const insertAssetDepreciation = create("assets/depreciation");
export const insertAssetDetails = create("assets/details");
export const insertAssetDoc = create("assets/docs");
export const insertAssetMaintenancePlan = create("assets/maintenance-plans");
export const insertAssetMaintenancePlanListItem = create("assets/maintenance-plan-list");
export const insertAssetMonitoringPlan = create("assets/monitoring-plans");
export const insertAssetMonitoringPlanFuelUsageListItem = create("assets/monitoring-plan-fuel-usage-list");
export const insertAssetMonitoringPlanWorkingHrsOrKmListItem = create("assets/monitoring-plan-working-hrs-or-km-list");
export const insertAssetPhoto = create("assets/photos");
export const insertAssetPurchaseInfo = create("assets/purchase-info");
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

//HR
export const insertDepartment = create("departments");
export const insertJobCategory = create("job-categories");
export const insertJobPosition = create("job-positions");
export const insertTeam = create("teams");
export const insertPPE = create("ppe-types");
export const insertPPEItem = create("ppe-items");

//151