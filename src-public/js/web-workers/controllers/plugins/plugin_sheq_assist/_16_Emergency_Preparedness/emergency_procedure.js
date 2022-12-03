
(() => {
    class Controller extends ADocumentCntr {
        //title, type, doc
        constructor(events, db) {
            super(events, db, {singular: "Emergency Procedure", plural: "Emergency Procedures"}, "plugin_sheq_assist/16_Emergency_Preparedness/emergency-procedure/");
        
            this.doc_type_key = "plugin_sheq_assist_16_Emergency_Preparedness_emergency_procedure";
        }
    }

    new Controller(events, db);
})();