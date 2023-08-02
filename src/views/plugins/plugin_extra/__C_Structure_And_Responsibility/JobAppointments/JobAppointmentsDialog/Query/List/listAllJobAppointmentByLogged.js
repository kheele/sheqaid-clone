import listAllJobAppointmentByLoggedImpl from "./listAllJobAppointmentByLoggedImpl";

export const byCompany = (
    {
        view = 'Employee',
        mon, mon2, mon3,
        expiry_date = 'ALL',
        removed = false,
        company_id,
    }
) => {
    return listAllJobAppointmentByLoggedImpl({
        view,
        mon, mon2, mon3,
        expiry_date,
        removed,
        org_id: {key: 'company_id', value: company_id},
    });
};

export const byClient = (
    {
        view = 'Employee',
        mon, mon2, mon3,
        expiry_date = 'ALL',
        removed = false,
        client_id,
    }
) => {
    return listAllJobAppointmentByLoggedImpl({
        view,
        mon, mon2, mon3,
        expiry_date,
        removed,
        org_id: {key: 'client_id', value: client_id},
    });
};

export const byProject = (
    {
        view = 'Employee',
        mon, mon2, mon3,
        expiry_date = 'ALL',
        removed = false,
        project_id,
    }
) => {
    return listAllJobAppointmentByLoggedImpl({
        view,
        mon, mon2, mon3,
        expiry_date,
        removed,
        org_id: {key: 'project_id', value: project_id},
    });
};

export const bySite = (
    {
        view = 'Employee',
        mon, mon2, mon3,
        expiry_date = 'ALL',
        removed = false,
        site_id,
    }
) => {
    return listAllJobAppointmentByLoggedImpl({
        view,
        mon, mon2, mon3,
        expiry_date,
        removed,
        org_id: {key: 'site_id', value: site_id},
    });
};