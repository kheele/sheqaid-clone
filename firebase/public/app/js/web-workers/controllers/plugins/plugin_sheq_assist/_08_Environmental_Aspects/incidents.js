
//importScripts(self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_08_Environmental_Aspects/incidents_cause_analysis.js");
//importScripts(self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_08_Environmental_Aspects/incidents_remedial_action_plan.js");
//import * as incidents_cause_analysis from './incidents_cause_analysis';
//import * as incidents_remedial_action_plan from './incidents_remedial_action_plan';

(() => {
    class Controller extends AControllerAssist {
        /*
         she_incident_date, she_incident_time, she_person_injured_id, she_contact_num,
         she_age, she_department_id, she_regulator_occupation, she_years_in_company_service,
         she_period_in_present_job, she_supervior_id, she_department_head_id,
         safety_incident_classification, safety_incident_parts_of_body_affected, safety_incident_effect_on_person, safety_incident_nature_of_incident,
         damage_incident_classification, damage_incident_man_causes, damage_incident_natural_causes,
         health_incident_classification, health_incident_occupational_stressor, health_incident_natural_disease,
         environmental_incident_classification, environmental_incident_type, environmental_incident_consequence, environmental_incident_severity, environmental_incident_state_of_pollutant, environmental_incident_quality_of_pollutant, environmental_incident_duration_of_pollution, environmental_incident_on_site_contained,
         investigator_designated, investigator_of_incident, investigator_incident_date
         */
        constructor(events, db) {
            super(events, db, {singular: "Environmental Aspects Incident", plural: "Environmental Aspects Incidents"}, "plugin_sheq_assist/08_Environmental_Aspects/incidents/", "plugin_sheq_assist_08_Environmental_Aspects_incidents");

            this.filter = this.filter.bind(this);
            const {addAction, filter} = this;
            addAction("list/filter", filter);
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {she_incident_date_range, she_department, investigator_of_incident, she_person_injured} = search_val;
                const q = [
                    {key: 'she_department', comp: 'LIKE', val: she_department},
                    {key: 'investigator_of_incident', comp: 'LIKE', val: investigator_of_incident},
                    {key: 'she_person_injured.id', comp: '=', val: she_person_injured}
                ];
                if (she_incident_date_range) {
                    q.push(...[
                        {key: 'she_incident_date', comp: '>=', val: she_incident_date_range.start},
                        {key: 'she_incident_date', comp: '<=', val: she_incident_date_range.end}
                    ]);
                }
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();