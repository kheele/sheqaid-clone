
class Cntr extends ACntr {
    constructor(Functions) {
        super(Functions, 'plugin_sheq_assist/21_Internal_Audit/construction-audits/', 'plugin_sheq_assist_21_Internal_Audit_construction_audits');
    }
}

exports.run = (Functions) => {
    new Cntr(Functions);
};