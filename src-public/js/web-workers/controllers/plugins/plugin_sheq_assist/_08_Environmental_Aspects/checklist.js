
(() => {
    class Controller extends ADocumentCntr {
        //title, type, doc
        constructor(events) {
            super(events, {singular: "Environmental Aspects Checklist", plural: "Environmental Aspects Checklists"}, "plugin_sheq_assist/08_Environmental_Aspects/checklist/");
        
            this.doc_type_key = "plugin_sheq_assist_08_Environmental_Aspects_checklist";
        }
    }

    new Controller(events);
})();