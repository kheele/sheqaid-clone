
(() => {
    class Controller extends ADocumentCntr {
        //title, type, doc
        constructor(events) {
            super(events, {singular: "COVID Management Document", plural: "COVID Management Documents"}, "plugin_sheq_assist/COVID_Management/documents/");
            
            this.doc_type_key = "plugin_sheq_assist_COVID_Management_documents";
        }
    }

    new Controller(events);
})();