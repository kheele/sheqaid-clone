
(() => {
    class Controller extends AEmployeeDocsController {
        constructor(events, db) {
            super(
                    events,
                    db,
                    {singular: "Employee Counselling", plural: "Employees Counsellings"},
                    "plugin_sheq_assist/employees/counselling/"
                    );

            this.collectionGroup = "employee_counselling_list";
        }

        async filter(evt, filterData, extraFilterData) {
            return this.filterImpl(evt, filterData, extraFilterData);
        }

    }

    new Controller(events, db);
})();