
class Cntr extends ACntr {
    constructor(Functions) {
        super(Functions, 'plugin_sheq_assist/21_Internal_Audit/safety-observations-report/', 'plugin_sheq_assist_21_Internal_Audit_safety_observations_report');
    }
}

exports.run = (Functions) => {
    new Cntr(Functions);
};