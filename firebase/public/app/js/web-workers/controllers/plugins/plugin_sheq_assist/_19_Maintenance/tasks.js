
(() => {
    class Controller extends AControllerAssist {
        /* */
        constructor(events, db) {
            super(events, db, {singular: "Asset Task", plural: "Assets Tasks"}, "plugin_sheq_assist/19_Maintenance/tasks/", "plugin_sheq_assist_19_Maintenance_tasks");

            this.filter = this.filter.bind(this);
            const {addAction, filter} = this;
            addAction("list/filter", filter);
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {title, start, end} = search_val;
                const q = [
                    {key: 'title', comp: 'LIKE', val: title},
                    {key: 'start', comp: '>=', val: start},
                    {key: 'end', comp: '<=', val: end}
                ];
                return this.filter_impl(evt, q);
            });
        }

    }

    new Controller(events, db);
})();