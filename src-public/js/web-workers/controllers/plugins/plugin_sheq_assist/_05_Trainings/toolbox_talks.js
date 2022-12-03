(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events, db) {
            super(events, db, {singular: "Training Toolbox Talk", plural: "Training Toolbox Talks"}, "plugin_sheq_assist/05_Trainings/toolbox-talks/", "plugin_sheq_assist_05_Training_toolbox_talks");

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
                const {course_or_module, date, time_from, time_to,} = data;
                //calculate total time

                data.keywords = this.generateKeywords([course_or_module]);
                return AControllerAid.prototype.createAndUploadIfManyFiles().call(this, evt, data, ['doc', 'attendance_register_doc']);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const {course_or_module, date, time_from, time_to,} = updateAttrs;
                //calculate total time

                if (course_or_module) {
                    updateAttrs.keywords = this.generateKeywords([course_or_module]);
                }
                return AControllerAid.prototype.update.call(this, evt, id, updateAttrs);
            });
        }
        // </editor-fold>

        async search_by_name(evt, searchText) {
            return await this.filter(evt, {searchText});
        }

        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel(evt, list) {
            return Events.whenLoggedIn(async loggedUser => {
                const cols = [
                    {header: 'Company', key: 'Company', width: 25},
                    {header: 'Project', key: 'Project', width: 25},
                    {header: 'Site', key: 'Site', width: 25},

                    //2
                    {header: 'Allocation / Job Category', key: 'Allocation / Job Category', width: 28},
                    {header: 'Job Title', key: 'Job Position', width: 23},

                    //1
                    {header: 'Course / Module', key: 'Course / Module', width: 23},

                    //5
                    {header: 'Requirement', key: 'Requirement', width: 20},
                    {header: 'Max. Participants Per Course', key: 'Max. Participants Per Course', width: 30},
                    {header: 'Training Standard (Minimum Days)', key: 'Training Standard (Minimum Days)', width: 35},
                    {header: 'Training Frequency', key: 'Training Frequency', width: 22},
                    {header: 'Training Provider Requirement', key: 'Training Provider Requirement', width: 33},

                    //6
                    {header: 'Competency Evaluation', key: 'Competency Evaluation', width: 27},
                    {header: 'Unit Standard', key: 'Unit Standard', width: 20},
                    {header: 'Unit Standard Description', key: 'Unit Standard Description', width: 35},
                    {header: 'Credits', key: 'Credits', width: 15},
                    {header: 'NQF Level', key: 'NQF Level', width: 15},
                ];

                const rows = list.map((
                    {
                        id, data: {
                            created_at,
                            //1
                            client, project, site,
                            //2
                            course_or_module,
                            //3
                            allocation, job_title, sector_list,
                            //4
                            status, date_range, cost,
                            //5
                            institution_conducting_training, hr, job_desc,
                            //6
                            requirement_legal,
                            requirement,
                            max_participants_per_course,
                            training_standard,
                            training_frequency,
                            training_provider_requirement,
                            //7
                            competency_evaluation,
                            unit_standard,
                            unit_standard_desc,
                            credits,
                            nqf_level
                        }
                    }
                ) => {

                    const res = {
                        Company: isString(client) ? client : (client ? (client.name || client.data.name) : ""),
                        Project: isString(project) ? project : (project ? (project.name || project.data.name) : ""),
                        Site: isString(site) ? site : (site ? (site.name || site.data.name) : ""),

                        //2
                        "Allocation / Job Category": allocation && allocation.name || '',
                        "Job Title": job_title && job_title.name || '',

                        //1
                        "Course / Module": course_or_module,

                        //5
                        "Requirement": requirement || "",
                        'Max. Participants Per Course': max_participants_per_course || '',
                        "Training Standard (Minimum Days)": training_standard || "",
                        "Training Frequency": training_frequency || "",
                        "Training Provider Requirement": training_provider_requirement || "",

                        //6
                        "Competency Evaluation": competency_evaluation || "",
                        "Unit Standard": unit_standard || "",
                        "Unit Standard Description": unit_standard_desc || "",
                        "Credits": credits || "",
                        "NQF Level": nqf_level || "",
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

                list = list.filter(v => !!v.data.course_or_module).map(v => v.data.course_or_module).distinct();

                return list;
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

                    course_or_module,

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
                    {key: 'job_title.id', comp: '=', val: job_title_id},

                    {key: 'course_or_module', comp: 'LIKE', val: course_or_module},

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
                    {key: 'job_title', comp: '=', val: job_title},
                    {key: 'course_or_module', comp: 'LIKE', val: course_or_module}
                ];
                return this.filter_impl(evt, q);
            });
        }

        // </editor-fold>

        sortBy(list) {
            list.sortBy("data.course_or_module");
        }

    }

    new Controller(events, db);
})();