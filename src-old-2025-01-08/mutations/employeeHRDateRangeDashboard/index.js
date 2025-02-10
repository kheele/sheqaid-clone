/* eslint-disable camelcase */

const dashboard = (path, overridePath) => async (id) => {
    const monStart = new Date().addMonths(-4);
    const monEnd = new Date().addMonths(12);

    let evt;
    if (!overridePath) {
        evt = `employees/docs/${path}`;
    } else {
        evt = path;
    }

    try {
        const findDashboard = sockets.of(`${evt}/dashboard/date-range`).fn('single');
        return findDashboard({id, monStart, monEnd}).then(res => {
            console.log('employeeHRDateRangeDashboard', path, res);
            return res;
        });
    } catch (err) {
        throw err;
    }
};

//HR
export const findByIdHRCompetenciesDateRangeDashboardStats = dashboard("competencies");
export const findByIdHRContractsDateRangeDashboardStats = dashboard("contracts");
export const findByIdHRCounselingsDateRangeDashboardStats = dashboard("counsellings");
export const findByIdHRJobAppointmentsDateRangeDashboardStats = dashboard("structure-and-responsibility/job-appointments", true);
export const findByIdHRLeavesDateRangeDashboardStats = dashboard("leaves");
export const findByIdHRLicensesDateRangeDashboardStats = dashboard("licenses");
export const findByIdHRMedicalsDateRangeDashboardStats = dashboard("medicals");
export const findByIdHRWarningsDateRangeDashboardStats = dashboard("warnings");
export const findByIdHRWorkPermitsDateRangeDashboardStats = dashboard("work-permits");
export const findByIdHRPrDPDateRangeDashboardStats = dashboard("employees/documents/prdp", true);
export const findByIdHRIDOrPassportDateRangeDashboardStats = dashboard("employees/documents/id-or-passports", true);
export const findByIdHRExpensesDateRangeDashboardStats = dashboard("expenses");
