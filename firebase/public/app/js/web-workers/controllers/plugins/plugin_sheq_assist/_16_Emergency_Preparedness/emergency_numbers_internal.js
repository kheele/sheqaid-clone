
(() => {
    class Controller extends AControllerAssist {
        //name, designation, contacts
        constructor(events, db) {
            super(events, db, {singular: "Internal Emergency Number", plural: "Internal Emergency Numbers"}, "plugin_sheq_assist/16_Emergency_Preparedness/emergency-numbers/internal/", "plugin_sheq_assist_16_Emergency_Preparedness_emergency_numbers_internal");

            this.search_by_name = this.search_by_name.bind(this);
            this.filter = this.filter.bind(this);
            const {addAction, search_by_name, filter} = this;
            addAction("list/search_by_name", search_by_name);
            addAction("list/filter", filter);
        }

        async search_by_name(evt, search_val) {
            return this.filter_by(evt, search_val, search_val => {
                return val => {
                    const {name} = val.data;
                    return name.toLowerCase().startsWith(search_val)
                };
            });
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name, designation, contacts} = search_val;
                const q = [
                    {key: 'name', comp: 'LIKE', val: name},
                    {key: 'designation', comp: 'LIKE', val: designation},
                    {key: 'contacts', comp: 'LIKE', val: contacts}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();