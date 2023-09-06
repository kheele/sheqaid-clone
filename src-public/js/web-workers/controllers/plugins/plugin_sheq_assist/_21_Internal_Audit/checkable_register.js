
(() => {
    class Controller extends AInternalAuditCheckablesController {
        //title, type, document
        constructor(events) {
            super(events, {singular: "Internal Audit Register", plural: "Internal Audit Registers"}, "plugin_sheq_assist/21_Internal_Audit/register/", "plugin_sheq_assist_21_Internal_Audit_register");
        }
    }

    new Controller(events);
})();