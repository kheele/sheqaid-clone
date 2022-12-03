
(() => {
    class Controller extends AControllerAssist {
        //title, date, list
        constructor(events, db) {
            super(events, db, {singular: "Emergency Drill Matrix", plural: "Emergency Drills Matrixes"}, "plugin_sheq_assist/16_Emergency_Preparedness/emergency-drill/matrix/", "plugin_sheq_assist_16_Emergency_Preparedness_emergency_drill_matrix");

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
                const {title, date} = search_val;
                const q = [
                    {key: 'title', comp: 'LIKE', val: title},
                    {key: 'date', comp: '=', val: date}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();