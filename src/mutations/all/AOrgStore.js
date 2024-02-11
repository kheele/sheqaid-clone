import {Dates} from "../../utils/Dates";
import AStore from "./AStore";

class AOrgStore extends AStore {
    
    //<editor-fold desc="findByIdHRDashboardStatsByLogged">
    async findByIdHRDashboardStatsByLogged(selectedOrg) {
        const {[this.key]: sess_my_org_id, org} = this;
        
        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));
        
        const findDashboard = sockets.of(`employees/${org}`).fn('dashboard');
        const id = sess_my_org_id || selectedOrg.id;
        return findDashboard({id, mon, mon2, mon3});
    }
    
    //</editor-fold>
    
    //<editor-fold desc="findByIdHRDocsDashboardStatsByLogged">
    async findByIdHRModuleDashboardStatsByLoggedImpl(selectedOrg, path, overridePath) {
        const {[this.key]: sess_my_org_id, org} = this;
        
        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));
        
        if (!overridePath) {
            path = `employees/docs/${path}`;
        }
        
        const findDashboard = sockets.of(`${path}/${org}`).fn('dashboard');
        const id = sess_my_org_id || selectedOrg.id;
        return findDashboard({id, mon, mon2, mon3}).then(res => {
            console.log('findByIdHRModuleDashboardStatsByLoggedImpl', path, res);
            return res;
        });
    }
    
    async findByIdHRCompetenciesDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDashboardStatsByLoggedImpl(selectedOrg, 'competencies');
    }
    
    async findByIdHRContractsDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDashboardStatsByLoggedImpl(selectedOrg, 'contracts');
    }
    
    async findByIdHRCounselingsDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDashboardStatsByLoggedImpl(selectedOrg, 'counsellings');
    }
    
    async findByIdHRJobAppointmentsDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDashboardStatsByLoggedImpl(selectedOrg, 'structure-and-responsibility/job-appointments', true);
    }
    
    async findByIdHRLeavesDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDashboardStatsByLoggedImpl(selectedOrg, 'leaves');
    }
    
    async findByIdHRLicensesDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDashboardStatsByLoggedImpl(selectedOrg, 'licenses');
    }
    
    async findByIdHRMedicalsDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDashboardStatsByLoggedImpl(selectedOrg, 'medicals');
    }
    
    async findByIdHRWarningsDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDashboardStatsByLoggedImpl(selectedOrg, 'warnings');
    }
    
    async findByIdHRWorkPermitsDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDashboardStatsByLoggedImpl(selectedOrg, 'work-permits');
    }
    
    async findByIdHRPrDPDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDashboardStatsByLoggedImpl(selectedOrg, 'employees/documents/prdp', true);
    }
    
    async findByIdHRIDOrPassportDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDashboardStatsByLoggedImpl(selectedOrg, 'employees/documents/id-or-passports', true);
    }
    //</editor-fold>
    
    //<editor-fold desc="findByIdHRDocsDateRangeDashboardStatsByLogged">
    async findByIdHRModuleDateRangeDashboardStatsByLoggedImpl(selectedOrg, path, overridePath) {
        const {[this.key]: sess_my_org_id, org} = this;
        
        const monStart = new Date().addMonths(-4);
        const monEnd = new Date().addMonths(12);
        
        const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);
        
        if (!overridePath) {
            path = `employees/docs/${path}`;
        }
        
        const findDashboard = sockets.of(`${path}/${org}/dashboard`).fn('date-range');
        const id = sess_my_org_id || selectedOrg.id;
        return findDashboard({id, dates});
    }
    
    async findByIdHRCompetenciesDateRangeDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDateRangeDashboardStatsByLoggedImpl(selectedOrg, 'competencies');
    }
    
    async findByIdHRContractsDateRangeDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDateRangeDashboardStatsByLoggedImpl(selectedOrg, 'contracts');
    }
    
    async findByIdHRCounselingsDateRangeDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDateRangeDashboardStatsByLoggedImpl(selectedOrg, 'counsellings');
    }
    
    async findByIdHRJobAppointmentsDateRangeDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDateRangeDashboardStatsByLoggedImpl(selectedOrg, 'structure-and-responsibility/job-appointments', true);
    }
    
    async findByIdHRLeavesDateRangeDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDateRangeDashboardStatsByLoggedImpl(selectedOrg, 'leaves');
    }
    
    async findByIdHRLicensesDateRangeDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDateRangeDashboardStatsByLoggedImpl(selectedOrg, 'licenses');
    }
    
    async findByIdHRMedicalsDateRangeDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDateRangeDashboardStatsByLoggedImpl(selectedOrg, 'medicals');
    }
    
    async findByIdHRWarningsDateRangeDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDateRangeDashboardStatsByLoggedImpl(selectedOrg, 'warnings');
    }
    
    async findByIdHRWorkPermitsDateRangeDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDateRangeDashboardStatsByLoggedImpl(selectedOrg, 'work-permits');
    }
    
    async findByIdHRPrDPDateRangeDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDateRangeDashboardStatsByLoggedImpl(selectedOrg, 'employees/documents/prdp', true);
    }
    
    async findByIdHRIDOrPassportDateRangeDashboardStatsByLogged(selectedOrg) {
        return this.findByIdHRModuleDateRangeDashboardStatsByLoggedImpl(selectedOrg, 'employees/documents/id-or-passports', true);
    }
    //</editor-fold>
    
    //<editor-fold desc="findByIdTrainingDashboardStatsByLogged">
    async findByIdTrainingDashboardStatsByLogged(selectedOrg) {
        const {[this.key]: sess_my_org_id, org} = this;
        
        const findDashboard = sockets.of(`trainings/${org}`).fn('dashboard');
        const id = sess_my_org_id || selectedOrg.id;
        return findDashboard({id});
    }
    
    //</editor-fold>
}

export default AOrgStore;
