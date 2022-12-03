
(() => {
    class Controller extends AControllerAid {
        /*
         non_conformance_num, date_recorded, idendified_by, department_or_area,
         non_conformance_desc,
         non_conformance_cause,
         proposed_corrective_actions_to_be_taken_to_prevent_recurrence,
         author1_name, environmental_representative, date_of_action_to_be_completed_by, evidence,
         author2_name, non_conformance_closed, date, further_info
         */
        constructor(events, db) {
            super(events, db, {singular: "Environmental Aspects Non-Conformance Report", plural: "Environmental Aspects Non-Conformance Reports"}, "plugin_sheq_assist/08_Environmental_Aspects/ncr/", "plugin_sheq_assist_08_Environmental_Aspects_ncr");

            this.filter = this.filter.bind(this);
            const {addAction, filter} = this;
            addAction("list/filter", filter);
        }

        async search_by_name(evt, search_val) {
            return this.filter_by(evt, search_val, search_val => {
                return val => {
                    const {name} = val.data;
                    return name.toLowerCase().startsWith(search_val)
                };
            });
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {date_recorded, non_conformance_num, identified_by, department_or_area} = search_val;
                const q = [
                    {key: 'non_conformance_num', comp: '=', val: non_conformance_num},
                    {key: 'identified_by', comp: 'LIKE', val: identified_by},
                    {key: 'department_or_area', comp: 'LIKE', val: department_or_area},
                    {key: 'date_recorded', comp: '=', val: date_recorded}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();