
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events) {
            super(events, {singular: "Employee Team", plural: "Employees Teams"}, "plugin_sheq_assist/employees/teams/", "plugin_sheq_assist_teams");

        }
        // </editor-fold>

        getDB() {
            return db_hr;
        }

    }

    new Controller(events);
})();