import {Dates} from 'utils/Utils';
import AStore from "../AStore";
import findByIdProject from "./findByIdProject";
import findBySiteIdProject from "./findBySiteIdProject";
import listAllProjectByLoggedCompanySelectMenu from "./listAllProjectByLoggedCompanySelectMenu";
import listAllProjectByLoggedClientSelectMenu from "./listAllProjectByLoggedClientSelectMenu";
import findByIdProjectHRDashboardStats from "./findByIdProjectHRDashboardStats";
import findByIdProjectTrainingDashboardStats from "./findByIdProjectTrainingDashboardStats";
import findByIdProjectHRCompetenciesDashboardStats from "./findByIdProjectHRCompetenciesDashboardStats";
import findByIdProjectHRContractsDashboardStats from "./findByIdProjectHRContractsDashboardStats";
import findByIdProjectHRCounselingsDashboardStats from "./findByIdProjectHRCounselingsDashboardStats";
import findByIdProjectHRLeavesDashboardStats from "./findByIdProjectHRLeavesDashboardStats";
import findByIdProjectHRLicensesDashboardStats from "./findByIdProjectHRLicensesDashboardStats";
import findByIdProjectHRMedicalsDashboardStats from "./findByIdProjectHRMedicalsDashboardStats";
import findByIdProjectHRWarningsDashboardStats from "./findByIdProjectHRWarningsDashboardStats";
import findByIdProjectHRWorkPermitsDashboardStats from "./findByIdProjectHRWorkPermitsDashboardStats";
import findByIdProjectHRPrDPDashboardStats from "./findByIdProjectHRPrDPDashboardStats";
import findByIdProjectHRIDOrPassportDashboardStats from "./findByIdProjectHRIDOrPassportDashboardStats";
import findByIdProjectHRCompetenciesDateRangeDashboardStats
    from "./findByIdProjectHRCompetenciesDateRangeDashboardStats";
import findByIdProjectHRContractsDateRangeDashboardStats from "./findByIdProjectHRContractsDateRangeDashboardStats";
import findByIdProjectHRCounselingsDateRangeDashboardStats from "./findByIdProjectHRCounselingsDateRangeDashboardStats";
import findByIdProjectHRLeavesDateRangeDashboardStats from "./findByIdProjectHRLeavesDateRangeDashboardStats";
import findByIdProjectHRLicensesDateRangeDashboardStats from "./findByIdProjectHRLicensesDateRangeDashboardStats";
import findByIdProjectHRMedicalsDateRangeDashboardStats from "./findByIdProjectHRMedicalsDateRangeDashboardStats";
import findByIdProjectHRWarningsDateRangeDashboardStats from "./findByIdProjectHRWarningsDateRangeDashboardStats";
import findByIdProjectHRWorkPermitsDateRangeDashboardStats from "./findByIdProjectHRWorkPermitsDateRangeDashboardStats";
import findByIdProjectHRPrDPDateRangeDashboardStats from "./findByIdProjectHRPrDPDateRangeDashboardStats";
import findByIdProjectHRIDOrPassportDateRangeDashboardStats from "./findByIdProjectHRIDOrPassportDateRangeDashboardStats";
import findByIdProjectHRJobAppointmentsDashboardStats from "./findByIdProjectHRJobAppointmentsDashboardStats";
import findByIdProjectHRJobAppointmentsDateRangeDashboardStats
    from "./findByIdProjectHRJobAppointmentsDateRangeDashboardStats";

class Store extends AStore{

    //<editor-fold desc="listAllByLogged">
    async listAllByLogged() {
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;
        const {isConsultant, isNoProjects} = storage.is;

        if (sess_my_site_id) {
            return [await findBySiteIdProject(sess_my_site_id)];
        }
        if (sess_my_project_id) {
            return [await findByIdProject(sess_my_project_id)];
        }
        if (sess_my_client_id) {
            return listAllProjectByLoggedClientSelectMenu(sess_my_client_id);
        }

        if (isConsultant) {
            if (selectedClient) {
                console.log('listAllProjectByLoggedClientSelectMenu', selectedClient.id)
                return listAllProjectByLoggedClientSelectMenu(selectedClient.id);
            }
            return [];
        } else if(!isNoProjects) {//client with projects

        }
        return listAllProjectByLoggedCompanySelectMenu(sess_company_id);
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRDashboardStatsByLogged">
    async findByIdHRDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_project_id) {
            return findByIdProjectHRDashboardStats({input: sess_my_project_id, mon, mon2, mon3});
        }

        return findByIdProjectHRDashboardStats({input: selectedProject.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRDocsDashboardStatsByLogged">
    //<editor-fold desc="findByIdHRCompetenciesDashboardStatsByLogged">
    async findByIdHRCompetenciesDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_project_id) {
            return findByIdProjectHRCompetenciesDashboardStats({input: sess_my_project_id, mon, mon2, mon3});
        }

        return findByIdProjectHRCompetenciesDashboardStats({input: selectedProject.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRContractsDashboardStatsByLogged">
    async findByIdHRContractsDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_project_id) {
            return findByIdProjectHRContractsDashboardStats({input: sess_my_project_id, mon, mon2, mon3});
        }

        return findByIdProjectHRContractsDashboardStats({input: selectedProject.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRCounselingsDashboardStatsByLogged">
    async findByIdHRCounselingsDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_project_id) {
            return findByIdProjectHRCounselingsDashboardStats({input: sess_my_project_id, mon, mon2, mon3});
        }

        return findByIdProjectHRCounselingsDashboardStats({input: selectedProject.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRJobAppointmentsDashboardStatsByLogged">
    async findByIdHRJobAppointmentsDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_project_id) {
            return findByIdProjectHRJobAppointmentsDashboardStats({input: sess_my_project_id, mon, mon2, mon3});
        }

        return findByIdProjectHRJobAppointmentsDashboardStats({input: selectedProject.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRLeavesDashboardStatsByLogged">
    async findByIdHRLeavesDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_project_id) {
            return findByIdProjectHRLeavesDashboardStats({input: sess_my_project_id, mon, mon2, mon3});
        }

        return findByIdProjectHRLeavesDashboardStats({input: selectedProject.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRLicensesDashboardStatsByLogged">
    async findByIdHRLicensesDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_project_id) {
            return findByIdProjectHRLicensesDashboardStats({input: sess_my_project_id, mon, mon2, mon3});
        }

        return findByIdProjectHRLicensesDashboardStats({input: selectedProject.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRMedicalsDashboardStatsByLogged">
    async findByIdHRMedicalsDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_project_id) {
            return findByIdProjectHRMedicalsDashboardStats({input: sess_my_project_id, mon, mon2, mon3});
        }

        return findByIdProjectHRMedicalsDashboardStats({input: selectedProject.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRWarningsDashboardStatsByLogged">
    async findByIdHRWarningsDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_project_id) {
            return findByIdProjectHRWarningsDashboardStats({input: sess_my_project_id, mon, mon2, mon3});
        }

        return findByIdProjectHRWarningsDashboardStats({input: selectedProject.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRWorkPermitsDashboardStatsByLogged">
    async findByIdHRWorkPermitsDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_project_id) {
            return findByIdProjectHRWorkPermitsDashboardStats({input: sess_my_project_id, mon, mon2, mon3});
        }

        return findByIdProjectHRWorkPermitsDashboardStats({input: selectedProject.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRPrDPDashboardStatsByLogged">
    async findByIdHRPrDPDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_project_id) {
            return findByIdProjectHRPrDPDashboardStats({input: sess_my_project_id, mon, mon2, mon3});
        }

        return findByIdProjectHRPrDPDashboardStats({input: selectedProject.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRIDOrPassportDashboardStatsByLogged">
    async findByIdHRIDOrPassportDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_project_id) {
            return findByIdProjectHRIDOrPassportDashboardStats({input: sess_my_project_id, mon, mon2, mon3});
        }

        return findByIdProjectHRIDOrPassportDashboardStats({input: selectedProject.id, mon, mon2, mon3});
    }
    //</editor-fold>
    //</editor-fold>

    //<editor-fold desc="findByIdHRDocsDateRangeDashboardStatsByLogged">
    //<editor-fold desc="findByIdHRCompetenciesDateRangeDashboardStatsByLogged">
    async findByIdHRCompetenciesDateRangeDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_project_id) {
            return findByIdProjectHRCompetenciesDateRangeDashboardStats({input: sess_my_project_id, dates});
        }

        return findByIdProjectHRCompetenciesDateRangeDashboardStats({input: selectedProject.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRContractsDateRangeDashboardStatsByLogged">
    async findByIdHRContractsDateRangeDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_project_id) {
            return findByIdProjectHRContractsDateRangeDashboardStats({input: sess_my_project_id, dates});
        }

        return findByIdProjectHRContractsDateRangeDashboardStats({input: selectedProject.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRCounselingsDateRangeDashboardStatsByLogged">
    async findByIdHRCounselingsDateRangeDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_project_id) {
            return findByIdProjectHRCounselingsDateRangeDashboardStats({input: sess_my_project_id, dates});
        }

        return findByIdProjectHRCounselingsDateRangeDashboardStats({input: selectedProject.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRJobAppointmentsDateRangeDashboardStatsByLogged">
    async findByIdHRJobAppointmentsDateRangeDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_project_id) {
            return findByIdProjectHRJobAppointmentsDateRangeDashboardStats({input: sess_my_project_id, dates});
        }

        return findByIdProjectHRJobAppointmentsDateRangeDashboardStats({input: selectedProject.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRLeavesDateRangeDashboardStatsByLogged">
    async findByIdHRLeavesDateRangeDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_project_id) {
            return findByIdProjectHRLeavesDateRangeDashboardStats({input: sess_my_project_id, dates});
        }

        return findByIdProjectHRLeavesDateRangeDashboardStats({input: selectedProject.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRLicensesDateRangeDashboardStatsByLogged">
    async findByIdHRLicensesDateRangeDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_project_id) {
            return findByIdProjectHRLicensesDateRangeDashboardStats({input: sess_my_project_id, dates});
        }

        return findByIdProjectHRLicensesDateRangeDashboardStats({input: selectedProject.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRMedicalsDateRangeDashboardStatsByLogged">
    async findByIdHRMedicalsDateRangeDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_project_id) {
            return findByIdProjectHRMedicalsDateRangeDashboardStats({input: sess_my_project_id, dates});
        }

        return findByIdProjectHRMedicalsDateRangeDashboardStats({input: selectedProject.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRWarningsDateRangeDashboardStatsByLogged">
    async findByIdHRWarningsDateRangeDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_project_id) {
            return findByIdProjectHRWarningsDateRangeDashboardStats({input: sess_my_project_id, dates});
        }

        return findByIdProjectHRWarningsDateRangeDashboardStats({input: selectedProject.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRWorkPermitsDateRangeDashboardStatsByLogged">
    async findByIdHRWorkPermitsDateRangeDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_project_id) {
            return findByIdProjectHRWorkPermitsDateRangeDashboardStats({input: sess_my_project_id, dates});
        }

        return findByIdProjectHRWorkPermitsDateRangeDashboardStats({input: selectedProject.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRPrDPDateRangeDashboardStatsByLogged">
    async findByIdHRPrDPDateRangeDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_project_id) {
            return findByIdProjectHRPrDPDateRangeDashboardStats({input: sess_my_project_id, dates});
        }

        return findByIdProjectHRPrDPDateRangeDashboardStats({input: selectedProject.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRIDOrPassportDateRangeDashboardStatsByLogged">
    async findByIdHRIDOrPassportDateRangeDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_project_id) {
            return findByIdProjectHRIDOrPassportDateRangeDashboardStats({input: sess_my_project_id, dates});
        }

        return findByIdProjectHRIDOrPassportDateRangeDashboardStats({input: selectedProject.id, dates});
    }
    //</editor-fold>
    //</editor-fold>

    //<editor-fold desc="findByIdTrainingDashboardStatsByLogged">
    async findByIdTrainingDashboardStatsByLogged(selectedProject) {
        const {sess_my_project_id} = this;

        if (sess_my_project_id) {
            return findByIdProjectTrainingDashboardStats({input: sess_my_project_id});
        }

        return findByIdProjectTrainingDashboardStats({input: selectedProject.id});
    }
    //</editor-fold>
}

const projectStore = new Store();
export default projectStore;