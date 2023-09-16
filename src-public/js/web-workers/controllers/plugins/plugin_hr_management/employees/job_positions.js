
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events) {
            super(events, {singular: "Employee Job Position", plural: "Employees  Job Positions"}, "plugin_sheq_assist/employees/job-positions/", "plugin_sheq_assist_job_positions");

            const {addAction} = this;

            addAction("import/file", this.importFile.bind(this));
            addAction("import/create", this.createImported.bind(this));
        }
        // </editor-fold>

        getDB() {
            return db_hr;
        }

        // <editor-fold defaultstate="collapsed" desc="importFile">
        async importFile(evt, path) {
            const validHeaderNames = [
                {key: 'name', value: ['Job Position', 'Job Title', 'Job Name'], required: true},
                {key: 'job_category', value: ['Job Category', 'Occupational Level']}
            ];
            const res = await excelUtils.read(path, validHeaderNames);
            if (res.errors)
                return res;

            res.sortBy('name');
            return res.distinct('name');
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="createImported">
        async createImported(evt, list) {
            return Events.whenLoggedIn(async loggedUser => {
                return await Promise.all(list.map(async data => {
                    return await this.create(evt, data);
                }));
            });
        }
        // </editor-fold>

    }

    // <editor-fold defaultstate="collapsed" desc="mapResults">
    async function mapResults(item) {
        let {
            id,
            data: {
                ppe_list = []
            }
        } = item;

        const promise = [];

        if (ppe_list) {
            ppe_list = ppe_list.filter(v => !!v);
            promise.push(Events.get('plugin_sheq_assist/employees/ppe/').then(ppe_ctrl => {
                return Promise.all(ppe_list.filter(v => !!v).map(async id => {
                    return ppe_ctrl.find_by_id.call(ppe_ctrl, null, id);
                }));
            }).then(val => {
                val.sortBy('data.name');
                item.data.ppe_list = val;
            }));
        }

        await Promise.all(promise);

        return item;
    }
    // </editor-fold>

    new Controller(events);
})();