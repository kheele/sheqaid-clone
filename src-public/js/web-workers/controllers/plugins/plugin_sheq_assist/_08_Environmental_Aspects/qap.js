
(() => {
    class Controller extends ADocumentCntr {
        //title, type, doc
        constructor(events, db) {
            super(events, db, {singular: "Environmental Aspects Quality Assurance Plan", plural: "Environmental Aspects Quality Assurance Plans"}, "plugin_sheq_assist/08_Environmental_Aspects/qap/");
        
            this.doc_type_key = "plugin_sheq_assist_08_Environmental_Aspects_qap";
        }
    }

    new Controller(events, db);
})();