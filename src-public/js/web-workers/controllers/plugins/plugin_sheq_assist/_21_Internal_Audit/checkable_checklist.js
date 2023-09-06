
(() => {
    class Controller extends AInternalAuditCheckablesController {
        //title, type, document
        constructor(events) {
            super(events, {singular: "Internal Audit Checklist", plural: "Internal Audit Checklists"}, "plugin_sheq_assist/21_Internal_Audit/checklist/", "plugin_sheq_assist_21_Internal_Audit_checklist");
        }
    }

    new Controller(events);
})();