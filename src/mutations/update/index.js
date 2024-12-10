/* eslint-disable camelcase */

const update = path => async (attrs) => {
    try {
        const {update} = sockets.of(path);
        return await update(attrs);
    } catch (err) {
        throw err;
    }
};

//General
export const updateUser = update("users");
export const updateClient = update("clients");
export const updateProject = update("projects");
export const updateSector = update("sectors");
export const updateSite = update("sites");

//Assets
export const updateAsset = update("assets");

export const updateIncident = update("incidents");

export const updateProxyNCRAssignedPerson = update("ncr/proxy/assigned-person");
export const updateProxyNCRAssignedJobPosition = update("ncr/proxy/assigned-job-position");
export const updateProxyNCRAssignedUser = update("ncr/proxy/assigned-user");
export const updateProxyNCRApprovingPerson = update("ncr/proxy/approving-person");
export const updateProxyNCRResponsibleParty = update("ncr/proxy/responsible-party");
export const updateProxyNCRDocument = update("ncr/proxy/document");

export const updateOHSDoc = update("documents/ohs-docs");
export const updateSignableDocTemplate = update("doc-signing-settings/api/docuseal/templates");
export const updateContractor = update("contractors");

//HR
export const updateDepartment = update("departments");
export const updateJobCategory = update("job-categories");
export const updateJobPosition = update("job-positions");
export const updateTeam = update("teams");
export const updatePPE = update("ppe-types");
export const updatePPEItem = update("ppe-items");
