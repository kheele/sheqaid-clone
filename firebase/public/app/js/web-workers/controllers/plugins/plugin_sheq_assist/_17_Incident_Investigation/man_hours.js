
(() => {
    class Controller extends AControllerAssist {
        /*year, month, fiscal_year,
         num_of_employees, hrs_worked_by_employees, employees_absent_hrs, employees_tranport_hrs, employees_exposure_hrs, employees_num_of_days_lost, 
         num_of_contractor_employees, hrs_worked_by_contractor, contractor_employees_absent_hrs, contractor_employees_tranport_hrs, contractor_employees_exposure_hrs, contractor_employees_num_of_days_lost 
         */
        constructor(events, db) {
            super(events, db, {singular: "Incident Investigation Man Hours", plural: "Incident Investigation Man Hours"}, "plugin_sheq_assist/17_Incident_Investigation/man-hours/", "plugin_sheq_assist_17_Incident_Investigation_man_hours");

            this.search_by_name = this.search_by_name.bind(this);
            this.filter = this.filter.bind(this);
            const {addAction, search_by_name, filter} = this;
            addAction("list/search_by_name", search_by_name);
            addAction("list/filter", filter);
        }

        async search_by_name(evt, search_val) {
            return this.filter_by(evt, search_val, search_val => {
                return val => {
                    const {title} = val.data;
                    return title.toLowerCase().startsWith(search_val)
                };
            });
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {year, month, fiscal_year} = search_val;
                const q = [
                    {key: 'year', comp: '=', val: year},
                    {key: 'month', comp: '=', val: month},
                    {key: 'fiscal_year', comp: '=', val: fiscal_year}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();