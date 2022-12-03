
(() => {
    class Controller extends AControllerAssist {
        //org_name, area, contacts
        constructor(events, db) {
            super(events, db, {singular: "External Emergency Number", plural: "External Emergency Numbers"}, "plugin_sheq_assist/16_Emergency_Preparedness/emergency-numbers/external/", "plugin_sheq_assist_16_Emergency_Preparedness_emergency_numbers_external");

            this.search_by_name = this.search_by_name.bind(this);
            this.filter = this.filter.bind(this);
            const {addAction, search_by_name, filter} = this;
            addAction("list/search_by_name", search_by_name);
            addAction("list/filter", filter);
        }

        async search_by_name(evt, search_val) {
            return this.filter_by(evt, search_val, search_val => {
                return val => {
                    const {org_name} = val.data;
                    return org_name.toLowerCase().startsWith(search_val)
                };
            });
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {org_name, area, contacts} = search_val;
                const q = [
                    {key: 'org_name', comp: 'LIKE', val: org_name},
                    {key: 'area', comp: 'LIKE', val: area},
                    {key: 'contacts', comp: 'LIKE', val: contacts}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();