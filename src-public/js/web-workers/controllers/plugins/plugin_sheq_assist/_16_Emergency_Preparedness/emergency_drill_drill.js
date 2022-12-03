
(() => {
    class Controller extends AControllerAid {
        //area, manager_or_supervisor, date, team_member_list
        constructor(events, db) {
            super(events, db, {singular: "Emergency Drill", plural: "Emergency Drills"}, "plugin_sheq_assist/16_Emergency_Preparedness/emergency-drill/drill/", "plugin_sheq_assist_16_Emergency_Preparedness_emergency_drill_drill");

            this.search_by_name = this.search_by_name.bind(this);
            this.filter = this.filter.bind(this);
            const {addAction, search_by_name, filter} = this;
            addAction("list/search_by_name", search_by_name);
            addAction("list/filter", filter);
        }

        async search_by_name(evt, search_val) {
            return this.filter_by(evt, search_val, search_val => {
                return val => {
                    const {area} = val.data;
                    return area.toLowerCase().startsWith(search_val)
                };
            });
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {date, area, manager_or_supervisor} = search_val;
                const q = [
                    {key: 'area', comp: 'LIKE', val: area},
                    {key: 'manager_or_supervisor', comp: 'LIKE', val: manager_or_supervisor},
                    {key: 'date', comp: '=', val: date}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();