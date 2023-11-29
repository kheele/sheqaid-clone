import AStore from "../AStore";
import listForSelectionEmployeeByLoggedSite from "./listForSelectionEmployeeByLoggedSite";
import listForSelectionEmployeeByLoggedProject from "./listForSelectionEmployeeByLoggedProject";
import listForSelectionEmployeeByLoggedClient from "./listForSelectionEmployeeByLoggedClient";
import listForSelectionEmployeeByLoggedCompany from "./listForSelectionEmployeeByLoggedCompany";
import {Dates} from "utils/Dates";
import findByIdEmployeeHRCompetenciesDashboardStats from "./findByIdEmployeeHRCompetenciesDashboardStats";
import findByIdEmployeeHRContractsDashboardStats from "./findByIdEmployeeHRContractsDashboardStats";
import findByIdEmployeeHRCounselingsDashboardStats from "./findByIdEmployeeHRCounselingsDashboardStats";
import findByIdEmployeeHRLeavesDashboardStats from "./findByIdEmployeeHRLeavesDashboardStats";
import findByIdEmployeeHRLicensesDashboardStats from "./findByIdEmployeeHRLicensesDashboardStats";
import findByIdEmployeeHRMedicalsDashboardStats from "./findByIdEmployeeHRMedicalsDashboardStats";
import findByIdEmployeeHRWarningsDashboardStats from "./findByIdEmployeeHRWarningsDashboardStats";
import findByIdEmployeeHRWorkPermitsDashboardStats from "./findByIdEmployeeHRWorkPermitsDashboardStats";
import findByIdEmployeeHRPrDPDashboardStats from "./findByIdEmployeeHRPrDPDashboardStats";
import findByIdEmployeeHRIDOrPassportDashboardStats from "./findByIdEmployeeHRIDOrPassportDashboardStats";
import findByIdEmployeeHRCompetenciesDateRangeDashboardStats
    from "./findByIdEmployeeHRCompetenciesDateRangeDashboardStats";
import findByIdEmployeeHRContractsDateRangeDashboardStats from "./findByIdEmployeeHRContractsDateRangeDashboardStats";
import findByIdEmployeeHRCounselingsDateRangeDashboardStats from "./findByIdEmployeeHRCounselingsDateRangeDashboardStats";
import findByIdEmployeeHRLeavesDateRangeDashboardStats from "./findByIdEmployeeHRLeavesDateRangeDashboardStats";
import findByIdEmployeeHRLicensesDateRangeDashboardStats from "./findByIdEmployeeHRLicensesDateRangeDashboardStats";
import findByIdEmployeeHRMedicalsDateRangeDashboardStats from "./findByIdEmployeeHRMedicalsDateRangeDashboardStats";
import findByIdEmployeeHRWarningsDateRangeDashboardStats from "./findByIdEmployeeHRWarningsDateRangeDashboardStats";
import findByIdEmployeeHRWorkPermitsDateRangeDashboardStats from "./findByIdEmployeeHRWorkPermitsDateRangeDashboardStats";
import findByIdEmployeeHRPrDPDateRangeDashboardStats from "./findByIdEmployeeHRPrDPDateRangeDashboardStats";
import findByIdEmployeeHRIDOrPassportDateRangeDashboardStats from "./findByIdEmployeeHRIDOrPassportDateRangeDashboardStats";
import findByIdEmployeeHRJobAppointmentsDashboardStats from "./findByIdEmployeeHRJobAppointmentsDashboardStats";
import findByIdEmployeeHRJobAppointmentsDateRangeDashboardStats
    from "./findByIdEmployeeHRJobAppointmentsDateRangeDashboardStats";

class Store extends AStore {

    async listForSelectionByLogged() {
        return super.listForSelectionByLogged(
            {
                listForSelectionByLoggedSite: listForSelectionEmployeeByLoggedSite,
                listForSelectionByLoggedProject: listForSelectionEmployeeByLoggedProject,
                listForSelectionByLoggedClient: listForSelectionEmployeeByLoggedClient,
                listForSelectionByLoggedCompany: listForSelectionEmployeeByLoggedCompany,
            }
        );
    }

    //<editor-fold desc="findByIdHRDocsDashboardStats">
    //<editor-fold desc="findByIdHRCompetenciesDashboardStats">
    async findByIdHRCompetenciesDashboardStats(id) {
        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdEmployeeHRCompetenciesDashboardStats({input: id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRContractsDashboardStats">
    async findByIdHRContractsDashboardStats(id) {
        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdEmployeeHRContractsDashboardStats({input: id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRCounselingsDashboardStats">
    async findByIdHRCounselingsDashboardStats(id) {
        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdEmployeeHRCounselingsDashboardStats({input: id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRJobAppointmentsDashboardStats">
    async findByIdHRJobAppointmentsDashboardStats(id) {
        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdEmployeeHRJobAppointmentsDashboardStats({input: id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRLeavesDashboardStats">
    async findByIdHRLeavesDashboardStats(id) {
        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdEmployeeHRLeavesDashboardStats({input: id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRLicensesDashboardStats">
    async findByIdHRLicensesDashboardStats(id) {
        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdEmployeeHRLicensesDashboardStats({input: id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRMedicalsDashboardStats">
    async findByIdHRMedicalsDashboardStats(id) {
        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdEmployeeHRMedicalsDashboardStats({input: id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRWarningsDashboardStats">
    async findByIdHRWarningsDashboardStats(id) {
        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdEmployeeHRWarningsDashboardStats({input: id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRWorkPermitsDashboardStats">
    async findByIdHRWorkPermitsDashboardStats(id) {
        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdEmployeeHRWorkPermitsDashboardStats({input: id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRPrDPDashboardStats">
    async findByIdHRPrDPDashboardStats(id) {
        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdEmployeeHRPrDPDashboardStats({input: id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRIDOrPassportDashboardStats">
    async findByIdHRIDOrPassportDashboardStats(id) {
        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdEmployeeHRIDOrPassportDashboardStats({input: id, mon, mon2, mon3});
    }
    //</editor-fold>
    //</editor-fold>

    //<editor-fold desc="findByIdHRDocsDateRangeDashboardStats">
    //<editor-fold desc="findByIdHRCompetenciesDateRangeDashboardStats">
    async findByIdHRCompetenciesDateRangeDashboardStats(id) {
        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        return findByIdEmployeeHRCompetenciesDateRangeDashboardStats({input: id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRContractsDateRangeDashboardStats">
    async findByIdHRContractsDateRangeDashboardStats(id) {
        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        return findByIdEmployeeHRContractsDateRangeDashboardStats({input: id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRCounselingsDateRangeDashboardStats">
    async findByIdHRCounselingsDateRangeDashboardStats(id) {
        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        return findByIdEmployeeHRCounselingsDateRangeDashboardStats({input: id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRJobAppointmentsDateRangeDashboardStats">
    async findByIdHRJobAppointmentsDateRangeDashboardStats(id) {
        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        return findByIdEmployeeHRJobAppointmentsDateRangeDashboardStats({input: id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRLeavesDateRangeDashboardStats">
    async findByIdHRLeavesDateRangeDashboardStats(id) {
        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        return findByIdEmployeeHRLeavesDateRangeDashboardStats({input: id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRLicensesDateRangeDashboardStats">
    async findByIdHRLicensesDateRangeDashboardStats(id) {
        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        return findByIdEmployeeHRLicensesDateRangeDashboardStats({input: id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRMedicalsDateRangeDashboardStats">
    async findByIdHRMedicalsDateRangeDashboardStats(id) {
        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        return findByIdEmployeeHRMedicalsDateRangeDashboardStats({input: id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRWarningsDateRangeDashboardStats">
    async findByIdHRWarningsDateRangeDashboardStats(id) {
        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        return findByIdEmployeeHRWarningsDateRangeDashboardStats({input: id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRWorkPermitsDateRangeDashboardStats">
    async findByIdHRWorkPermitsDateRangeDashboardStats(id) {
        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        return findByIdEmployeeHRWorkPermitsDateRangeDashboardStats({input: id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRPrDPDateRangeDashboardStats">
    async findByIdHRPrDPDateRangeDashboardStats(id) {
        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        return findByIdEmployeeHRPrDPDateRangeDashboardStats({input: id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRIDOrPassportDateRangeDashboardStats">
    async findByIdHRIDOrPassportDateRangeDashboardStats(id) {
        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        return findByIdEmployeeHRIDOrPassportDateRangeDashboardStats({input: id, dates});
    }
    //</editor-fold>
    //</editor-fold>

}

const employeeStore = new Store();
export default employeeStore;