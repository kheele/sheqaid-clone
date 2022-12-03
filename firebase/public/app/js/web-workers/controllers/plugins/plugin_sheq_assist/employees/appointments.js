
(() => {
    class Controller extends AControllerAssist {
        constructor(events, db) {
            super(events, db, {singular: "Employee Appointment", plural: "Employees Appointments"}, "plugin_sheq_assist/employees/appointments/", "plugin_sheq_assist_employee_appointments");

            this.filter = this.filter.bind(this);
            const {addAction, filter} = this;
            addAction("list/filter", filter);
        }

        async create(evt, data) {
            return await this.createAndUploadIfFile(evt, data, "doc");
        }

        async remove(evt, id) {
            return this.removeWithFile(evt, id, async ({data: {doc}}) => {
                doc && await files.remove(doc);
            });
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {title} = search_val;
                const q = [
                    {key: 'title', comp: 'LIKE', val: title}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();