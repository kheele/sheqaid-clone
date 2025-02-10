/* eslint-disable camelcase */

import {Dates} from "utils/Dates";

const dashboard = (path, overridePath) => async (id) => {
    const mon = Dates.formatDateSQL(new Date().addMonths(1));
    const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
    const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

    let evt;
    if (!overridePath) {
        evt = `employees/docs/${path}`;
    } else {
        evt = path;
    }

    try {
        const findDashboard = sockets.of(`${evt}/dashboard`).fn('single');
        return await findDashboard({id, mon, mon2, mon3}).then(res => {
            console.log('employeeHRDashboard', path, res);
            return res;
        });
    } catch (err) {
        throw err;
    }
};

//HR
export const findByIdHRCompetenciesDashboardStats = dashboard("competencies");
export const findByIdHRContractsDashboardStats = dashboard("contracts");
export const findByIdHRCounselingsDashboardStats = dashboard("counsellings");
export const findByIdHRJobAppointmentsDashboardStats = dashboard("structure-and-responsibility/job-appointments", true);
export const findByIdHRLeavesDashboardStats = dashboard("leaves");
export const findByIdHRLicensesDashboardStats = dashboard("licenses");
export const findByIdHRMedicalsDashboardStats = dashboard("medicals");
export const findByIdHRWarningsDashboardStats = dashboard("warnings");
export const findByIdHRWorkPermitsDashboardStats = dashboard("work-permits");
export const findByIdHRPrDPDashboardStats = dashboard("employees/documents/prdp", true);
export const findByIdHRIDOrPassportDashboardStats = dashboard("employees/documents/id-or-passports", true);
export const findByIdHRExpensesDashboardStats = dashboard("expenses");
