
(() => {
    class Controller extends AControllerAssist {
        //training_id, trainer_id, time_or_duration, date, list_proof, list_table
        constructor(events, db) {
            super(events, db, {singular: "Key Performance Indicator", plural: "Key Performance Indicators"}, "plugin_sheq_assist/06_Communication_And_Participation/kpi/", "plugin_sheq_assist_06_Communication_And_Participation_kpi");

            this.filter = this.filter.bind(this);
            const {addAction, filter} = this;
            addAction("list/filter", filter);
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {created_at, target_group, name} = search_val;
                const q = [
                    {key: 'name', comp: 'LIKE', val: name},
                    {key: 'target_group', comp: '=', val: target_group},
                    {key: 'created_at', comp: '=', val: created_at}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();