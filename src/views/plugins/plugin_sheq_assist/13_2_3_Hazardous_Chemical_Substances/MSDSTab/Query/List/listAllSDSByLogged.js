import listAllSDSByLoggedImpl from "./listAllSDSByLoggedImpl";

export const byCompany = (
    {
        company_id,
        category,
        risk_level,
        manufacturer,
    }
) => {
    return listAllSDSByLoggedImpl({
        org_id: {key: 'company_id', value: company_id},
        category,
        risk_level,
        manufacturer,
    });
};

export const byClient = (
    {
        client_id,
        category,
        risk_level,
        manufacturer,
    }
) => {
    return listAllSDSByLoggedImpl({
        org_id: {key: 'client_id', value: client_id},
        category,
        risk_level,
        manufacturer,
    });
};

export const byProject = (
    {
        project_id,
        category,
        risk_level,
        manufacturer,
    }
) => {
    return listAllSDSByLoggedImpl({
        org_id: {key: 'project_id', value: project_id},
        category,
        risk_level,
        manufacturer,
    });
};

export const bySite = (
    {
        site_id,
        category,
        risk_level,
        manufacturer,
    }
) => {
    return listAllSDSByLoggedImpl({
        org_id: {key: 'site_id', value: site_id},
        category,
        risk_level,
        manufacturer,
    });
};