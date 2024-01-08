(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //hr_id, job_desc, 
        //allocation, job_title, course_or_module, 
        //requirement, max_participants_per_course, training_standard, training_provider_requirement, training_frequency,
        //competency_evaluation, unit_standard, credits, nqf_level, unit_standard_desc, 
        //cost, certificate

        //hr, job_title, course_or_module, requirement
        constructor(events) {
            super(events, {
                singular: "Training Training Matrix",
                plural: "Training Training Matrix"
            }, "plugin_sheq_assist/05_Trainings/training-matrix/", "plugin_sheq_assist_trainings_matrix");

            const {addAction, search_by} = this;
            addAction("list/search_by_name", this.search_by_name.bind(this));
            addAction("list/search_by", search_by);
            addAction("courses/list", this.list_courses.bind(this));
            addAction("frequencies/list", this.list_frequencies.bind(this));
            addAction("list/filter", this.filter.bind(this));

            addAction("select/filter", this.filter_select.bind(this));

            addAction("dashboard/total/cost", this.dashboard_total_cost.bind(this));
            addAction("dashboard/total/trainings", this.dashboard_total_trainings.bind(this));
            addAction("dashboard/total/institutions", this.dashboard_total_institutions.bind(this));
            addAction("dashboard/total/conductors", this.dashboard_total_conductors.bind(this));

            addAction("dashboard/doughnut/status", this.dashboard_doughnut_training_status.bind(this));
            addAction("dashboard/doughnut/requirement", this.dashboard_doughnut_training_requirement.bind(this));
            addAction("dashboard/doughnut/legal_requirement", this.dashboard_doughnut_training_legal_requirement.bind(this));
            addAction("dashboard/doughnut/provider_requirement", this.dashboard_doughnut_training_provider_requirement.bind(this));
            addAction("dashboard/doughnut/competency_evaluation", this.dashboard_doughnut_training_competency_evaluation.bind(this));

            const fn = async () => {
                const doc_ref = await this.getDB().collection(this.tbl);//Promise < DocumentReference < T > >
                const querySnapshot = await doc_ref.get();
                const list = [];
                querySnapshot.forEach((doc) => {
                    list.push(doc);
                });
                console.log(`${this.tbl} test`);

                await Promise.all(list.map(async (doc) => {
                    const ref = this.getDB().collection(this.tbl).doc(doc.id);
                    let {allocation, job_title} = doc.data();
                    if (!isArray(allocation)) {
                        allocation = [allocation];
                    }
                    if (!isArray(job_title)) {
                        job_title = [job_title];
                    }
                    const updated = await ref.set({allocation, job_title}, {merge: true});//Promise < void >
                    console.log(`${this.tbl} done`, doc.id);
                }));
                console.log(`${this.tbl} final`);
            };
            // fn();
        }

        // </editor-fold>

        getDB() {
            return db2;
        }

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                const {
                    user: {id: user_id},
                    company: {id: company_id}
                } = loggedUser;

                const {course_or_module, job_desc, training_plan} = data;
                if (job_desc && (typeof job_desc === 'string' || !job_desc.id)) {
                    let val = await Events.get('plugin_sheq_assist/employees/job-positions/').then(job_positions => {
                        return job_positions.search_by_name(evt, job_desc.name || job_desc);
                    });
                    if (val && !val.isEmpty()) {
                        val = val[0];
                        data.job_desc = {id: val.id, name: val.data.name};
                    } else {
                        const _data = {
                            name: job_desc.name || job_desc,
                            user_id,
                            company_id,
                            created_at: FBSettings.FieldValue.serverTimestamp()
                        };
                        const job_position_doc_ref = await this.getDB().collection('plugin_sheq_assist_job_positions').add(_data);//Promise < DocumentReference < T > >
                        const job_position_doc_snapshot = await job_position_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        data.job_desc = {id: job_position_doc_snapshot.id, name: job_position_doc_snapshot.data().name};
                    }
                }

                let training_plan_list;
                if(training_plan) {//year
                    training_plan_list = await trainingPlanCntr.filter(null, {
                        year: training_plan,
                        course: course_or_module.id,
                        incRegister: false,
                        incCourse: false,
                        incMatrix: false,
                    });
                }

                data.keywords = this.generateKeywords([course_or_module.name]);
                const item = await AControllerAid.prototype.create.call(this, evt, data);
                if(item) {
                    const {id} = item;
                    const training_matrix = {id, course_or_module};
                    if (training_plan_list) {
                        await Promise.all(training_plan_list.map(async ({id}) => {
                            await trainingPlanCntr.getDB().collection(trainingPlanCntr.tbl).doc(id).set({
                                training_matrix
                            }, {merge: true});
                        }));
                    }
                    const incPlan = true;
                    const incRegister = true;
                    return TrainingsFuns.mapMatrixResults(item, {
                        incPlan,
                        incRegister
                    })
                }
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const {
                    user: {id: user_id},
                    company: {id: company_id}
                } = loggedUser;

                const {course_or_module, job_desc} = updateAttrs;
                if (job_desc && (typeof job_desc === 'string' || !job_desc.id)) {
                    let val = await Events.get('plugin_sheq_assist/employees/job-positions/').then(job_positions => {
                        return job_positions.search_by_name(evt, job_desc.name || job_desc);
                    });
                    if (val && !val.isEmpty()) {
                        val = val[0];
                        updateAttrs.job_desc = {id: val.id, name: val.data.name};
                    } else {
                        const _data = {
                            name: job_desc.name || job_desc,
                            user_id,
                            company_id,
                            created_at: FBSettings.FieldValue.serverTimestamp()
                        };
                        const job_position_doc_ref = await this.getDB().collection('plugin_sheq_assist_job_positions').add(_data);//Promise < DocumentReference < T > >
                        const job_position_doc_snapshot = await job_position_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        updateAttrs.job_desc = {
                            id: job_position_doc_snapshot.id,
                            name: job_position_doc_snapshot.data().name
                        };
                    }
                }
                if (course_or_module) {
                    updateAttrs.keywords = this.generateKeywords([course_or_module.name]);
                }
                return AControllerAid.prototype.update.call(this, evt, id, updateAttrs);
            });
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
                if (!('incPlan' in includes)) {
                    incPlan = true;
                }
                if (!('incRegister' in includes)) {
                    incRegister = true;
                }

                return TrainingsFuns.mapMatrixResults(item, {incPlan, incRegister});
            });
        }

        // </editor-fold>

        async search_by_name(evt, searchText) {
            return await this.filter(evt, {searchText});
        }

        // <editor-fold defaultstate="collapsed" desc="dashboard_totals">
        async dashboard_total_cost(evt, data = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                const {interval, employee_view} = data;
                let list = await this.list(evt);

                list.map(({data: {cost, training_plan_list, training_register_list}}) => {
                    if (training_plan_list && training_register_list) {
                        const employee_list = training_register_list.filter((
                            {id, data: {date, time_or_duration, list_table}}
                        ) => !!list_table).map(({id, data: {list_table}}) => {
                            if (employee_view === 'active') {
                                return list_table.filter(({id, data: {removed}}) => !removed);
                            } else if (employee_view === 'inactive') {
                                return list_table.filter(({id, data: {removed}}) => removed);
                            } else {
                                return list_table;
                            }
                        }).reduce((a1, a2) => [...a1, ...a2], []);
                    }
                });
                // list = await TrainingsFuns.filterActiveOrInactiveEmployees(list, employee_view);

                return list.map(({data: {cost}}) => cost || 0).reduce((a, b) => a + b, 0);
            });
        }

        async dashboard_total_trainings(evt, data = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                const {interval, employee_view} = data;
                let list = await this.list(evt);

                // list = await TrainingsFuns.filterActiveOrInactiveEmployees(list, employee_view);

                return list.length;
            });
        }

        async dashboard_total_institutions(evt, data = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                const {interval, employee_view} = data;
                let list = await this.list(evt);

                // list = await TrainingsFuns.filterActiveOrInactiveEmployees(list, employee_view);

                return list.filter(({data: {institution_conducting_training}}) => !!institution_conducting_training).map(({data: {institution_conducting_training}}) => institution_conducting_training).distinct().length;
            });
        }

        async dashboard_total_conductors(evt, data = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                const {interval, employee_view} = data;
                let list = await this.list(evt);

                // list = await TrainingsFuns.filterActiveOrInactiveEmployees(list, employee_view);

                return list.filter(({data: {hr}}) => !!hr).map(({data: {hr}}) => hr.id).distinct().length;
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

        async dashboard_doughnut_training_status(evt, data = {}) {
            const {interval, employee_view} = data;
            return this.dashboard_doughnut_training_impl(evt, {
                key: 'status',
                value1: 'Outstanding',
                value2: 'Completed',
                interval,
                employee_view
            });
        }

        async dashboard_doughnut_training_requirement(evt, data = {}) {
            const {interval, employee_view} = data;
            return this.dashboard_doughnut_training_impl(evt, {
                key: 'requirement',
                value1: 'Compulsory',
                value2: 'Optional',
                interval,
                employee_view
            });
        }

        async dashboard_doughnut_training_legal_requirement(evt, data = {}) {
            const {interval, employee_view} = data;
            return this.dashboard_doughnut_training_impl(evt, {
                key: 'requirement_legal',
                value1: 'Yes',
                value2: 'No',
                interval,
                employee_view
            });
        }

        async dashboard_doughnut_training_provider_requirement(evt, data = {}) {
            const {interval, employee_view} = data;
            return this.dashboard_doughnut_training_impl(evt, {
                key: 'training_provider_requirement',
                value1: 'Accredited',
                value2: 'Non-Accredited',
                interval,
                employee_view
            });
        }

        async dashboard_doughnut_training_competency_evaluation(evt, data = {}) {
            const {interval, employee_view} = data;
            return this.dashboard_doughnut_training_impl(evt, {
                key: 'competency_evaluation',
                value1: 'OnDayOfEvaluation',
                value2: 'LastDayOfEvaluation',
                interval,
                employee_view
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="dashboard_freq">
        async dashboard_freq_impl(evt, {key, value1, value2, interval, employee_view}) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await this.list(evt);

                // list = await TrainingsFuns.filterActiveOrInactiveEmployees(list, employee_view);

                list = list.map(({data: {[key]: value}}) => value);
                const res1 = list.filter(value => value === value1).length;
                const res2 = list.filter(value => value === value2).length;
                return [res1, res2];
            });
        }

        async dashboard_freq_cost(evt, data = {}) {
            const {interval, employee_view} = data;
            return this.dashboard_doughnut_training_impl(evt, {
                key: 'status',
                value1: 'Outstanding',
                value2: 'Completed',
                interval,
                employee_view
            });
        }
        async dashboard_freq_cost_course(evt, data = {}) {
            const {interval, employee_view} = data;
            return this.dashboard_doughnut_training_impl(evt, {
                key: 'requirement',
                value1: 'Compulsory',
                value2: 'Optional',
                interval,
                employee_view
            });
        }
        async dashboard_freq_cost_job_position(evt, data = {}) {
            const {interval, employee_view} = data;
            return this.dashboard_doughnut_training_impl(evt, {
                key: 'requirement_legal',
                value1: 'Yes',
                value2: 'No',
                interval,
                employee_view
            });
        }

        async dashboard_freq_results_course(evt, data = {}) {
            const {interval, employee_view} = data;
            return this.dashboard_doughnut_training_impl(evt, {
                key: 'training_provider_requirement',
                value1: 'Accredited',
                value2: 'Non-Accredited',
                interval,
                employee_view
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
                              cost,
                              institution_conducting_training,
                              trainer,
                              trainer_external,
                              trainer_job_position,
                              job_category_list,
                              job_position_list,
                              sector_list,
                              course,
                              requirement_legal,
                              requirement,
                              max_participants_per_course,
                              training_standard,
                              training_frequency,
                              provider_requirement,
                              certificate_expiration,
                              
                              competency_evaluation,
                              unit_standard,
                              unit_standard_desc,
                              credits,
                              nqf_level,
                            
                              training_plan_list,
                              
                              date_range,
                              
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
                            
                            course: course && course.name,
                            trainer: (trainer || trainer_external) && (trainer || trainer_external).full_name,
                            trainer_job_position: trainer_job_position && ` (${trainer_job_position.name})`,
                            institution_conducting_training,
                            
                            job_category_list: job_category_list ? job_category_list.map(v => v.job_category.name).join(', ') : "",
                            job_position_list: job_position_list ? job_position_list.map(v => v.job_position.name).join(', ') : "",
                            sector_list: sector_list ? sector_list.map(v => v.sector.name).join(', ') : "",
                            
                            requirement_legal,
                            requirement,
                            provider_requirement,
                            max_participants_per_course,
                            training_standard,
                            training_frequency,
                            competency_evaluation,
                            unit_standard,
                            unit_standard_desc,
                            credits,
                            nqf_level,
                            date_range_start: date_range && Dates.formatDateSQL(date_range.start),
                            date_range_end: date_range && Dates.formatDateSQL(date_range.end),
                            
                            status,
                            activeness: removed ? "Inactive" : "Active",
                        };
                    });
                    
                    const response = await fetch(
                      `${self.locationRoot}/templates/xlsx/trainings/Template-List-Training-Matrix.xlsx`.replace('//', '/')
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
                list = await Promise.all(list.map(async item => TrainingsFuns.mapMatrixResults(item, {
                    incPlan,
                    incRegister
                })));
                return list;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_courses">
        async list_courses(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await this.list(evt);

                list = list.filter(v => !!v.data.course_or_module).map(v => v.data.course_or_module).distinct();

                // const manuals = await Events.get('plugin_sheq_assist/05_Trainings/manuals/');
                // const {doc_list, video_list} = await manuals.list(evt);
                // const manualsCourseList = [...doc_list, ...video_list].filter(v => !!v.data.course_or_module).map(v => v.data.course_or_module).distinct();

                return [...list].distinct();
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_frequencies">
        async list_frequencies(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await this.list(evt);
                list = list.filter(val => !!val.data.training_frequency).map(val => val.data.training_frequency).distinct();
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

                    hr_id,
                    job_title_id,

                    course_or_module_id,

                    training_provider_requirement,
                    requirement,
                    status,
                } = filterData;
                let {} = filterData;

                const q = [
                    {key: 'client_id', comp: '=', val: client_id},
                    {key: 'project_id', comp: '=', val: project_id},
                    {key: 'site_id', comp: '=', val: site_id},

                    {key: 'hr.id', comp: '=', val: hr_id},
                    {key: 'inArray(job_title.id)', comp: '=', val: job_title_id},

                    {key: 'course_or_module.id', comp: 'LIKE', val: course_or_module_id},

                    {key: 'training_provider_requirement', comp: '=', val: training_provider_requirement},
                    {key: 'requirement', comp: '=', val: requirement},
                    {key: 'status', comp: '=', val: status},
                ];
                return this.filter_impl(evt, q);
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {

                const incPlan = true, incRegister = true;
                let list = await AControllerAid.prototype.list.call(this, evt);
                list = await Promise.all(list.map(async item => TrainingsFuns.mapMatrixResults(item, {
                    incPlan,
                    incRegister
                })));

                let {
                    course_or_module = "",
                    training_provider_requirement,
                    requirement,
                    status,
                    hr,
                    job_title
                } = filterData;
                course_or_module = course_or_module.toLowerCase();
                const q = [
                    {key: 'training_provider_requirement', comp: '=', val: training_provider_requirement},
                    {key: 'requirement', comp: '=', val: requirement},
                    {key: 'status', comp: '=', val: status},
                    {key: 'hr.id', comp: '=', val: hr},
                    {key: 'inArray(job_title.id)', comp: '=', val: job_title},
                    {key: 'course_or_module.name', comp: 'LIKE', val: course_or_module}
                ];
                return this.filter_impl(evt, q);
            });
        }

        // </editor-fold>

        sortBy(list) {
            list.sortBy("data.course_or_module.name");
        }

    }

    new Controller(events);
})();
