
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //training_id, trainer_id, time_or_duration, date, list_proof, list_table
        constructor(events, db) {
            super(events, db, {singular: "Training Registry", plural: "Training Registries"}, "plugin_sheq_assist/05_Trainings/training-registry/", "plugin_sheq_assist_trainings_registry");

            const {addAction} = this;
            addAction("list/filter", this.filter.bind(this));

            addAction("select/filter", this.filter_select.bind(this));

            addAction("dashboard/count", this.dashboard_count.bind(this));
            addAction("dashboard/doughnut/provider", this.dashboard_doughnut_training_provider.bind(this));
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="find_by_id">
        async find_by_id(evt, id, includes = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                const item = {id: doc_snapshot.id, data: doc_snapshot.data()};

                let {incPlan, incRegister} = includes;
                if(!('incPlan' in includes)) {
                    incPlan = true;
                }
                if(!('incRegister' in includes)) {
                    incRegister = true;
                }

                return TrainingsFuns.mapCourseResults(item, {incPlan, incRegister});
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="dashboard_count">
        async dashboard_count(evt, data = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                const {interval, employee_view} = data;
                let list = await this.list(evt);

                // list = await TrainingsFuns.filterActiveOrInactiveEmployees(list, employee_view);

                return list.length;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="dashboard_doughnuts">
        async dashboard_doughnut_training_impl(evt, {key, value1, value2, interval, employee_view}) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await this.list(evt);

                // list = await TrainingsFuns.filterActiveOrInactiveEmployees(list, employee_view);

                list = list.map(({data: {[key]: value}}) => value);
                const res1 = list.filter(value => value === value1).length;
                const res2 = list.filter(value => value === value2).length;
                return [res1, res2];
            });
        }

        async dashboard_doughnut_training_provider(evt, data = {}) {
            const {interval, employee_view} = data;
            return this.dashboard_doughnut_training_impl(evt, {
                key: 'provider', value1: 'External', value2: 'Internal',
                interval, employee_view
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel(evt, list) {
            return Events.whenLoggedIn(async loggedUser => {
                const cols = [
                    {header: 'Company', key: 'Company', width: 25},
                    {header: 'Project', key: 'Project', width: 25},
                    {header: 'Site', key: 'Site', width: 25},

                    //1
                    {header: 'Course / Module', key: 'Course / Module', width: 25},
                    {header: 'Job Position(s)', key: 'Job Position(s)', width: 35},
                    {header: 'Sector(s)', key: 'Sector(s)', width: 35},
                    {header: 'Training Frequency', key: 'Training Frequency', width: 22},
                    {header: 'Training Provider', key: 'Training Provider', width: 22},

                    //2
                    {header: 'Unit Standard', key: 'Unit Standard', width: 15},
                    {header: 'Unit Standard Description', key: 'Unit Standard Description', width: 35},
                ];

                const rows = list.map((
                    {
                        id, data: {
                            created_at,
                            client, project, site,
                            //1
                            name,
                            job_position_list,
                            sector_list,
                            frequency,
                            provider,
                            //2
                            unit_standard,
                            unit_standard_desc
                        }
                    }
                ) => {

                    const res = {
                        Company: isString(client) ? client : (client ? (client.name || client.data.name) : ""),
                        Project: isString(project) ? project : (project ? (project.name || project.data.name) : ""),
                        Site: isString(site) ? site : (site ? (site.name || site.data.name) : ""),

                        //1
                        "Course / Module": name || "",
                        "Job Position(s)": job_position_list && job_position_list.map(val => val.name || val.data.name).join(', ') || "",
                        "Sector(s)": sector_list && sector_list.join(', ') || "",
                        "Training Frequency": frequency || "",
                        "Training Provider": provider || "",

                        //2
                        "Unit Standard": unit_standard || "",
                        "Unit Standard Description": unit_standard_desc || "",
                    };

                    return res;
                });

                return await this.export_excel_impl(loggedUser, "Training-Courses-Docs", "Training-Courses", "Training-Courses Data", cols, rows);
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerAid.prototype.list.call(this, evt);

                const incPlan = true, incRegister = true;
                list = await Promise.all(list.map(async item => TrainingsFuns.mapCourseResults(item, {incPlan, incRegister})));
                return list;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_select">
        async filter_select(evt, filterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {
                    user: {data: {client: my_client, project: my_project, site: my_site}},

                } = loggedUser;
                let {
                    client_id,
                    project_id,
                    site_id,
                    isNew,
                    name = "",
                    frequency,
                    provider,
                    job_position_id,
                    sector,
                } = filterData;
                let {} = filterData;
                name = name.toLowerCase();

                const q = [
                    {key: 'client_id', comp: '=', val: client_id},
                    {key: 'project_id', comp: '=', val: project_id},
                    {key: 'site_id', comp: '=', val: site_id},

                    {key: 'name', comp: 'LIKE', val: name},
                    {key: 'frequency', comp: 'LIKE', val: frequency},
                    {key: 'provider', comp: 'LIKE', val: provider},

                    {key: 'inArray(job_position_list.id)', comp: '=', val: job_position_id},
                    {key: 'inArray(sector_list)', comp: '=', val: sector},
                ];
                return this.filter_impl(evt, q);
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name, frequency, provider, job_position_id, sector} = search_val;

                const incPlan = true, incRegister = true;
                let list = await AControllerAid.prototype.list.call(this, evt);
                list = await Promise.all(list.map(async item => TrainingsFuns.mapCourseResults(item, {incPlan, incRegister})));

                const q = [
                    {key: 'name', comp: 'LIKE', val: name},
                    {key: 'frequency', comp: '=', val: frequency},
                    {key: 'provider', comp: '=', val: provider},
                    {key: 'inArray(job_position_list.id)', comp: '=', val: job_position_id},
                    {key: 'inArray(sector_list)', comp: '=', val: sector}
                ];
                return this.filter_impl(evt, q, list);
            });
        }
        // </editor-fold>
    }

    new Controller(events, db);
})();