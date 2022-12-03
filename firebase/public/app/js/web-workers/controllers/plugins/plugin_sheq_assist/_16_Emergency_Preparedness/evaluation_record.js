
(() => {
    class Controller extends AControllerAssist {
        /*
         method_of_announcing_emergency, 
         training_date, 
         starting_time,
         ending_time,
         desc,
         question_list,
         drill_observation_list
         */
        constructor(events, db) {
            super(events, db, {singular: "Evacuation Record", plural: "Evacuation Records"}, "plugin_sheq_assist/16_Emergency_Preparedness/evaluation-record/", "plugin_sheq_assist_16_Emergency_Preparedness_evaluation_record");

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
                const {training_date, method_of_announcing_emergency} = search_val;
                const q = [
                    {key: 'method_of_announcing_emergency', comp: 'LIKE', val: method_of_announcing_emergency},
                    {key: 'training_date', comp: '=', val: training_date}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();