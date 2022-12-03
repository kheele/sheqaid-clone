
(() => {
    class Controller extends AControllerAssist {
    /*
     she_incident_cost_list, 
     general_agents, occupational_health_or_environmental_agents, 
     sub_standard_practice_or_unsafe_act_list, sub_standard_condition_or_unsafe_condition_list,
     pesonal_factor_list, job_factor_list,
     addressing_pesonal_factor_list, addressing_job_factor_list
     */
    constructor(events, db) {
        super(events, db, {singular: "Environmental Aspects Incident Cause Analysis", plural: "Environmental Aspects Incidents Cause Analysis"}, "plugin_sheq_assist/08_Environmental_Aspects/incidents/cause-analysis/", "plugin_sheq_assist_08_Environmental_Aspects_incidents_cause_analysis");
        
        this.filter = this.filter.bind(this);
        const {addAction, filter} = this;
        addAction("list/filter", filter);
    }

    async filter(evt, search_val) {
        return Events.whenLoggedIn(async loggedUser => {
            const {general_agents, occupational_health_or_environmental_agents, total_cost_from, total_cost_to} = search_val;
            const q = [
                {key: 'inArray(general_agents)', comp: '=', val: general_agents},
                {key: 'inArray(occupational_health_or_environmental_agents)', comp: '=', val: occupational_health_or_environmental_agents},
                {key: 'sumInArray(she_incident_cost_list.cost)', comp: '>=', val: total_cost_from},
                {key: 'sumInArray(she_incident_cost_list.cost)', comp: '<=', val: total_cost_to}
            ];
            return this.filter_impl(evt, q);
        });
    }
}

    new Controller(events, db);
})();