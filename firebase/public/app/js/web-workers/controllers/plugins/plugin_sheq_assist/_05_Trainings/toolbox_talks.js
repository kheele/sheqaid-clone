
(() => {
    class Controller extends ADocumentCntr {
        //title, type, doc
        constructor(events, db) {
            super(events, db, {singular: "Training Toolbox Talks", plural: "Training Toolbox Talks"}, "plugin_sheq_assist/05_Training/toolbox-talks/");
        
            this.doc_type_key = "plugin_sheq_assist_05_Training_toolbox_talks";
        }
    }

    new Controller(events, db);
})();