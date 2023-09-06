
(() => {
    class Controller extends AControllerAid {
        //area, manager_or_supervisor, date, team_member_list
        constructor(events) {
            super(events, {singular: "Environmental Aspects Report", plural: "Environmental Aspects Reports"}, "plugin_sheq_assist/08_Environmental_Aspects/reports/");
            this.stats = this.stats.bind(this);
            const {addAction, stats} = this;
            addAction("stats", stats);
        }

        async stats(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                const incidents = await Events.get('plugin_sheq_assist/08_Environmental_Aspects/incidents/');
                const incidents_list = await incidents.list(evt);

                let res = {
                    stats_count: {
                        incidents: incidents_list.length
                    }
                };

                return res;
            });
        }
    }

    new Controller(events);
})();