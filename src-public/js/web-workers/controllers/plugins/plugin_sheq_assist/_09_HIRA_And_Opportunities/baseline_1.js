
(() => {
    class Controller extends AControllerAid {
        
        constructor(events, db) {
            super(events, db, {singular: "Baseline Risk Assessment", plural: "Baseline Risk Assessments"}, "plugin_sheq_assist/09_HIRA_And_Opportunities/baseline/", "plugin_sheq_assist_09_risk_assessment_baseline");

            this.search_by_name = this.search_by_name.bind(this);
            this.filter = this.filter.bind(this);
            const {addAction, search_by_name, filter} = this;
            addAction("list/search_by_name", search_by_name);
            addAction("list/filter", filter);
        }

        async search_by_name(evt, activity) {
            return this.filter(evt, {activity});
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {created_at, activity} = search_val;
                const q = [
                    {key: 'activity', comp: 'LIKE', val: activity},
                    {key: 'created_at', comp: '=', val: created_at}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();