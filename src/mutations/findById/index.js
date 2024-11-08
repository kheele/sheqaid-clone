/* eslint-disable camelcase */

const findById = path => async (id) => {
    try {
        const {findById} = sockets.of(path);
        return await findById(id);
    } catch (err) {
        throw err;
    }
};

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
