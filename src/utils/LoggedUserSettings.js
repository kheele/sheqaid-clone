class LoggedUserSettings {
    static isValid(k) {
        const {user: {data: {settings_list}},} = storage.loggedUser;
        return (settings_list || []).anyMatch(({settings_category: {key}}) => key === k);
    }

    static isValidEmployeeAllDocumentsViewers() {
        return LoggedUserSettings.isValidEmployeeSignableDocumentsViewers() ||
            LoggedUserSettings.isValidEmployeePersonalDocumentsViewers() ||
            LoggedUserSettings.isEmployeeCompetencyViewers() ||
            LoggedUserSettings.isEmployeeContractsViewers() ||
            LoggedUserSettings.isEmployeeJobAppointmentsViewers() ||
            LoggedUserSettings.isEmployeeCounselingViewers() ||
            LoggedUserSettings.isEmployeeMedicalFitnessViewers() ||
            LoggedUserSettings.isEmployeeWarningViewers();
    }

    static isValidEmployeeSignableDocumentsViewers() {
        return LoggedUserSettings.isValid("Employee Signable Documents Viewers");
    }

    static isValidEmployeePersonalDocumentsViewers() {
        return LoggedUserSettings.isValid("Employee Personal Documents Viewers");
    }

    static isValidEmployeeNextOfKinViewers() {
        return LoggedUserSettings.isValid("Employee Next Of Kin Viewers");
    }

    static isValidEmployeeDependantsViewers() {
        return LoggedUserSettings.isValid("Employee Dependants Viewers");
    }

    static isValidEmployeeDependantsAndNextOfKinViewers() {
        return LoggedUserSettings.isValidEmployeeNextOfKinViewers() || LoggedUserSettings.isValidEmployeeDependantsViewers();
    }

    static isEmployeeCompetencyViewers() {
        return LoggedUserSettings.isValid("Employee Competency Viewers");
    }

    static isEmployeeContractsViewers() {
        return LoggedUserSettings.isValid("Employee Contracts Viewers");
    }

    static isEmployeeJobAppointmentsViewers() {
        return LoggedUserSettings.isValid("Employee Job Appointments Viewers");
    }

    static isEmployeeCounselingViewers() {
        return LoggedUserSettings.isValid("Employee Counseling Viewers");
    }

    static isEmployeeMedicalFitnessViewers() {
        return LoggedUserSettings.isValid("Employee Medical Fitness Viewers");
    }

    static isEmployeeWarningViewers() {
        return LoggedUserSettings.isValid("Employee Warning Viewers");
    }

    static isEmployeeTimeOffViewers() {
        return LoggedUserSettings.isValid("Employee Time-Off Viewers");
    }

    static isEmployeeTimeOffApproversViewers() {
        return LoggedUserSettings.isValid("Employee Time-Off Approvers Viewers");
    }

    static isEmployeeLivingAddressViewers() {
        return LoggedUserSettings.isValid("Employee Living Address Viewers");
    }

    static isEmployeeBankingDetailsViewers() {
        return LoggedUserSettings.isValid("Employee Banking Details Viewers");
    }

    static isEmployeeContactDetailsViewers() {
        return LoggedUserSettings.isValid("Employee Contact Details Viewers");
    }

    static isExpenseApprovers() {
        return LoggedUserSettings.isValid("Employee Contact Details Viewers");
    }
}

export default LoggedUserSettings;
