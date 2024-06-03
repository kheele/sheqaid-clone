/* eslint-disable camelcase */

const findById = path => async (id) => {
    try{
        const {findById} = sockets.of(path);
        return await findById(id);
    } catch(err) {
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
