/* eslint-disable camelcase */

const update = path => async (attrs) => {
    try {
        const {update} = sockets.of(path);
        return await update(attrs);
    } catch (err) {
        throw err;
    }
};

export const updateIncident = update("incidents");

export const updateProxyNCRAssignedPerson = update("ncr/proxy/assigned-person");
export const updateProxyNCRAssignedJobPosition = update("ncr/proxy/assigned-job-position");
export const updateProxyNCRAssignedUser = update("ncr/proxy/assigned-user");
export const updateProxyNCRApprovingPerson = update("ncr/proxy/approving-person");
export const updateProxyNCRResponsibleParty = update("ncr/proxy/responsible-party");
export const updateProxyNCRDocument = update("ncr/proxy/document");

export const updateOHSDoc = update("documents/ohs-docs");
export const updateSignableDocTemplate = update("doc-signing-settings/api/docuseal/templates");