
(() => {
    class Controller extends AControllerAid {
        /*incident, incident_type, incident_whats_involved,
         injury_type, health_or_diseases, indicate, 
         witness, person_injured, person_injured_contact_num, 
         incident_date, incident_time, report_date, report_time,
         human_cause, natural_cause, occupational_stressor_classification,
         desc, who_or_what_caused, whats_damaged, 
         suggested_preemptive_action, suggested_preemptive_action_options,
         affected_person_name, form_completed_by, reported_to, 
         supervior_or_manager*/
        constructor(events) {
            super(events, {singular: "Incident Investigation Corrective Action", plural: "Incident Investigation  Corrective Actions"}, "plugin_sheq_assist/17_Incident_Investigation/corrective-actions/");

            this.tbl = 'plugin_sheq_assist_17_Incident_Investigation';

            const {addAction} = this;
            
            addAction("list/filter", this.filter.bind(this));
            addAction("stats", this.stats.bind(this));
        }

        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerAid.prototype.list.call(this, evt);
                return list.filter(({data: {investigation}}) => {
                    return !!investigation && !!investigation.sec5_data && !!investigation.sec5_data.corrective_actions;
                });
            });
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {incident_date_range, incident_status, investigation_status, sub_category} = search_val;
                const q = [
                    {key: 'incident_status', comp: '=', val: incident_status},
                    {key: 'investigation_status', comp: '=', val: investigation_status},
                    // {key: 'type', comp: '=', val: type}
                ];
                if (incident_date_range) {
                    q.push(...[
                        {key: 'incident_date', comp: '>=', val: incident_date_range.start},
                        {key: 'incident_date', comp: '<=', val: incident_date_range.end}
                    ]);
                }
                return this.filter_impl(evt, q);
            });
        }

        async stats(evt, yr) {
            return _17_Incident_Investigation_stats.call(this, evt, yr);
        }
    }

    new Controller(events);
})();