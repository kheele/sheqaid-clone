import {Dates} from 'utils/Utils';
import AStore from "../AStore";
import findByIdClient from "./findByIdClient";
import findBySiteIdClient from "./findBySiteIdClient";
import findByProjectIdClient from "./findByProjectIdClient";
import listAllClientByLoggedCompanySelectMenu from "./listAllClientByLoggedCompanySelectMenu";
import findByIdClientHRDashboardStats from "./findByIdClientHRDashboardStats";
import findByIdClientTrainingDashboardStats from "./findByIdClientTrainingDashboardStats";
import findByIdClientHRCompetenciesDashboardStats from "./findByIdClientHRCompetenciesDashboardStats";
import findByIdClientHRContractsDashboardStats from "./findByIdClientHRContractsDashboardStats";
import findByIdClientHRCounselingsDashboardStats from "./findByIdClientHRCounselingsDashboardStats";
import findByIdClientHRLeavesDashboardStats from "./findByIdClientHRLeavesDashboardStats";
import findByIdClientHRLicensesDashboardStats from "./findByIdClientHRLicensesDashboardStats";
import findByIdClientHRWarningsDashboardStats from "./findByIdClientHRWarningsDashboardStats";
import findByIdClientHRMedicalsDashboardStats from "./findByIdClientHRMedicalsDashboardStats";
import findByIdClientHRWorkPermitsDashboardStats from "./findByIdClientHRWorkPermitsDashboardStats";
import findByIdClientHRCompetenciesDateRangeDashboardStats from "./findByIdClientHRCompetenciesDateRangeDashboardStats";
import findByIdClientHRContractsDateRangeDashboardStats from "./findByIdClientHRContractsDateRangeDashboardStats";
import findByIdClientHRCounselingsDateRangeDashboardStats from "./findByIdClientHRCounselingsDateRangeDashboardStats";
import findByIdClientHRLeavesDateRangeDashboardStats from "./findByIdClientHRLeavesDateRangeDashboardStats";
import findByIdClientHRLicensesDateRangeDashboardStats from "./findByIdClientHRLicensesDateRangeDashboardStats";
import findByIdClientHRMedicalsDateRangeDashboardStats from "./findByIdClientHRMedicalsDateRangeDashboardStats";
import findByIdClientHRWarningsDateRangeDashboardStats from "./findByIdClientHRWarningsDateRangeDashboardStats";
import findByIdClientHRWorkPermitsDateRangeDashboardStats from "./findByIdClientHRWorkPermitsDateRangeDashboardStats";
import findByIdClientHRJobAppointmentsDashboardStats from "./findByIdClientHRJobAppointmentsDashboardStats";
import findByIdClientHRJobAppointmentsDateRangeDashboardStats
    from "./findByIdClientHRJobAppointmentsDateRangeDashboardStats";

class Store extends AStore {

    //<editor-fold desc="listAllByLogged">
    async listAllByLogged() {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;
        const {isConsultant, isNoProjects} = storage.is;

        // console.log('listAllByLogged', sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id)

        if (sess_my_site_id) {
            return [await findBySiteIdClient(sess_my_site_id)];
        }
        if (sess_my_project_id) {
            return [await findByProjectIdClient(sess_my_site_id)];
        }
        if (sess_my_client_id) {
            return [await findByIdClient(sess_my_client_id)];
        }

        return listAllClientByLoggedCompanySelectMenu(sess_company_id);
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRDashboardStatsByLogged">
    async findByIdHRDashboardStatsByLogged(selectedClient) {
        const {sess_my_client_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_client_id) {
            return findByIdClientHRDashboardStats({input: sess_my_client_id, mon, mon2, mon3});
        }

        return findByIdClientHRDashboardStats({input: selectedClient.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRDocsDashboardStatsByLogged">
    //<editor-fold desc="findByIdHRCompetenciesDashboardStatsByLogged">
    async findByIdHRCompetenciesDashboardStatsByLogged(selectedClient) {
        const {sess_my_client_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_client_id) {
            return findByIdClientHRCompetenciesDashboardStats({input: sess_my_client_id, mon, mon2, mon3});
        }

        return findByIdClientHRCompetenciesDashboardStats({input: selectedClient.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRContractsDashboardStatsByLogged">
    async findByIdHRContractsDashboardStatsByLogged(selectedClient) {
        const {sess_my_client_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_client_id) {
            return findByIdClientHRContractsDashboardStats({input: sess_my_client_id, mon, mon2, mon3});
        }

        return findByIdClientHRContractsDashboardStats({input: selectedClient.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRCounselingsDashboardStatsByLogged">
    async findByIdHRCounselingsDashboardStatsByLogged(selectedClient) {
        const {sess_my_client_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_client_id) {
            return findByIdClientHRCounselingsDashboardStats({input: sess_my_client_id, mon, mon2, mon3});
        }

        return findByIdClientHRCounselingsDashboardStats({input: selectedClient.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRJobAppointmentsDashboardStatsByLogged">
    async findByIdHRJobAppointmentsDashboardStatsByLogged(selectedClient) {
        const {sess_my_client_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_client_id) {
            return findByIdClientHRJobAppointmentsDashboardStats({input: sess_my_client_id, mon, mon2, mon3});
        }

        return findByIdClientHRJobAppointmentsDashboardStats({input: selectedClient.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRLeavesDashboardStatsByLogged">
    async findByIdHRLeavesDashboardStatsByLogged(selectedClient) {
        const {sess_my_client_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_client_id) {
            return findByIdClientHRLeavesDashboardStats({input: sess_my_client_id, mon, mon2, mon3});
        }

        return findByIdClientHRLeavesDashboardStats({input: selectedClient.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRLicensesDashboardStatsByLogged">
    async findByIdHRLicensesDashboardStatsByLogged(selectedClient) {
        const {sess_my_client_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_client_id) {
            return findByIdClientHRLicensesDashboardStats({input: sess_my_client_id, mon, mon2, mon3});
        }

        return findByIdClientHRLicensesDashboardStats({input: selectedClient.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRMedicalsDashboardStatsByLogged">
    async findByIdHRMedicalsDashboardStatsByLogged(selectedClient) {
        const {sess_my_client_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_client_id) {
            return findByIdClientHRMedicalsDashboardStats({input: sess_my_client_id, mon, mon2, mon3});
        }

        return findByIdClientHRMedicalsDashboardStats({input: selectedClient.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRWarningsDashboardStatsByLogged">
    async findByIdHRWarningsDashboardStatsByLogged(selectedClient) {
        const {sess_my_client_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_client_id) {
            return findByIdClientHRWarningsDashboardStats({input: sess_my_client_id, mon, mon2, mon3});
        }

        return findByIdClientHRWarningsDashboardStats({input: selectedClient.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRWorkPermitsDashboardStatsByLogged">
    async findByIdHRWorkPermitsDashboardStatsByLogged(selectedClient) {
        const {sess_my_client_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_client_id) {
            return findByIdClientHRWorkPermitsDashboardStats({input: sess_my_client_id, mon, mon2, mon3});
        }

        return findByIdClientHRWorkPermitsDashboardStats({input: selectedClient.id, mon, mon2, mon3});
    }
    //</editor-fold>
    //</editor-fold>

    //<editor-fold desc="findByIdHRDocsDateRangeDashboardStatsByLogged">
    //<editor-fold desc="findByIdHRCompetenciesDateRangeDashboardStatsByLogged">
    async findByIdHRCompetenciesDateRangeDashboardStatsByLogged(selectedClient) {
        const {sess_my_client_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_client_id) {
            //[{id, month_year: date.formatMonthYear(), count}]
            return findByIdClientHRCompetenciesDateRangeDashboardStats({input: sess_my_client_id, dates});
        }

        //[{id, month_year: date.formatMonthYear(), count}]
        return findByIdClientHRCompetenciesDateRangeDashboardStats({input: selectedClient.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRContractsDateRangeDashboardStatsByLogged">
    async findByIdHRContractsDateRangeDashboardStatsByLogged(selectedClient) {
        const {sess_my_client_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_client_id) {
            //[{id, month_year: date.formatMonthYear(), count}]
            return findByIdClientHRContractsDateRangeDashboardStats({input: sess_my_client_id, dates});
        }

        //[{id, month_year: date.formatMonthYear(), count}]
        return findByIdClientHRContractsDateRangeDashboardStats({input: selectedClient.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRCounselingsDateRangeDashboardStatsByLogged">
    async findByIdHRCounselingsDateRangeDashboardStatsByLogged(selectedClient) {
        const {sess_my_client_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_client_id) {
            //[{id, month_year: date.formatMonthYear(), count}]
            return findByIdClientHRCounselingsDateRangeDashboardStats({input: sess_my_client_id, dates});
        }

        //[{id, month_year: date.formatMonthYear(), count}]
        return findByIdClientHRCounselingsDateRangeDashboardStats({input: selectedClient.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRJobAppointmentsDateRangeDashboardStatsByLogged">
    async findByIdHRJobAppointmentsDateRangeDashboardStatsByLogged(selectedClient) {
        const {sess_my_client_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_client_id) {
            //[{id, month_year: date.formatMonthYear(), count}]
            return findByIdClientHRJobAppointmentsDateRangeDashboardStats({input: sess_my_client_id, dates});
        }

        //[{id, month_year: date.formatMonthYear(), count}]
        return findByIdClientHRJobAppointmentsDateRangeDashboardStats({input: selectedClient.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRLeavesDateRangeDashboardStatsByLogged">
    async findByIdHRLeavesDateRangeDashboardStatsByLogged(selectedClient) {
        const {sess_my_client_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_client_id) {
            //[{id, month_year: date.formatMonthYear(), count}]
            return findByIdClientHRLeavesDateRangeDashboardStats({input: sess_my_client_id, dates});
        }

        //[{id, month_year: date.formatMonthYear(), count}]
        return findByIdClientHRLeavesDateRangeDashboardStats({input: selectedClient.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRLicensesDateRangeDashboardStatsByLogged">
    async findByIdHRLicensesDateRangeDashboardStatsByLogged(selectedClient) {
        const {sess_my_client_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_client_id) {
            //[{id, month_year: date.formatMonthYear(), count}]
            return findByIdClientHRLicensesDateRangeDashboardStats({input: sess_my_client_id, dates});
        }

        //[{id, month_year: date.formatMonthYear(), count}]
        return findByIdClientHRLicensesDateRangeDashboardStats({input: selectedClient.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRMedicalsDateRangeDashboardStatsByLogged">
    async findByIdHRMedicalsDateRangeDashboardStatsByLogged(selectedClient) {
        const {sess_my_client_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_client_id) {
            //[{id, month_year: date.formatMonthYear(), count}]
            return findByIdClientHRMedicalsDateRangeDashboardStats({input: sess_my_client_id, dates});
        }

        //[{id, month_year: date.formatMonthYear(), count}]
        return findByIdClientHRMedicalsDateRangeDashboardStats({input: selectedClient.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRWarningsDateRangeDashboardStatsByLogged">
    async findByIdHRWarningsDateRangeDashboardStatsByLogged(selectedClient) {
        const {sess_my_client_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_client_id) {
            //[{id, month_year: date.formatMonthYear(), count}]
            return findByIdClientHRWarningsDateRangeDashboardStats({input: sess_my_client_id, dates});
        }

        //[{id, month_year: date.formatMonthYear(), count}]
        return findByIdClientHRWarningsDateRangeDashboardStats({input: selectedClient.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRWorkPermitsDateRangeDashboardStatsByLogged">
    async findByIdHRWorkPermitsDateRangeDashboardStatsByLogged(selectedClient) {
        const {sess_my_client_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_client_id) {
            //[{id, month_year: date.formatMonthYear(), count}]
            return findByIdClientHRWorkPermitsDateRangeDashboardStats({input: sess_my_client_id, dates});
        }

        //[{id, month_year: date.formatMonthYear(), count}]
        return findByIdClientHRWorkPermitsDateRangeDashboardStats({input: selectedClient.id, dates});
    }
    //</editor-fold>
    //</editor-fold>

    //<editor-fold desc="findByIdTrainingDashboardStatsByLogged">
    async findByIdTrainingDashboardStatsByLogged(selectedClient) {
        const {sess_my_client_id} = this;

        if (sess_my_client_id) {
            return findByIdClientTrainingDashboardStats({input: sess_my_client_id});
        }

        return findByIdClientTrainingDashboardStats({input: selectedClient.id});
    }
    //</editor-fold>
}

const clientStore = new Store();
export default clientStore;