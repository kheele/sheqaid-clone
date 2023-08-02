import listAllTrainingRegisterByLoggedImpl from "./listAllTrainingRegisterByLoggedImpl";

export const byCompany = (
    {
        offset = 0,
        limit = 50,
        //
        job_position_id,
        trainer_id,
        course_id,
        unit_standard,
        date,
        company_id,
    }
) => {
    return listAllTrainingRegisterByLoggedImpl({
        offset,
        limit,
        //
        job_position_id,
        trainer_id,
        course_id,
        unit_standard,
        date,
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
        date,
        client_id,
    }
) => {
    return listAllTrainingRegisterByLoggedImpl({
        offset,
        limit,
        //
        job_position_id,
        trainer_id,
        course_id,
        unit_standard,
        date,
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
        date,
        project_id,
    }
) => {
    return listAllTrainingRegisterByLoggedImpl({
        offset,
        limit,
        //
        job_position_id,
        trainer_id,
        course_id,
        unit_standard,
        date,
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
        date,
        site_id,
    }
) => {
    return listAllTrainingRegisterByLoggedImpl({
        offset,
        limit,
        //
        job_position_id,
        trainer_id,
        course_id,
        unit_standard,
        date,
        org_id: {key: 'site_id', value: site_id},
    });
};