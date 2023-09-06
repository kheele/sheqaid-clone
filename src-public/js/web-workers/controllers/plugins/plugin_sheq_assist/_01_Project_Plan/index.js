
(() => {
    class Controller extends ADocumentCntr {
        //title, type, doc
        constructor(events) {
            super(events, {singular: "Project Plan", plural: "Project Plans"}, "plugin_sheq_assist/01_Project_Plan/");
        
            this.doc_type_key = "plugin_sheq_assist_01_Project_Plan";
        }

    }

    new Controller(events);
})();