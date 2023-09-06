(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //training_id, trainer_id, time_or_duration, date, list_proof, list_table
        constructor(events) {
            super(events, {
                singular: "Training Register",
                plural: "Training Registers"
            }, "plugin_sheq_assist/05_Trainings/training-register/", "plugin_sheq_assist_trainings_register");

            const {addAction} = this;
            addAction("list/filter", this.filter.bind(this));
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            if (data.list_table) {
                const ids = data.list_table.map(({employee}) => employee.id);
                data.list_table_keys = ids;
            }

            const item = await this.createAndUploadIfFile(evt, data, "list_proof");
            if(item) {
                const incPlan = true;
                const incMatrix = true;
                return TrainingsFuns.mapRegisterResults(item, {incPlan, incMatrix});
            }
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="remove">
        async remove(evt, id) {
            return this.removeWithFile(evt, id, async ({data: {list_proof}}) => {
                list_proof && await files.remove(list_proof);
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerAid.prototype.list.call(this, evt);

                const incPlan = true, incMatrix = true;
                list = await Promise.all(list.map(async item => TrainingsFuns.mapRegisterResults(item, {
                    incPlan,
                    incMatrix
                })));
                return list;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                let {incPlan, incMatrix} = search_val;
                const {training_matrix, course_or_module_id, job_title_id, trainer, date} = search_val;

                let list = await AControllerAid.prototype.list.call(this, evt);

                if (!('incPlan' in search_val)) {
                    incPlan = true;
                }
                if (!('incMatrix' in search_val)) {
                    incMatrix = true;
                }

                list = await Promise.all(list.map(async item => TrainingsFuns.mapRegisterResults(item, {
                    incPlan,
                    incMatrix
                })));

                const q = [
                    {key: 'training_matrix.data.course_or_module.id', comp: '=', val: course_or_module_id},
                    {key: 'training_matrix.id', comp: '=', val: training_matrix},
                    {key: 'training_matrix.data.job_title.id', comp: '=', val: job_title_id},
                    [
                        {key: 'trainer.data.fname', comp: 'LIKE', val: trainer},
                        {key: 'trainer.data.lname', comp: 'LIKE', val: trainer}
                    ],
                    {key: 'date', comp: '=', val: date}
                ];
                return this.filter_impl(evt, q, list);
            });
        }

        // </editor-fold>
    }

    new Controller(events);
})();