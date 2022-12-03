
(() => {
    class Controller extends AControllerAssist {
        //hr_id, job_desc, 
        //allocation, job_title, course_or_module, 
        //requirement, max_participants_per_course, training_standard, training_provider_requirement, training_frequency,
        //competency_evaluation, unit_standard, credits, nqf_level, unit_standard_desc, 
        //cost, certificate, certificate_expiration

        //hr, job_title, course_or_module, requirement, certificate_expiration
        constructor(events, db) {
            super(events, db, {singular: "Training Training Matrix", plural: "Training Training Matrix"}, "plugin_sheq_assist/05_Trainings/training-matrix/", "plugin_sheq_assist_trainings_matrix");

            const {addAction, search_by} = this;
            addAction("list/search_by_name", this.search_by_name.bind(this));
            addAction("list/search_by", search_by);
            addAction("courses/list", this.list_courses.bind(this));
            addAction("frequencies/list", this.list_frequencies.bind(this));
            addAction("list/filter", this.filter.bind(this));
        }

        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                data.keywords = this.generateKeywords([data.course_or_module]);
                return AControllerAssist.prototype.create.call(this, evt, data);
            });
        }

        async search_by_name(evt, searchText) {
            return await this.filter(evt, {searchText});
        }

//        async search_by_name(evt, search_val) {
//            return this.filter_by(evt, search_val, search_val => {
//                return val => {
//                    let {type, job_title, course_or_module} = val.data;
//                    let search_val_type = search_val.type;
//                    let search_val_value = search_val.value.toLowerCase();
//                    return type === search_val_type && (job_title.toLowerCase().startsWith(search_val_value) || course_or_module.toLowerCase().startsWith(search_val_value))
//                };
//            });
//        }

        async list(evt, opts = {}) {
            let {searchText = ""} = opts;
            searchText = searchText.toLowerCase();
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, createDbFilter(loggedUser, searchText));
//                let list = await AControllerAssist.prototype.list.call(this, evt);
                list = await Promise.all(list.map(v => {
                    const {data, data: {certificate_expiration}} = v;
                    if (certificate_expiration && isObject(certificate_expiration) && 'seconds' in certificate_expiration) {
                        data.certificate_expiration = certificate_expiration.toDate();
                    }
                    return v;
                }));
                return list;
            });
        }

        async list_courses(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await this.list(evt, {limit: -1});
                
                list = list.filter(v => !!v.data.course_or_module).
                        map(v => v.data.course_or_module).
                        distinct();
                
                const manuals = await Events.get('plugin_sheq_assist/05_Trainings/manuals/');
                const {doc_list, video_list} = await manuals.list(evt);
                const manualsCourseList = [...doc_list, ...video_list].
                        filter(v => !!v.data.course_or_module).
                        map(v => v.data.course_or_module).
                        distinct();
                
                return [...list, ...manualsCourseList].distinct();
            });
        }

        async list_frequencies(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await this.list(evt, {limit: -1});
                list = list.filter(val => !!val.data.training_frequency).map(val => val.data.training_frequency).distinct();
                return list;
            });
        }

        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                let {course_or_module = "", training_provider_requirement, requirement, status, type, hr, job_title} = filterData;
                course_or_module = course_or_module.toLowerCase();
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    if (training_provider_requirement) {
                        q = q.where('training_provider_requirement', '==', training_provider_requirement);
                    }
                    if (requirement) {
                        q = q.where('requirement', '==', requirement);
                    }
                    if (status) {
                        q = q.where('status', '==', status);
                    }
                    if (type) {
                        q = q.where('type', '==', type);
                    }
                    if (hr) {
                        q = q.where('hr.id', '==', hr);
                    }
                    if (job_title) {
                        q = q.where('job_title', '==', job_title);
                    }
                    const filter = createDbFilter(loggedUser, course_or_module);
                    return filter(q);
                });
                list = await Promise.all(list.map(v => {
                    const {data, data: {certificate_expiration}} = v;
                    if (certificate_expiration && isObject(certificate_expiration) && 'seconds' in certificate_expiration) {
                        data.certificate_expiration = certificate_expiration.toDate();
                    }
                    return v;
                }));
                return list;
            });
        }

        sortBy() {
            return "course_or_module";
        }

    }

    function createDbFilter(loggedUser, searchText) {
        return q => {
            return q.where("keywords", "array-contains", searchText);
        };
    }

    new Controller(events, db);
})();