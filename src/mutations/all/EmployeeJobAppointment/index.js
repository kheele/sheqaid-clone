import AStore from "../AStore";
import listAllActiveEmployeeJobAppointmentByLoggedSite from "./listAllActiveEmployeeJobAppointmentByLoggedSite";
import listAllActiveEmployeeJobAppointmentByLoggedProject from "./listAllActiveEmployeeJobAppointmentByLoggedProject";
import listAllActiveEmployeeJobAppointmentByLoggedClient from "./listAllActiveEmployeeJobAppointmentByLoggedClient";
import listAllActiveEmployeeJobAppointmentByLoggedCompany from "./listAllActiveEmployeeJobAppointmentByLoggedCompany";
import listAllActiveEmployeeJobAppointmentByDepartment from "./listAllActiveEmployeeJobAppointmentByDepartment";
import listAllActiveEmployeeJobAppointmentByJobPosition from "./listAllActiveEmployeeJobAppointmentByJobPosition";
import listAllActiveEmployeeJobAppointmentByJobCategory from "./listAllActiveEmployeeJobAppointmentByJobCategory";
import listAllActiveEmployeeJobAppointmentBySupervisor from "./listAllActiveEmployeeJobAppointmentBySupervisor";
import listAllActiveEmployeeJobAppointmentByTeam from "./listAllActiveEmployeeJobAppointmentByTeam";
import updateEmployeeJobAppointment from "./updateEmployeeJobAppointment";

class Store extends AStore{

    async restore(item) {
        return updateEmployeeJobAppointment({id: item.id, removed: false});
    }

    async listAllByLogged(removed) {
        return super.listAllByLogged(
            {
                removed,
                byLoggedSite: listAllActiveEmployeeJobAppointmentByLoggedSite,
                byLoggedProject: listAllActiveEmployeeJobAppointmentByLoggedProject,
                byLoggedClient: listAllActiveEmployeeJobAppointmentByLoggedClient,
                byLoggedCompany: listAllActiveEmployeeJobAppointmentByLoggedCompany,
            }
        );
    }

    async listAllByDepartment(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeJobAppointmentByDepartment(id);
    }

    async listAllByJobPosition(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeJobAppointmentByJobPosition(id);
    }

    async listAllByJobCategory(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeJobAppointmentByJobCategory(id);
    }

    async listAllBySupervisor(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeJobAppointmentBySupervisor(id);
    }

    async listAllByTeam(item) {
        let id = this.extractId(item);
        if(!id) return [];
        return listAllActiveEmployeeJobAppointmentByTeam(id);
    }
}

const employeeJobAppointmentActiveStore = new Store();
export default employeeJobAppointmentActiveStore;