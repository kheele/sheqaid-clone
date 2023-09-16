
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events) {
            super(events, {singular: "Employee PPE", plural: "Employees PPEs"}, "plugin_sheq_assist/employees/ppe/", "plugin_sheq_assist_ppe");

        }
        // </editor-fold>

        getDB() {
            return db2;
        }

    }

    new Controller(events);
})();