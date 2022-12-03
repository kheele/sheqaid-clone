
(() => {
    class Controller extends AControllerAssist {
    /*
     incident_desc, she_representative_signature, date,
     incident_cause, incident_direct_cause, incident_root_cause,
     remedial_or_corrective_action_list,
     management_name, management_signature, management_signature_date,
     above_action_implemented_and_effective, proof_of_action_attached, notes,
     is_there_possible_new_or_additional_risks_in_terms_of_safety, is_there_possible_new_or_additional_risks_in_terms_of_health, is_there_possible_new_or_additional_risks_in_terms_of_environment, additional_hazards_or_risks_and_action_to_take_list,
     incident_assessor_name, incident_assessor_signature, incident_assessor_signature_date
     */
    constructor(events, db) {
        super(events, db, {singular: "Environmental Aspects Incident Remedial Action Plan", plural: "Environmental Aspects Incidents Remedial Action Plans"}, "plugin_sheq_assist/08_Environmental_Aspects/incidents/remedial-action-plan/", "plugin_sheq_assist_08_Environmental_Aspects_incidents_remedial_action_plan");
                
        this.filter = this.filter.bind(this);
        const {addAction, filter} = this;
        addAction("list/filter", filter);
    }

    async filter(evt, search_val) {
        return Events.whenLoggedIn(async loggedUser => {
            const {person_involved_name, she_department_name, she_committee_chairperson_name, management_name, incident_assessor_name, date} = search_val;
            const q = [
                {key: 'person_involved_name', comp: 'LIKE', val: person_involved_name},
                {key: 'she_department_name', comp: 'LIKE', val: she_department_name},
                {key: 'she_committee_chairperson_name', comp: 'LIKE', val: she_committee_chairperson_name},
                {key: 'management_name', comp: 'LIKE', val: management_name},
                {key: 'incident_assessor_name', comp: 'LIKE', val: incident_assessor_name},
                {key: 'date', comp: '=', val: date}
            ];
            return this.filter_impl(evt, q);
        });
    }
}

    new Controller(events, db);
})();