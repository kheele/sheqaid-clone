import listAllInventoryProductsByLoggedImpl from "./listAllInventoryProductsByLoggedImpl";

export const byCompany = (
    {
        company_id,
        physical_state,
        type,
        category,
        risk_level,
        manufacturer,
    }
) => {
    return listAllInventoryProductsByLoggedImpl({
        org_id: {key: 'company_id', value: company_id},
        physical_state,
        type,
        category,
        risk_level,
        manufacturer,
    });
};

export const byClient = (
    {
        client_id,
        physical_state,
        type,
        category,
        risk_level,
        manufacturer,
    }
) => {
    return listAllInventoryProductsByLoggedImpl({
        org_id: {key: 'client_id', value: client_id},
        physical_state,
        type,
        category,
        risk_level,
        manufacturer,
    });
};

export const byProject = (
    {
        project_id,
        physical_state,
        type,
        category,
        risk_level,
        manufacturer,
    }
) => {
    return listAllInventoryProductsByLoggedImpl({
        org_id: {key: 'project_id', value: project_id},
        physical_state,
        type,
        category,
        risk_level,
        manufacturer,
    });
};

export const bySite = (
    {
        site_id,
        physical_state,
        type,
        category,
        risk_level,
        manufacturer,
    }
) => {
    return listAllInventoryProductsByLoggedImpl({
        org_id: {key: 'site_id', value: site_id},
        physical_state,
        type,
        category,
        risk_level,
        manufacturer,
    });
};