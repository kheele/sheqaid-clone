
class Cntr extends ACntr {
    constructor(Functions) {
        super(Functions, 'plugin_sheq_assist/21_Internal_Audit/forms/', 'plugin_sheq_assist_21_Internal_Audit_forms');
    }
}

exports.run = (Functions) => {
    new Cntr(Functions);
};