import listAllAuditByLoggedImpl from "./listAllAuditByLoggedImpl";

export const byCompany = (
    {
        company_id,
        scope,
        type,
    }
) => {
    return listAllAuditByLoggedImpl({
        org_id: {key: 'company_id', value: company_id},
        scope,
        type,
    });
};

export const byClient = (
    {
        client_id,
        scope,
        type,
    }
) => {
    return listAllAuditByLoggedImpl({
        org_id: {key: 'client_id', value: client_id},
        scope,
        type,
    });
};

export const byProject = (
    {
        project_id,
        scope,
        type,
    }
) => {
    return listAllAuditByLoggedImpl({
        org_id: {key: 'project_id', value: project_id},
        scope,
        type,
    });
};

export const bySite = (
    {
        site_id,
        scope,
        type,
    }
) => {
    return listAllAuditByLoggedImpl({
        org_id: {key: 'site_id', value: site_id},
        scope,
        type,
    });
};