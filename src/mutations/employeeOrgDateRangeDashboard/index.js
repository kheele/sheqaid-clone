/* eslint-disable camelcase */

const dashboard = (path, overridePath) => async (id) => {
    const monStart = new Date().addMonths(path === "expenses" ? -12 : -4);
    const monEnd = path === "expenses" ? new Date() : new Date().addMonths(12);

    let evt;
    if (!overridePath) {
        evt = `employees/docs/${path}`;
    } else {
        evt = path;
    }

    try {
        const findDashboard = sockets.of(`${evt}/dashboard`).fn('date-range');
        return findDashboard({monStart, monEnd}).then(res => {
            console.log('employeeOrgDateRangeDashboard', path, res);
            return res;
        });
    } catch (err) {
        throw err;
    }
};

//HR
export const findByIdOrgCompetenciesDateRangeDashboardStatsByLogged = dashboard("competencies");
export const findByIdOrgContractsDateRangeDashboardStatsByLogged = dashboard("contracts");
export const findByIdOrgCounselingsDateRangeDashboardStatsByLogged = dashboard("counsellings");
export const findByIdOrgJobAppointmentsDateRangeDashboardStatsByLogged = dashboard("structure-and-responsibility/job-appointments", true);
export const findByIdOrgLeavesDateRangeDashboardStatsByLogged = dashboard("leaves");
export const findByIdOrgLicensesDateRangeDashboardStatsByLogged = dashboard("licenses");
export const findByIdOrgMedicalsDateRangeDashboardStatsByLogged = dashboard("medicals");
export const findByIdOrgWarningsDateRangeDashboardStatsByLogged = dashboard("warnings");
export const findByIdOrgWorkPermitsDateRangeDashboardStatsByLogged = dashboard("work-permits");
export const findByIdOrgPrDPDateRangeDashboardStatsByLogged = dashboard("employees/documents/prdp", true);
export const findByIdOrgIDOrPassportDateRangeDashboardStatsByLogged = dashboard("employees/documents/id-or-passports", true);
export const findByIdOrgExpensesDateRangeDashboardStatsByLogged = dashboard("expenses");
