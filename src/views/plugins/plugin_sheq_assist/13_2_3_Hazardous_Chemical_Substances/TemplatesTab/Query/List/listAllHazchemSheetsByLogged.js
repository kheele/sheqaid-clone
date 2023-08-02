import listAllHazchemSheetsByLoggedImpl from "./listAllHazchemSheetsByLoggedImpl";

export const byCompany = (
    {
        company_id,
        physical_state,
        type,
    }
) => {
    return listAllHazchemSheetsByLoggedImpl({
        org_id: {key: 'company_id', value: company_id},
        physical_state,
        type,
    });
};

export const byClient = (
    {
        client_id,
        physical_state,
        type,
    }
) => {
    return listAllHazchemSheetsByLoggedImpl({
        org_id: {key: 'client_id', value: client_id},
        physical_state,
        type,
    });
};

export const byProject = (
    {
        project_id,
        physical_state,
        type,
    }
) => {
    return listAllHazchemSheetsByLoggedImpl({
        org_id: {key: 'project_id', value: project_id},
        physical_state,
        type,
    });
};

export const bySite = (
    {
        site_id,
        physical_state,
        type,
    }
) => {
    return listAllHazchemSheetsByLoggedImpl({
        org_id: {key: 'site_id', value: site_id},
        physical_state,
        type,
    });
};