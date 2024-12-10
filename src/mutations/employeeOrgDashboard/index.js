/* eslint-disable camelcase */

import {Dates} from "utils/Dates";

const dashboard = (path, overridePath) => async (id) => {
    const args = {};

    if (path !== "expenses") {
        args.mon = Dates.formatDateSQL(new Date().addMonths(1));
        args.mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        args.mon3 = Dates.formatDateSQL(new Date().addMonths(3));
    }

    let evt;
    if (!overridePath) {
        evt = `employees/docs/${path}`;
    } else {
        evt = path;
    }

    try {
        const findDashboard = sockets.of(evt).fn('dashboard');
        return await findDashboard(args).then(res => {
            console.log('employeeOrgDashboard', evt, res);
            return res;
        });
    } catch (err) {
        throw err;
    }
};

//HR
export const findByIdOrgDashboardStatsByLogged = dashboard("employees", true);

export const findByIdOrgCompetenciesDashboardStatsByLogged = dashboard("competencies");
export const findByIdOrgContractsDashboardStatsByLogged = dashboard("contracts");
export const findByIdOrgCounselingsDashboardStatsByLogged = dashboard("counsellings");
export const findByIdOrgJobAppointmentsDashboardStatsByLogged = dashboard("structure-and-responsibility/job-appointments", true);
export const findByIdOrgLeavesDashboardStatsByLogged = dashboard("leaves");
export const findByIdOrgLicensesDashboardStatsByLogged = dashboard("licenses");
export const findByIdOrgMedicalsDashboardStatsByLogged = dashboard("medicals");
export const findByIdOrgWarningsDashboardStatsByLogged = dashboard("warnings");
export const findByIdOrgWorkPermitsDashboardStatsByLogged = dashboard("work-permits");
export const findByIdOrgPrDPDashboardStatsByLogged = dashboard("employees/documents/prdp", true);
export const findByIdOrgIDOrPassportDashboardStatsByLogged = dashboard("employees/documents/id-or-passports", true);
export const findByIdOrgExpensesDashboardStatsByLogged = dashboard("expenses");
