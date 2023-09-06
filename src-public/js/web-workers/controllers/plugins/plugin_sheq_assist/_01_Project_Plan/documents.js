
(() => {
    class Controller extends ADocumentCntr {
        //title, type, doc
        constructor(events) {
            super(events, {singular: "Company Document", plural: "Company Documents"}, "plugin_sheq_assist/01_Project_Plan/documents/");
            
            this.doc_type_key = "plugin_sheq_assist_01_Project_Plan_documents";
        }
    }

    new Controller(events);
})();