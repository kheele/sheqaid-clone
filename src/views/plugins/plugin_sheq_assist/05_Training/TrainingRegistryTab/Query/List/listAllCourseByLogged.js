import listAllCourseByLoggedImpl from "./listAllCourseByLoggedImpl";

export const byCompany = (
    {
        offset = 0,
        limit = 50,
        //
        name,
        unit_standard,
        frequency,
        provider,
        job_position_id,
        sector_id,
        company_id,
    }
) => {
    return listAllCourseByLoggedImpl({
        offset,
        limit,
        //
        name,
        unit_standard,
        frequency,
        provider,
        job_position_id,
        sector_id,
        org_id: {key: 'company_id', value: company_id},
    });
};

export const byClient = (
    {
        offset = 0,
        limit = 50,
        //
        name,
        unit_standard,
        frequency,
        provider,
        job_position_id,
        sector_id,
        client_id,
    }
) => {
    return listAllCourseByLoggedImpl({
        offset,
        limit,
        //
        name,
        unit_standard,
        frequency,
        provider,
        job_position_id,
        sector_id,
        org_id: {key: 'client_id', value: client_id},
    });
};

export const byProject = (
    {
        offset = 0,
        limit = 50,
        //
        name,
        unit_standard,
        frequency,
        provider,
        job_position_id,
        sector_id,
        project_id,
    }
) => {
    return listAllCourseByLoggedImpl({
        offset,
        limit,
        //
        name,
        unit_standard,
        frequency,
        provider,
        job_position_id,
        sector_id,
        org_id: {key: 'project_id', value: project_id},
    });
};

export const bySite = (
    {
        offset = 0,
        limit = 50,
        //
        name,
        unit_standard,
        frequency,
        provider,
        job_position_id,
        sector_id,
        site_id,
    }
) => {
    return listAllCourseByLoggedImpl({
        offset,
        limit,
        //
        name,
        unit_standard,
        frequency,
        provider,
        job_position_id,
        sector_id,
        org_id: {key: 'site_id', value: site_id},
    });
};