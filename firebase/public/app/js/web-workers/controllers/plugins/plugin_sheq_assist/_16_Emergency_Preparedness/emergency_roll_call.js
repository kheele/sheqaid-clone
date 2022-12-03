
(() => {
    class Controller extends AControllerAssist {
        //department, division, location, floor, date, floor_warden_name
        constructor(events, db) {
            super(events, db, {singular: "Emergency Roll Call", plural: "Emergency Roll Calls"}, "plugin_sheq_assist/16_Emergency_Preparedness/emergency-roll-call/", "plugin_sheq_assist_16_Emergency_Preparedness_emergency_roll_call");

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
                const {date, department, division, location, floor, floor_warden_name} = search_val;
                const q = [
                    {key: 'department', comp: 'LIKE', val: department},
                    {key: 'division', comp: 'LIKE', val: division},
                    {key: 'location', comp: 'LIKE', val: location},
                    {key: 'floor', comp: 'LIKE', val: floor},
                    {key: 'floor_warden_name', comp: 'LIKE', val: floor_warden_name},
                    {key: 'date', comp: '=', val: date}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();