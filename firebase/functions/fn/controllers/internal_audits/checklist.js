
class Cntr extends ACntr {
    constructor(Functions) {
        super(Functions, 'plugin_sheq_assist/21_Internal_Audit/checklist/', 'plugin_sheq_assist_21_Internal_Audit_checklist');
    }
}

exports.run = (Functions) => {
    new Cntr(Functions);
};