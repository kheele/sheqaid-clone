
(() => {
    class Controller extends AInternalAuditCheckablesController {
        //title, type, document
        constructor(events) {
            super(events, {singular: "Internal Audit Inspection", plural: "Internal Audit Inspections"}, "plugin_sheq_assist/21_Internal_Audit/inspection/", "plugin_sheq_assist_21_Internal_Audit_inspection");
        }
    }

    new Controller(events);
})();