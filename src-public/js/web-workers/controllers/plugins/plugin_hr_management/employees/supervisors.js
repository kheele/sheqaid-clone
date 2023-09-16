
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events) {
            super(events, {singular: "Supervisor", plural: "Supervisors"}, "plugin_sheq_assist/employees/supervisors/");

        }
        // </editor-fold>

        getDB() {
            return db_hr;
        }

    }

    new Controller(events);
})();