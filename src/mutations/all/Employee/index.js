import AStore from "../AStore";
import listForSelectionEmployeeByLoggedSite from "./listForSelectionEmployeeByLoggedSite";
import listForSelectionEmployeeByLoggedProject from "./listForSelectionEmployeeByLoggedProject";
import listForSelectionEmployeeByLoggedClient from "./listForSelectionEmployeeByLoggedClient";
import listForSelectionEmployeeByLoggedCompany from "./listForSelectionEmployeeByLoggedCompany";
import {Dates} from "utils/Dates";

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
    async findByIdHRModuleDashboardStatsImpl(id, path, overridePath) {
        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));
        
        if (!overridePath) {
            path = `employees/docs/${path}`;
        }
        
        const findDashboard = sockets.of(`${path}`).fn('dashboard');
        return findDashboard({id, mon, mon2, mon3});
    }
    
    async findByIdHRCompetenciesDashboardStats(id) {
        return this.findByIdHRModuleDashboardStatsImpl(id, 'competencies');
    }
    
    async findByIdHRContractsDashboardStats(id) {
        return this.findByIdHRModuleDashboardStatsImpl(id, 'contracts');
    }
    
    async findByIdHRCounselingsDashboardStats(id) {
        return this.findByIdHRModuleDashboardStatsImpl(id, 'counsellings');
    }
    
    async findByIdHRJobAppointmentsDashboardStats(id) {
        return this.findByIdHRModuleDashboardStatsImpl(id, 'structure-and-responsibility/job-appointments', true);
    }
    
    async findByIdHRLeavesDashboardStats(id) {
        return this.findByIdHRModuleDashboardStatsImpl(id, 'leaves');
    }
    
    async findByIdHRLicensesDashboardStats(id) {
        return this.findByIdHRModuleDashboardStatsImpl(id, 'licenses');
    }
    
    async findByIdHRMedicalsDashboardStats(id) {
        return this.findByIdHRModuleDashboardStatsImpl(id, 'medicals');
    }
    
    async findByIdHRWarningsDashboardStats(id) {
        return this.findByIdHRModuleDashboardStatsImpl(id, 'warnings');
    }
    
    async findByIdHRWorkPermitsDashboardStats(id) {
        return this.findByIdHRModuleDashboardStatsImpl(id, 'work-permits');
    }
    
    async findByIdHRPrDPDashboardStats(id) {
        return this.findByIdHRModuleDashboardStatsImpl(id, 'employees/documents/prdp', true);
    }
    
    async findByIdHRIDOrPassportDashboardStats(id) {
        return this.findByIdHRModuleDashboardStatsImpl(id, 'employees/documents/id-or-passports', true);
    }
    //</editor-fold>

    //<editor-fold desc="findByIdHRDocsDateRangeDashboardStats">
    async findByIdHRModuleDateRangeDashboardStatsImpl(id, path, overridePath) {
        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);
        
        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);
        
        if (!overridePath) {
            path = `employees/docs/${path}`;
        }
        
        const findDashboard = sockets.of(`${path}/dashboard`).fn('date-range');
        return findDashboard({id, dates});
    }
    
    async findByIdHRCompetenciesDateRangeDashboardStats(id) {
        return this.findByIdHRModuleDateRangeDashboardStatsImpl(id, 'competencies');
    }
    
    async findByIdHRContractsDateRangeDashboardStats(id) {
        return this.findByIdHRModuleDateRangeDashboardStatsImpl(id, 'contracts');
    }
    
    async findByIdHRCounselingsDateRangeDashboardStats(id) {
        return this.findByIdHRModuleDateRangeDashboardStatsImpl(id, 'counsellings');
    }
    
    async findByIdHRJobAppointmentsDateRangeDashboardStats(id) {
        return this.findByIdHRModuleDateRangeDashboardStatsImpl(id, 'structure-and-responsibility/job-appointments', true);
    }
    
    async findByIdHRLeavesDateRangeDashboardStats(id) {
        return this.findByIdHRModuleDateRangeDashboardStatsImpl(id, 'leaves');
    }
    
    async findByIdHRLicensesDateRangeDashboardStats(id) {
        return this.findByIdHRModuleDateRangeDashboardStatsImpl(id, 'licenses');
    }
    
    async findByIdHRMedicalsDateRangeDashboardStats(id) {
        return this.findByIdHRModuleDateRangeDashboardStatsImpl(id, 'medicals');
    }
    
    async findByIdHRWarningsDateRangeDashboardStats(id) {
        return this.findByIdHRModuleDateRangeDashboardStatsImpl(id, 'warnings');
    }
    
    async findByIdHRWorkPermitsDateRangeDashboardStats(id) {
        return this.findByIdHRModuleDateRangeDashboardStatsImpl(id, 'work-permits');
    }
    
    async findByIdHRPrDPDateRangeDashboardStats(id) {
        return this.findByIdHRModuleDateRangeDashboardStatsImpl(id, 'employees/documents/prdp', true);
    }
    
    async findByIdHRIDOrPassportDateRangeDashboardStats(id) {
        return this.findByIdHRModuleDateRangeDashboardStatsImpl(id, 'employees/documents/id-or-passports', true);
    }
    //</editor-fold>

}

const employeeStore = new Store();
export default employeeStore;
