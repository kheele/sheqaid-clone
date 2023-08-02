import findByIdTrainingDashboardStatsByLoggedImpl from "./findByIdTrainingDashboardStatsByLoggedImpl";

export const byCompany = (
    {
        interval = 'Month',
        employee_view = 'active',
        range_start = '- All -',
        range_end = '- All -',
        id,
    }
) => {
    return findByIdTrainingDashboardStatsByLoggedImpl({
        interval, employee_view, range_start, range_end,
        org_props: {tbl: 'default_companies', id},
    });
};

export const byClient = (
    {
        interval = 'Month',
        employee_view = 'active',
        range_start = '- All -',
        range_end = '- All -',
        id,
    }
) => {
    return findByIdTrainingDashboardStatsByLoggedImpl({
        interval, employee_view, range_start, range_end,
        org_props: {tbl: 'default_clients', id},
    });
};

export const byProject = (
    {
        interval = 'Month',
        employee_view = 'active',
        range_start = '- All -',
        range_end = '- All -',
        id,
    }
) => {
    return findByIdTrainingDashboardStatsByLoggedImpl({
        interval, employee_view, range_start, range_end,
        org_props: {tbl: 'default_projects', id},
    });
};

export const bySite = (
    {
        interval = 'Month',
        employee_view = 'active',
        range_start = '- All -',
        range_end = '- All -',
        id,
    }
) => {
    return findByIdTrainingDashboardStatsByLoggedImpl({
        interval, employee_view, range_start, range_end,
        org_props: {tbl: 'default_sites', id},
    });
};