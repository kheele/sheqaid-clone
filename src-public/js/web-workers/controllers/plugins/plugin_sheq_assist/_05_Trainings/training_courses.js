
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //training_id, trainer_id, time_or_duration, date, list_proof, list_table
        constructor(events) {
            super(events, {singular: "Training Registry", plural: "Training Registries"}, "plugin_sheq_assist/05_Trainings/training-registry/", "plugin_sheq_assist_trainings_registry");

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
        async export_excel(evt,{
            client: _client, project: _project, site: _site,
            list,
        }) {
            return Events.whenLoggedIn(async loggedUser => {
                if (isArray(list)) {
                    const rows = list.map((
                      {
                          id,
                          data: {
                              created_at,
                              company, client, project, site,
                              
                              status,
                              //1
                              name,
                              job_position_list,
                              sector_list,
                              frequency,
                              provider,
                              //2
                              unit_standard,
                              unit_standard_desc,
                            
                              removed,
                          }
                      },
                      idx
                    ) => {
                        
                        client = client || company;
                        
                        return {
                            idx: idx + 1,
                            
                            project: project && project.name,
                            site: site && site.name,
                            
                            id,
                            
                            name,
                            
                            job_position_list: job_position_list ? job_position_list.map(v => v.job_position.name).join(', ') : "",
                            sector_list: sector_list ? sector_list.map(v => v.sector.name).join(', ') : "",
                            
                            provider,
                            frequency,
                            
                            unit_standard,
                            unit_standard_desc,
                            
                            status: removed ? "Inactive" : "Active",
                        };
                    });
                    
                    const response = await fetch(
                      `${self.locationRoot}/templates/xlsx/trainings/Template-List-Training-Course.xlsx`.replace('//', '/')
                    );
                    const arrayBuffer = await response.arrayBuffer();
                    const data = new Map();
                    
                    data.set('date', new Date().formatDate());
                    
                    data.set('company', _client ? _client.name || _client.data.name : "ANY");
                    data.set('project', _project ? _project.name || _project.data.name : "ANY");
                    data.set('site', _site ? _site.name || _site.data.name : "ANY");
                    
                    data.set("rows", rows);
                    return await Events.emit("excelTemplate", {arrayBuffer, data});
                    // return await this.export_excel_impl(loggedUser, "Training-Toolbox-Talks-Docs", "Attendance-Register", "Attendance-Register List", cols, rows);
                }
                return list;
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

    new Controller(events);
})();
