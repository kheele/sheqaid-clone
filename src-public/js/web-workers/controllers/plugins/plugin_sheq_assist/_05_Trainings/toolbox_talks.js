(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events) {
            super(events, {
                singular: "Training Toolbox Talk",
                plural: "Training Toolbox Talks"
            }, "plugin_sheq_assist/05_Trainings/toolbox-talks/", "plugin_sheq_assist_05_Training_toolbox_talks");

            const {addAction, search_by} = this;
            addAction("list/search_by_name", this.search_by_name.bind(this));
            addAction("list/search_by", search_by);
            addAction("courses/list", this.list_courses.bind(this));
            addAction("frequencies/list", this.list_frequencies.bind(this));
            addAction("list/filter", this.filter.bind(this));

            addAction("select/filter", this.filter_select.bind(this));
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                const {course, date, time_from, time_to,} = data;
                //calculate total time

                data.keywords = this.generateKeywords([course]);
                return AControllerAid.prototype.createAndUploadIfManyFiles().call(this, evt, data, ['doc', 'attendance_register_doc']);
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const {course, date, time_from, time_to,} = updateAttrs;
                //calculate total time

                if (course) {
                    updateAttrs.keywords = this.generateKeywords([course]);
                }
                return AControllerAid.prototype.update.call(this, evt, id, updateAttrs);
            });
        }

        // </editor-fold>

        async search_by_name(evt, course) {
            return await this.filter(evt, {course});
        }
        
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
                            
                            job_position_list: job_position_list ? job_position_list.map(v => v.name).join(', ') : "",
                            sector_list: sector_list ? sector_list.map(v => v.name).join(', ') : "",
                            
                            provider,
                            frequency,
                            
                            unit_standard,
                            unit_standard_desc,
                            
                            status: removed ? "Inactive" : "Active",
                        };
                    });
                    
                    const response = await fetch(
                      `${self.locationRoot}/templates/xlsx/trainings/Template-List-Training-Toolbox-Talk.xlsx`.replace('//', '/')
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
        
        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel(evt, list) {
            return Events.whenLoggedIn(async loggedUser => {
                const cols = [
                    {header: 'Company', key: 'Company', width: 25},
                    {header: 'Project', key: 'Project', width: 25},
                    {header: 'Site', key: 'Site', width: 25},

                    //1
                    {header: 'Course', key: 'Course', width: 23},
                    {header: 'Training Frequency', key: 'Training Frequency', width: 22},
                    {header: 'Subject Category', key: 'Subject Category', width: 22},

                    {header: 'Date', key: 'Date', width: 15},
                    {header: 'Time From', key: 'Time From', width: 18},
                    {header: 'Time To', key: 'Time To', width: 15},

                    {header: 'Institution Conducting Training', key: 'Institution Conducting Training', width: 33},
                    {header: 'Training Conductor', key: 'Training Conductor', width: 30},
                    {header: 'Job Position', key: 'Job Position', width: 25},

                    {header: '# Of Employees Attended', key: '# Of Employees Attended', width: 35},
                ];

                const rows = list.map((
                    {
                        id, data: {
                            created_at,
                            //0
                            client, project, site,
                            //1
                            course,
                            training_frequency, subject_category,
                            date, time_from, time_to,//list
                            //2
                            institution_conducting_training,//list
                            hr,//list
                            job_desc,
                            //3
                            doc,//list
                            //4
                            attendance_register_doc,//list
                            attendance_register_list,//list
                        }
                    }
                ) => {

                    const res = {
                        Company: isString(client) ? client : (client ? (client.name || client.data.name) : ""),
                        Project: isString(project) ? project : (project ? (project.name || project.data.name) : ""),
                        Site: isString(site) ? site : (site ? (site.name || site.data.name) : ""),

                        //1
                        "Course": course,
                        "Training Frequency": training_frequency || "",
                        "Subject Category": subject_category || "",
                        'Date': Dates.formatDate(date) || '',
                        "Time From": time_from || "",
                        "Time To": time_to || "",
                        "Institution Conducting Training": institution_conducting_training || "",
                        "Training Conductor": hr ? ((hr.lname || hr.data.lname) + ' ' + (hr.fname || hr.data.fname)) : "",
                        "Job Position": job_desc ? (job_desc.name || job_desc.data.name) : "",
                        "# Of Employees Attended": attendance_register_list ? (attendance_register_list.length) : "",
                    };

                    return res;
                });

                return await this.export_excel_impl(loggedUser, "Training-Toolbox-Talks-Docs", "Toolbox-Talks", "Toolbox-Talks Data", cols, rows);
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerAid.prototype.list.call(this, evt);
                //
                // list = list.map(v => {
                //     const {data, data: {certificate_expiration}} = v;
                //     if (certificate_expiration && isObject(certificate_expiration) && 'seconds' in certificate_expiration) {
                //         data.certificate_expiration = certificate_expiration.toDate();
                //     }
                //     return v;
                // });

                return list;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_courses">
        async list_courses(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await this.list(evt);

                const cntr = await Events.getByTable("plugin_sheq_assist_05_Training_toolbox_talks_attendance_registers");
                let list2 = await cntr.list();
                list2 = list2.map(({data: {course_or_module}}) => course_or_module);
                list = list.filter(v => !!v.data.course).map(v => v.data.course);

                return [...list, ...list2].distinct();
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_frequencies">
        async list_frequencies(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await this.list(evt);
                list = list.
                filter(({data: {training_frequency}}) => !!training_frequency).
                map(({data: {training_frequency}}) => training_frequency).
                distinct();
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
                    isNew,
                    //0
                    client_id,
                    project_id,
                    site_id,
                    //1
                    course,
                    training_frequency, subject_category_id,
                    date,//list
                    //2
                    institution_conducting_training,//list
                    hr_id,//list
                    job_desc_id,
                } = filterData;
                let {} = filterData;

                const q = [
                    {key: 'client_id', comp: '=', val: client_id},
                    {key: 'project_id', comp: '=', val: project_id},
                    {key: 'site_id', comp: '=', val: site_id},

                    {key: 'course', comp: 'LIKE', val: course},
                    {key: 'training_frequency', comp: '=', val: training_frequency},
                    {key: 'subject_category.id', comp: '=', val: subject_category_id},

                    {key: 'date', comp: '=', val: date},

                    {key: 'institution_conducting_training', comp: 'LIKE', val: institution_conducting_training},
                    {key: 'hr.id', comp: '=', val: hr_id},
                    {key: 'job_desc.id', comp: '=', val: job_desc_id},
                ];
                return this.filter_impl(evt, q);
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                let {
                    isNew,
                    //0
                    client_id,
                    project_id,
                    site_id,
                    //1
                    course,
                    training_frequency, subject_category_id,
                    date,//list
                    //2
                    institution_conducting_training,//list
                    hr_id,//list
                    job_desc_id,
                } = filterData;
                course = course.toLowerCase();
                const q = [
                    {key: 'client_id', comp: '=', val: client_id},
                    {key: 'project_id', comp: '=', val: project_id},
                    {key: 'site_id', comp: '=', val: site_id},

                    {key: 'course', comp: 'LIKE', val: course},
                    {key: 'training_frequency', comp: '=', val: training_frequency},
                    {key: 'subject_category.id', comp: '=', val: subject_category_id},

                    {key: 'date', comp: '=', val: date},

                    {key: 'institution_conducting_training', comp: 'LIKE', val: institution_conducting_training},
                    {key: 'hr.id', comp: '=', val: hr_id},
                    {key: 'job_desc.id', comp: '=', val: job_desc_id},
                ];
                return this.filter_impl(evt, q);
            });
        }

        // </editor-fold>

        sortBy(list) {
            list.sortBy("data.course");
        }

    }

    new Controller(events);
})();
