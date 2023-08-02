import listAllTrainingMatrixByLoggedImpl from "./listAllTrainingMatrixByLoggedImpl";

export const byCompany = (
    {
        offset = 0,
        limit = 50,
        //
        job_position_id,
        trainer_id,
        course_id,
        unit_standard,
        provider_requirement,
        requirement,
        status,
        company_id,
    }
) => {
    return listAllTrainingMatrixByLoggedImpl({
        offset,
        limit,
        //
        job_position_id,
        trainer_id,
        course_id,
        unit_standard,
        provider_requirement,
        requirement,
        status,
        org_id: {key: 'company_id', value: company_id},
    });
};

export const byClient = (
    {
        offset = 0,
        limit = 50,
        //
        job_position_id,
        trainer_id,
        course_id,
        unit_standard,
        provider_requirement,
        requirement,
        status,
        client_id,
    }
) => {
    return listAllTrainingMatrixByLoggedImpl({
        offset,
        limit,
        //
        job_position_id,
        trainer_id,
        course_id,
        unit_standard,
        provider_requirement,
        requirement,
        status,
        org_id: {key: 'client_id', value: client_id},
    });
};

export const byProject = (
    {
        offset = 0,
        limit = 50,
        //
        job_position_id,
        trainer_id,
        course_id,
        unit_standard,
        provider_requirement,
        requirement,
        status,
        project_id,
    }
) => {
    return listAllTrainingMatrixByLoggedImpl({
        offset,
        limit,
        //
        job_position_id,
        trainer_id,
        course_id,
        unit_standard,
        provider_requirement,
        requirement,
        status,
        org_id: {key: 'project_id', value: project_id},
    });
};

export const bySite = (
    {
        offset = 0,
        limit = 50,
        //
        job_position_id,
        trainer_id,
        course_id,
        unit_standard,
        provider_requirement,
        requirement,
        status,
        site_id,
    }
) => {
    return listAllTrainingMatrixByLoggedImpl({
        offset,
        limit,
        //
        job_position_id,
        trainer_id,
        course_id,
        unit_standard,
        provider_requirement,
        requirement,
        status,
        org_id: {key: 'site_id', value: site_id},
    });
};