
(() => {
    class Controller extends AControllerAid {
        //training_id, trainer_id, time_or_duration, date, list_proof, list_table
        constructor(events) {
            super(events, {singular: "Key Performance Indicator", plural: "Key Performance Indicators"}, "plugin_sheq_assist/06_Communication_And_Participation/kpi/", "plugin_sheq_assist_06_Communication_And_Participation_kpi");

            const {addAction} = this;
            addAction("dashboard/count", this.dashboard_count.bind(this));
            addAction("list/filter", this.filter.bind(this));
        }

        // <editor-fold defaultstate="collapsed" desc="dashboard_count">
        async dashboard_count(evt, opts = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                return 0;
            });
        }
        // </editor-fold>

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

    new Controller(events);
})();