import {Dates} from 'utils/Utils';
import AStore from "../AStore";
import findByIdSite from "./findByIdSite";
import listAllSiteByLoggedClient from "./listAllSiteByLoggedClient";
import listAllSiteByLoggedCompany from "./listAllSiteByLoggedCompany";
import listAllSiteByLoggedProject from "./listAllSiteByLoggedProject";
import findByIdSiteHRDashboardStats from "./findByIdSiteHRDashboardStats";
import findByIdSiteTrainingDashboardStats from "./findByIdSiteTrainingDashboardStats";
import findByIdSiteHRCompetenciesDashboardStats from "./findByIdSiteHRCompetenciesDashboardStats";
import findByIdSiteHRContractsDashboardStats from "./findByIdSiteHRContractsDashboardStats";
import findByIdSiteHRCounselingsDashboardStats from "./findByIdSiteHRCounselingsDashboardStats";
import findByIdSiteHRLeavesDashboardStats from "./findByIdSiteHRLeavesDashboardStats";
import findByIdSiteHRLicensesDashboardStats from "./findByIdSiteHRLicensesDashboardStats";
import findByIdSiteHRMedicalsDashboardStats from "./findByIdSiteHRMedicalsDashboardStats";
import findByIdSiteHRWarningsDashboardStats from "./findByIdSiteHRWarningsDashboardStats";
import findByIdSiteHRWorkPermitsDashboardStats from "./findByIdSiteHRWorkPermitsDashboardStats";
import findByIdSiteHRPrDPDashboardStats from "./findByIdSiteHRPrDPDashboardStats";
import findByIdSiteHRIDOrPassportDashboardStats from "./findByIdSiteHRIDOrPassportDashboardStats";

import findByIdSiteHRCompetenciesDateRangeDashboardStats from "./findByIdSiteHRCompetenciesDateRangeDashboardStats";
import findByIdSiteHRContractsDateRangeDashboardStats from "./findByIdSiteHRContractsDateRangeDashboardStats";
import findByIdSiteHRCounselingsDateRangeDashboardStats from "./findByIdSiteHRCounselingsDateRangeDashboardStats";
import findByIdSiteHRLeavesDateRangeDashboardStats from "./findByIdSiteHRLeavesDateRangeDashboardStats";
import findByIdSiteHRLicensesDateRangeDashboardStats from "./findByIdSiteHRLicensesDateRangeDashboardStats";
import findByIdSiteHRMedicalsDateRangeDashboardStats from "./findByIdSiteHRMedicalsDateRangeDashboardStats";
import findByIdSiteHRWarningsDateRangeDashboardStats from "./findByIdSiteHRWarningsDateRangeDashboardStats";
import findByIdSiteHRWorkPermitsDateRangeDashboardStats from "./findByIdSiteHRWorkPermitsDateRangeDashboardStats";
import findByIdSiteHRPrDPDateRangeDashboardStats from "./findByIdSiteHRPrDPDateRangeDashboardStats";
import findByIdSiteHRIDOrPassportDateRangeDashboardStats from "./findByIdSiteHRIDOrPassportDateRangeDashboardStats";

class Store extends AStore{

    //<editor-fold desc="listAllByLogged">
    async listAllByLogged() {
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;
        const {isConsultant, isNoProjects} = storage.is;

        if (sess_my_site_id) {
            return [await findByIdSite(sess_my_site_id)];
        }
        if (sess_my_project_id) {
            return listAllSiteByLoggedProject(sess_my_project_id);
        }
        if (sess_my_client_id) {
            if (selectedProject) {
                return listAllSiteByLoggedProject(selectedProject.id);
            }
            return listAllSiteByLoggedClient(sess_my_client_id);
        }

        if (isConsultant) {
            if (selectedProject) {
                console.log('listAllSiteByLoggedProject', selectedProject.id)
                return listAllSiteByLoggedProject(selectedProject.id);
            }
            if (selectedClient) {
                return listAllSiteByLoggedClient(selectedClient.id);
            }
        } else if(!isNoProjects) {//client with projects
            if (selectedProject) {
                return listAllSiteByLoggedProject(selectedProject.id);
            }
        }
        return listAllSiteByLoggedCompany(sess_company_id);
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRDashboardStatsByLogged">
    async findByIdHRDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_site_id) {
            return findByIdSiteHRDashboardStats({input: sess_my_site_id, mon, mon2, mon3});
        }

        return findByIdSiteHRDashboardStats({input: selectedSite.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRDocsDashboardStatsByLogged">
    //<editor-fold desc="findByIdHRCompetenciesDashboardStatsByLogged">
    async findByIdHRCompetenciesDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_site_id) {
            return findByIdSiteHRCompetenciesDashboardStats({input: sess_my_site_id, mon, mon2, mon3});
        }

        return findByIdSiteHRCompetenciesDashboardStats({input: selectedSite.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRContractsDashboardStatsByLogged">
    async findByIdHRContractsDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_site_id) {
            return findByIdSiteHRContractsDashboardStats({input: sess_my_site_id, mon, mon2, mon3});
        }

        return findByIdSiteHRContractsDashboardStats({input: selectedSite.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRCounselingsDashboardStatsByLogged">
    async findByIdHRCounselingsDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_site_id) {
            return findByIdSiteHRCounselingsDashboardStats({input: sess_my_site_id, mon, mon2, mon3});
        }

        return findByIdSiteHRCounselingsDashboardStats({input: selectedSite.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRLeavesDashboardStatsByLogged">
    async findByIdHRLeavesDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_site_id) {
            return findByIdSiteHRLeavesDashboardStats({input: sess_my_site_id, mon, mon2, mon3});
        }

        return findByIdSiteHRLeavesDashboardStats({input: selectedSite.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRLicensesDashboardStatsByLogged">
    async findByIdHRLicensesDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_site_id) {
            return findByIdSiteHRLicensesDashboardStats({input: sess_my_site_id, mon, mon2, mon3});
        }

        return findByIdSiteHRLicensesDashboardStats({input: selectedSite.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRMedicalsDashboardStatsByLogged">
    async findByIdHRMedicalsDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_site_id) {
            return findByIdSiteHRMedicalsDashboardStats({input: sess_my_site_id, mon, mon2, mon3});
        }

        return findByIdSiteHRMedicalsDashboardStats({input: selectedSite.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRWarningsDashboardStatsByLogged">
    async findByIdHRWarningsDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_site_id) {
            return findByIdSiteHRWarningsDashboardStats({input: sess_my_site_id, mon, mon2, mon3});
        }

        return findByIdSiteHRWarningsDashboardStats({input: selectedSite.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRWorkPermitsDashboardStatsByLogged">
    async findByIdHRWorkPermitsDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_site_id) {
            return findByIdSiteHRWorkPermitsDashboardStats({input: sess_my_site_id, mon, mon2, mon3});
        }

        return findByIdSiteHRWorkPermitsDashboardStats({input: selectedSite.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRPrDPDashboardStatsByLogged">
    async findByIdHRPrDPDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_site_id) {
            return findByIdSiteHRPrDPDashboardStats({input: sess_my_site_id, mon, mon2, mon3});
        }

        return findByIdSiteHRPrDPDashboardStats({input: selectedSite.id, mon, mon2, mon3});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRIDOrPassportDashboardStatsByLogged">
    async findByIdHRIDOrPassportDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        if (sess_my_site_id) {
            return findByIdSiteHRIDOrPassportDashboardStats({input: sess_my_site_id, mon, mon2, mon3});
        }

        return findByIdSiteHRIDOrPassportDashboardStats({input: selectedSite.id, mon, mon2, mon3});
    }
    //</editor-fold>
    //</editor-fold>

    //<editor-fold desc="findByIdHRDocsDateRangeDashboardStatsByLogged">
    //<editor-fold desc="findByIdHRCompetenciesDateRangeDashboardStatsByLogged">
    async findByIdHRCompetenciesDateRangeDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_site_id) {
            return findByIdSiteHRCompetenciesDateRangeDashboardStats({input: sess_my_site_id, dates});
        }

        return findByIdSiteHRCompetenciesDateRangeDashboardStats({input: selectedSite.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRContractsDateRangeDashboardStatsByLogged">
    async findByIdHRContractsDateRangeDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_site_id) {
            return findByIdSiteHRContractsDateRangeDashboardStats({input: sess_my_site_id, dates});
        }

        return findByIdSiteHRContractsDateRangeDashboardStats({input: selectedSite.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRCounselingsDateRangeDashboardStatsByLogged">
    async findByIdHRCounselingsDateRangeDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_site_id) {
            return findByIdSiteHRCounselingsDateRangeDashboardStats({input: sess_my_site_id, dates});
        }

        return findByIdSiteHRCounselingsDateRangeDashboardStats({input: selectedSite.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRLeavesDateRangeDashboardStatsByLogged">
    async findByIdHRLeavesDateRangeDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_site_id) {
            return findByIdSiteHRLeavesDateRangeDashboardStats({input: sess_my_site_id, dates});
        }

        return findByIdSiteHRLeavesDateRangeDashboardStats({input: selectedSite.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRLicensesDateRangeDashboardStatsByLogged">
    async findByIdHRLicensesDateRangeDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_site_id) {
            return findByIdSiteHRLicensesDateRangeDashboardStats({input: sess_my_site_id, dates});
        }

        return findByIdSiteHRLicensesDateRangeDashboardStats({input: selectedSite.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRMedicalsDateRangeDashboardStatsByLogged">
    async findByIdHRMedicalsDateRangeDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_site_id) {
            return findByIdSiteHRMedicalsDateRangeDashboardStats({input: sess_my_site_id, dates});
        }

        return findByIdSiteHRMedicalsDateRangeDashboardStats({input: selectedSite.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRWarningsDateRangeDashboardStatsByLogged">
    async findByIdHRWarningsDateRangeDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_site_id) {
            return findByIdSiteHRWarningsDateRangeDashboardStats({input: sess_my_site_id, dates});
        }

        return findByIdSiteHRWarningsDateRangeDashboardStats({input: selectedSite.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRWorkPermitsDateRangeDashboardStatsByLogged">
    async findByIdHRWorkPermitsDateRangeDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_site_id) {
            return findByIdSiteHRWorkPermitsDateRangeDashboardStats({input: sess_my_site_id, dates});
        }

        return findByIdSiteHRWorkPermitsDateRangeDashboardStats({input: selectedSite.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRPrDPDateRangeDashboardStatsByLogged">
    async findByIdHRPrDPDateRangeDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_site_id) {
            return findByIdSiteHRPrDPDateRangeDashboardStats({input: sess_my_site_id, dates});
        }

        return findByIdSiteHRPrDPDateRangeDashboardStats({input: selectedSite.id, dates});
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRIDOrPassportDateRangeDashboardStatsByLogged">
    async findByIdHRIDOrPassportDateRangeDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);

        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

        if (sess_my_site_id) {
            return findByIdSiteHRIDOrPassportDateRangeDashboardStats({input: sess_my_site_id, dates});
        }

        return findByIdSiteHRIDOrPassportDateRangeDashboardStats({input: selectedSite.id, dates});
    }
    //</editor-fold>
    //</editor-fold>

    //<editor-fold desc="findByIdTrainingDashboardStatsByLogged">
    async findByIdTrainingDashboardStatsByLogged(selectedSite) {
        const {sess_my_site_id} = this;

        if (sess_my_site_id) {
            return findByIdSiteTrainingDashboardStats({input: sess_my_site_id});
        }

        return findByIdSiteTrainingDashboardStats({input: selectedSite.id});
    }
    //</editor-fold>
}

const siteStore = new Store();
export default siteStore;