class Settings {
    static isValid(item, k) {
        if (storage.is.isEmployee) return true;

        const {user: {data: {settings_list, linked_employee_id}},} = storage.loggedUser;
        if (linked_employee_id === item.id) return true;

        return (settings_list || []).anyMatch(({settings_category: {key}}) => key === k);
    }

    static isValidEmployeeAllDocumentsViewers(item) {
        return Settings.isValidEmployeeSignableDocumentsViewers(item) ||
            Settings.isValidEmployeePersonalDocumentsViewers(item) ||
            Settings.isEmployeeCompetencyViewers(item) ||
            Settings.isEmployeeContractsViewers(item) ||
            Settings.isEmployeeJobAppointmentsViewers(item) ||
            Settings.isEmployeeCounselingViewers(item) ||
            Settings.isEmployeeMedicalFitnessViewers(item) ||
            Settings.isEmployeeWarningViewers(item);
    }

    static isValidEmployeeSignableDocumentsViewers(item) {
        return Settings.isValid(item, "Employee Signable Documents Viewers");
    }

    static isValidEmployeePersonalDocumentsViewers(item) {
        return Settings.isValid(item, "Employee Personal Documents Viewers");
    }

    static isValidEmployeeNextOfKinViewers(item) {
        return Settings.isValid(item, "Employee Next Of Kin Viewers");
    }

    static isValidEmployeeDependantsViewers(item) {
        return Settings.isValid(item, "Employee Dependants Viewers");
    }

    static isValidEmployeeDependantsAndNextOfKinViewers(item) {
        return Settings.isValidEmployeeNextOfKinViewers(item) || Settings.isValidEmployeeDependantsViewers(item);
    }

    static isEmployeeCompetencyViewers(item) {
        return Settings.isValid(item, "Employee Competency Viewers");
    }

    static isEmployeeContractsViewers(item) {
        return Settings.isValid(item, "Employee Contracts Viewers");
    }

    static isEmployeeJobAppointmentsViewers(item) {
        return Settings.isValid(item, "Employee Job Appointments Viewers");
    }

    static isEmployeeCounselingViewers(item) {
        return Settings.isValid(item, "Employee Counseling Viewers");
    }

    static isEmployeeMedicalFitnessViewers(item) {
        return Settings.isValid(item, "Employee Medical Fitness Viewers");
    }

    static isEmployeeWarningViewers(item) {
        return Settings.isValid(item, "Employee Warning Viewers");
    }

    static isEmployeeTimeOffViewers(item) {
        return Settings.isValid(item, "Employee Time-Off Viewers");
    }

    static isEmployeeLivingAddressViewers(item) {
        return Settings.isValid(item, "Employee Living Address Viewers");
    }

    static isEmployeeBankingDetailsViewers(item) {
        return Settings.isValid(item, "Employee Banking Details Viewers");
    }

    static isEmployeeContactDetailsViewers(item) {
        return Settings.isValid(item, "Employee Contact Details Viewers");
    }
}

export default Settings;
