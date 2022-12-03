
(() => {
    class Controller extends AControllerAssist {
        //training_id, trainer_id, time_or_duration, date, list_proof, list_table
        constructor(events, db) {
            super(events, db, {singular: "Training Register", plural: "Training Registers"}, "plugin_sheq_assist/05_Trainings/training-register/", "plugin_sheq_assist_trainings_register");

            this.filter = this.filter.bind(this);
            const {addAction, filter} = this;
            addAction("list/filter", filter);
        }

        async create(evt, data) {
            return this.createAndUploadIfFile(evt, data, "list_proof");
        }

        async remove(evt, id) {
            return this.removeWithFile(evt, id, async ({data: {list_proof}}) => {
                list_proof && await files.remove(list_proof);
            });
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {type, training, trainer, date} = search_val;
                const q = [
                    [
                        {key: 'training.data.course_or_module', comp: 'LIKE', val: training},
                        {key: 'training.data.job_title', comp: 'LIKE', val: training}
                    ],
                    [
                        {key: 'trainer.data.fname', comp: 'LIKE', val: trainer},
                        {key: 'trainer.data.lname', comp: 'LIKE', val: trainer}
                    ],
                    {key: 'type', comp: '=', val: type},
                    {key: 'date', comp: '=', val: date}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();