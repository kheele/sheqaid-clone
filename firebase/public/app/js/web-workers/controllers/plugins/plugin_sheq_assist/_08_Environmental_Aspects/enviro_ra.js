
(() => {
    class Controller extends AControllerAssist {
        //issue, hazard, consequence, impact, etc
        constructor(events, db) {
            super(events, db, {singular: "Environmental Aspects Risk Assessment", plural: "Environmental Aspects Risk Assessments"}, "plugin_sheq_assist/08_Environmental_Aspects/enviro-ra/", "plugin_sheq_assist_08_Environmental_Aspects_enviro_ra");

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
                const {created_at, title} = search_val;
                const q = [
                    {key: 'created_at', comp: '=', val: created_at},
                    {key: 'title', comp: 'LIKE', val: title}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();