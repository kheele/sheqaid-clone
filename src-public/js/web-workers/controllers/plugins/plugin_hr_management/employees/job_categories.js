
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events, db) {
            super(events, db, {singular: "Employee Job Position", plural: "Employees  Job Positions"}, "plugin_sheq_assist/employees/job-categories/", "plugin_sheq_assist_job_categories");

            const {addAction} = this;

            addAction("import/file", this.importFile.bind(this));
        }
        // </editor-fold>

        getDB() {
            return db_hr;
        }

        // <editor-fold defaultstate="collapsed" desc="importFile">
        async importFile(evt, path) {
            const validHeaderNames = [
                {key: 'name', value: ['Job Category', 'Name'], required: true},
            ];
            const res = await excelUtils.read(path, validHeaderNames);
            if (res.errors)
                return res;

            res.sortBy('name');
            return res.distinct('name');
        }
        // </editor-fold>

        sortBy(list) {
            list.sortBy("data.name");
        }
    }

    new Controller(events, db);
})();