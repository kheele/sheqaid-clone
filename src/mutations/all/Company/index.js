import {Dates} from 'utils/Utils';
import AStore from "../AStore";
import findByIdCompanyHRDashboardStats from "./findByIdCompanyHRDashboardStats";
import findByIdCompanyTrainingDashboardStats from "./findByIdCompanyTrainingDashboardStats";
import findByIdCompanyHRCompetenciesDashboardStats from "./findByIdCompanyHRCompetenciesDashboardStats";
import findByIdCompanyHRContractsDashboardStats from "./findByIdCompanyHRContractsDashboardStats";
import findByIdCompanyHRCounselingsDashboardStats from "./findByIdCompanyHRCounselingsDashboardStats";
import findByIdCompanyHRLeavesDashboardStats from "./findByIdCompanyHRLeavesDashboardStats";
import findByIdCompanyHRLicensesDashboardStats from "./findByIdCompanyHRLicensesDashboardStats";
import findByIdCompanyHRWarningsDashboardStats from "./findByIdCompanyHRWarningsDashboardStats";
import findByIdCompanyHRMedicalsDashboardStats from "./findByIdCompanyHRMedicalsDashboardStats";
import findByIdCompanyHRWorkPermitsDashboardStats from "./findByIdCompanyHRWorkPermitsDashboardStats";
import findByIdCompanyHRPrDPDashboardStats from "./findByIdCompanyHRPrDPDashboardStats";
import findByIdCompanyHRIDOrPassportDashboardStats from "./findByIdCompanyHRIDOrPassportDashboardStats";
import findByIdCompanyHRCompetenciesDateRangeDashboardStats
    from "./findByIdCompanyHRCompetenciesDateRangeDashboardStats";
import findByIdCompanyHRContractsDateRangeDashboardStats from "./findByIdCompanyHRContractsDateRangeDashboardStats";
import findByIdCompanyHRCounselingsDateRangeDashboardStats from "./findByIdCompanyHRCounselingsDateRangeDashboardStats";
import findByIdCompanyHRLeavesDateRangeDashboardStats from "./findByIdCompanyHRLeavesDateRangeDashboardStats";
import findByIdCompanyHRLicensesDateRangeDashboardStats from "./findByIdCompanyHRLicensesDateRangeDashboardStats";
import findByIdCompanyHRMedicalsDateRangeDashboardStats from "./findByIdCompanyHRMedicalsDateRangeDashboardStats";
import findByIdCompanyHRWarningsDateRangeDashboardStats from "./findByIdCompanyHRWarningsDateRangeDashboardStats";
import findByIdCompanyHRWorkPermitsDateRangeDashboardStats from "./findByIdCompanyHRWorkPermitsDateRangeDashboardStats";
import findByIdCompanyHRPrDPDateRangeDashboardStats from "./findByIdCompanyHRPrDPDateRangeDashboardStats";
import findByIdCompanyHRIDOrPassportDateRangeDashboardStats from "./findByIdCompanyHRIDOrPassportDateRangeDashboardStats";
import findByIdCompanyHRJobAppointmentsDateRangeDashboardStats
    from "./findByIdCompanyHRJobAppointmentsDateRangeDashboardStats";
import findByIdCompanyHRJobAppointmentsDashboardStats from "./findByIdCompanyHRJobAppointmentsDashboardStats";

class Store extends AStore{

    //<editor-fold desc="findByIdHRDashboardStatsByLogged">
    async findByIdHRDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdCompanyHRDashboardStats({input: sess_company_id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRDocsDashboardStatsByLogged">
    //<editor-fold desc="findByIdHRCompetenciesDashboardStatsByLogged">
    async findByIdHRCompetenciesDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdCompanyHRCompetenciesDashboardStats({input: sess_company_id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRContractsDashboardStatsByLogged">
    async findByIdHRContractsDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdCompanyHRContractsDashboardStats({input: sess_company_id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRCounselingsDashboardStatsByLogged">
    async findByIdHRCounselingsDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdCompanyHRCounselingsDashboardStats({input: sess_company_id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRJobAppointmentsDashboardStatsByLogged">
    async findByIdHRJobAppointmentsDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdCompanyHRJobAppointmentsDashboardStats({input: sess_company_id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRLeavesDashboardStatsByLogged">
    async findByIdHRLeavesDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdCompanyHRLeavesDashboardStats({input: sess_company_id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRLicensesDashboardStatsByLogged">
    async findByIdHRLicensesDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdCompanyHRLicensesDashboardStats({input: sess_company_id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRMedicalsDashboardStatsByLogged">
    async findByIdHRMedicalsDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdCompanyHRMedicalsDashboardStats({input: sess_company_id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRWarningsDashboardStatsByLogged">
    async findByIdHRWarningsDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdCompanyHRWarningsDashboardStats({input: sess_company_id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRWorkPermitsDashboardStatsByLogged">
    async findByIdHRWorkPermitsDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdCompanyHRWorkPermitsDashboardStats({input: sess_company_id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRPrDPDashboardStatsByLogged">
    async findByIdHRPrDPDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdCompanyHRPrDPDashboardStats({input: sess_company_id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRIDOrPassportDashboardStatsByLogged">
    async findByIdHRIDOrPassportDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return findByIdCompanyHRIDOrPassportDashboardStats({input: sess_company_id, mon, mon2, mon3});
    }
    //</editor-fold>
    //</editor-fold>

    //<editor-fold desc="findByIdHRDocsDateRangeDashboardStatsByLogged">
    //<editor-fold desc="findByIdHRCompetenciesDateRangeDashboardStatsByLogged">
    async findByIdHRCompetenciesDateRangeDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        //[{id, month_year: date.formatMonthYear(), count}]
        return findByIdCompanyHRCompetenciesDateRangeDashboardStats({input: sess_company_id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRContractsDateRangeDashboardStatsByLogged">
    async findByIdHRContractsDateRangeDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        //[{id, month_year: date.formatMonthYear(), count}]
        return findByIdCompanyHRContractsDateRangeDashboardStats({input: sess_company_id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRCounselingsDateRangeDashboardStatsByLogged">
    async findByIdHRCounselingsDateRangeDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        //[{id, month_year: date.formatMonthYear(), count}]
        return findByIdCompanyHRCounselingsDateRangeDashboardStats({input: sess_company_id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRJobAppointmentsDateRangeDashboardStatsByLogged">
    async findByIdHRJobAppointmentsDateRangeDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        //[{id, month_year: date.formatMonthYear(), count}]
        return findByIdCompanyHRJobAppointmentsDateRangeDashboardStats({input: sess_company_id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRLeavesDateRangeDashboardStatsByLogged">
    async findByIdHRLeavesDateRangeDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        //[{id, month_year: date.formatMonthYear(), count}]
        return findByIdCompanyHRLeavesDateRangeDashboardStats({input: sess_company_id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRLicensesDateRangeDashboardStatsByLogged">
    async findByIdHRLicensesDateRangeDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        //[{id, month_year: date.formatMonthYear(), count}]
        return findByIdCompanyHRLicensesDateRangeDashboardStats({input: sess_company_id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRMedicalsDateRangeDashboardStatsByLogged">
    async findByIdHRMedicalsDateRangeDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        //[{id, month_year: date.formatMonthYear(), count}]
        return findByIdCompanyHRMedicalsDateRangeDashboardStats({input: sess_company_id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRWarningsDateRangeDashboardStatsByLogged">
    async findByIdHRWarningsDateRangeDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        //[{id, month_year: date.formatMonthYear(), count}]
        return findByIdCompanyHRWarningsDateRangeDashboardStats({input: sess_company_id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRWorkPermitsDateRangeDashboardStatsByLogged">
    async findByIdHRWorkPermitsDateRangeDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        //[{id, month_year: date.formatMonthYear(), count}]
        return findByIdCompanyHRWorkPermitsDateRangeDashboardStats({input: sess_company_id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRPrDPDateRangeDashboardStatsByLogged">
    async findByIdHRPrDPDateRangeDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        //[{id, month_year: date.formatMonthYear(), count}]
        return findByIdCompanyHRPrDPDateRangeDashboardStats({input: sess_company_id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRIDOrPassportDateRangeDashboardStatsByLogged">
    async findByIdHRIDOrPassportDateRangeDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        //[{id, month_year: date.formatMonthYear(), count}]
        return findByIdCompanyHRIDOrPassportDateRangeDashboardStats({input: sess_company_id, dates});
    }
    //</editor-fold>
    //</editor-fold>

    //<editor-fold desc="findByIdTrainingDashboardStatsByLogged">
    async findByIdTrainingDashboardStatsByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;

        return findByIdCompanyTrainingDashboardStats({input: sess_company_id});
    }
    //</editor-fold>
}

const companyStore = new Store();
export default companyStore;