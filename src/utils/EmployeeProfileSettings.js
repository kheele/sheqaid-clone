class EmployeeProfileSettings {
    static isValid(item, k) {
        if (!item || storage.is.isEmployee) return true;

        const {user: {data: {settings_list, linked_employee_id}},} = storage.loggedUser;
        if (linked_employee_id === item.id) return true;

        return (settings_list || []).anyMatch(({settings_category: {key}}) => key === k);
    }

    static isValidEmployeeAllDocumentsViewers(item) {
        return EmployeeProfileSettings.isValidEmployeeSignableDocumentsViewers(item) ||
            EmployeeProfileSettings.isValidEmployeePersonalDocumentsViewers(item) ||
            EmployeeProfileSettings.isEmployeeCompetencyViewers(item) ||
            EmployeeProfileSettings.isEmployeeContractsViewers(item) ||
            EmployeeProfileSettings.isEmployeeJobAppointmentsViewers(item) ||
            EmployeeProfileSettings.isEmployeeCounselingViewers(item) ||
            EmployeeProfileSettings.isEmployeeMedicalFitnessViewers(item) ||
            EmployeeProfileSettings.isEmployeeWarningViewers(item);
    }

    static isValidEmployeeSignableDocumentsViewers(item) {
        return EmployeeProfileSettings.isValid(item, "Employee Signable Documents Viewers");
    }

    static isValidEmployeePersonalDocumentsViewers(item) {
        return EmployeeProfileSettings.isValid(item, "Employee Personal Documents Viewers");
    }

    static isValidEmployeeNextOfKinViewers(item) {
        return EmployeeProfileSettings.isValid(item, "Employee Next Of Kin Viewers");
    }

    static isValidEmployeeDependantsViewers(item) {
        return EmployeeProfileSettings.isValid(item, "Employee Dependants Viewers");
    }

    static isValidEmployeeDependantsAndNextOfKinViewers(item) {
        return EmployeeProfileSettings.isValidEmployeeNextOfKinViewers(item) || EmployeeProfileSettings.isValidEmployeeDependantsViewers(item);
    }

    static isEmployeeCompetencyViewers(item) {
        return EmployeeProfileSettings.isValid(item, "Employee Competency Viewers");
    }

    static isEmployeeContractsViewers(item) {
        return EmployeeProfileSettings.isValid(item, "Employee Contracts Viewers");
    }

    static isEmployeeJobAppointmentsViewers(item) {
        return EmployeeProfileSettings.isValid(item, "Employee Job Appointments Viewers");
    }

    static isEmployeeCounselingViewers(item) {
        return EmployeeProfileSettings.isValid(item, "Employee Counseling Viewers");
    }

    static isEmployeeMedicalFitnessViewers(item) {
        return EmployeeProfileSettings.isValid(item, "Employee Medical Fitness Viewers");
    }

    static isEmployeeWarningViewers(item) {
        return EmployeeProfileSettings.isValid(item, "Employee Warning Viewers");
    }

    static isEmployeeTimeOffViewers(item) {
        return EmployeeProfileSettings.isValid(item, "Employee Time-Off Viewers");
    }

    static isEmployeeLivingAddressViewers(item) {
        return EmployeeProfileSettings.isValid(item, "Employee Living Address Viewers");
    }

    static isEmployeeBankingDetailsViewers(item) {
        return EmployeeProfileSettings.isValid(item, "Employee Banking Details Viewers");
    }

    static isEmployeeContactDetailsViewers(item) {
        return EmployeeProfileSettings.isValid(item, "Employee Contact Details Viewers");
    }
}

export default EmployeeProfileSettings;
