
(() => {
    class Controller extends AControllerAid {
        //surveyed_by_id, date, list
        constructor(events, db) {
            super(events, db, {singular: "Environmental Aspects Pollution Register", plural: "Environmental Aspects Pollution Registers"}, "plugin_sheq_assist/08_Environmental_Aspects/pollution-register/", "plugin_sheq_assist_08_Environmental_Aspects_pollution_register");

            this.filter = this.filter.bind(this);
            const {addAction, filter} = this;
            addAction("list/filter", filter);
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {date, surveyed_by} = search_val;
                const q = [
                    [
                        {key: 'surveyed_by.fname', comp: 'LIKE', val: surveyed_by},
                        {key: 'surveyed_by.lname', comp: 'LIKE', val: surveyed_by}
                    ],
                    {key: 'date', comp: '=', val: date}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();