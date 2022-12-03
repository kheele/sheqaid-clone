
(() => {
    class Controller extends ADocumentCntr {
        //title, type, doc
        constructor(events, db) {
            super(events, db, {singular: "Environmental Aspects Management Plan", plural: "Environmental Aspects Management Plans"}, "plugin_sheq_assist/08_Environmental_Aspects/emp/");
        
            this.doc_type_key = "plugin_sheq_assist_08_Environmental_Aspects_emp";
        }
    }

    new Controller(events, db);
})();