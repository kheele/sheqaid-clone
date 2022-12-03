
(() => {
    class Controller extends AControllerAid {
        /*
         shift, drill_type, 
         drill_date, drill_start_time, drill_end_time, drill_total_time,
         alarm_worked_properly, describe_what_happened_when_alarmed,
         all_areas_heard_alarm, specify_if_not,
         people_evacuated_properly, describe_situation,
         individuals_not_performed_properly, personnel_name_for_further_training,
         communication_between_chain,
         observer_report_or_remarks_note,
         signature, signature_date
         */
        constructor(events, db) {
            super(events, db, {singular: "Emergency Drill Report", plural: "Emergency Drills Reports"}, "plugin_sheq_assist/16_Emergency_Preparedness/emergency-drill/report/", "plugin_sheq_assist_16_Emergency_Preparedness_emergency_drill_report");

            this.search_by_name = this.search_by_name.bind(this);
            this.filter = this.filter.bind(this);
            const {addAction, search_by_name, filter} = this;
            addAction("list/search_by_name", search_by_name);
            addAction("list/filter", filter);
        }

        async search_by_name(evt, search_val) {
            return this.filter_by(evt, search_val, search_val => {
                return val => {
                    const {title} = val.data;
                    return title.toLowerCase().startsWith(search_val)
                };
            });
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {drill_date, drill_type, shift} = search_val;
                const q = [
                    {key: 'shift', comp: 'LIKE', val: shift},
                    {key: 'drill_type', comp: '=', val: drill_type},
                    {key: 'drill_date', comp: '=', val: drill_date}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();