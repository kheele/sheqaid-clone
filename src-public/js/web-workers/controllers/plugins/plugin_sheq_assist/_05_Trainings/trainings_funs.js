class TrainingsFuns {

    //<editor-fold desc="mapCourseResults">
    static async mapCourseResults(item, {incPlan = false, incRegister = false}) {
        let {
            id,
            data: {
                created_at,
                client, project, site, client_id, project_id, site_id,
                //1
                name,
                training_plan,
                job_position_list,
                sector_list,
                frequency,
                provider,
                //2
                unit_standard,
                unit_standard_desc,
            }
        } = item;

        const promise = [];

        if (incPlan) {
            promise.push(Events.get('plugin_sheq_assist/05_Trainings/training-plan/').then(cntr => {
                return cntr.filter.call(cntr, null, {course: id, incCourse: false, incRegister: false});
            }).then(val => {
                if (val) {
                    item.data.training_plan_list = val.distinct();
                }
            }));
        }
        if (incRegister) {
            promise.push(Events.get('plugin_sheq_assist/05_Trainings/training-register/').then(cntr => {
                return cntr.filter.call(cntr, null, {course: id, incMatrix: false, incPlan: false});
            }).then(val => {
                if (val) {
                    item.data.training_register_list = val.distinct();
                }
            }));
        }

        if (job_position_list && !job_position_list.isEmpty()) {
            promise.push(Events.get('plugin_sheq_assist/employees/job-positions/').then(cntr => {
                return Promise.all(job_position_list.map(async job_position => {
                    return cntr.find_by_id.call(cntr, null, job_position.id);
                }));
            }).then(val => {
                if (val) {
                    item.data.job_position_list = val.distinct();
                }
            }));
        }

        //<editor-fold desc="orgs">
        if ((client && isObject(client) && !client.data) || client_id) {
            promise.push(Events.get('plugin_sheq_assist/clients/').then(clients => {
                return clients.find_by_id.call(clients, null, client ? client.id || client_id : client_id);
            }).then(val => {
                item.data.client = val;
            }));
        }
        if ((project && isObject(project) && !project.data) || project_id) {
            promise.push(Events.get('plugin_sheq_assist/projects/').then(projects => {
                return projects.find_by_id.call(projects, null, project ? project.id || project_id : project_id);
            }).then(val => {
                item.data.project = val;
            }));
        }
        if ((site && isObject(site) && !site.data) || site_id) {
            promise.push(Events.get('plugin_sheq_assist/sites/').then(sites => {
                return sites.find_by_id.call(sites, null, site ? site.id || site_id : site_id);
            }).then(val => {
                item.data.site = val;
            }));
        }
        //</editor-fold>

        await Promise.all(promise);
//                    console.log(this.tbl, item)
        return item;
    }

    //</editor-fold>

    //<editor-fold desc="mapPlanResults">
    static async mapPlanResults(item, {incCourse = false, incMatrix = false, incRegister = false}) {
        let {
            id,
            data: {
                year,
                course_or_module,
                training_matrix,
                job_position,
                employee,
                client, project, site, client_id, project_id, site_id
            }
        } = item;

        const promise = [];

        if (course_or_module) {
            if (incCourse) {
                promise.push(Events.get('plugin_sheq_assist/05_Trainings/training-registry/').then(cntr => {
                    return cntr.find_by_id.call(cntr, null, course_or_module.id, {incPlan: false, incRegister: false});
                }).then(val => {
                    if (val) {
                        item.data.course_or_module = val;
                    }
                }));
            }
        }
        if (training_matrix) {
            if (incMatrix) {
                promise.push(Events.get('plugin_sheq_assist/05_Trainings/training-matrix/').then(cntr => {
                    return cntr.find_by_id.call(cntr, null, training_matrix.id, {incPlan: false, incRegister: false});
                }).then(val => {
                    if (val) {
                        item.data.training_matrix = val;
                    }
                }));
            }
            if (incRegister) {
                promise.push(Events.get('plugin_sheq_assist/05_Trainings/training-register/').then(cntr => {
                    return cntr.filter.call(cntr, null, {training_matrix: training_matrix.id, incMatrix: false, incPlan: false});
                }).then(val => {
                    if (val) {
                        item.data.training_register_list = val.distinct();
                    }
                }));
            }
        }
        if (job_position) {
            promise.push(Events.get('plugin_sheq_assist/employees/job-positions/').then(cntr => {
                return cntr.find_by_id.call(cntr, null, job_position.id);
            }).then(val => {
                if (val) {
                    item.data.job_position = val;
                }
            }));
        }
        if (employee) {
            promise.push(Events.get('plugin_sheq_assist/employees/').then(cntr => {
                return cntr.find_by_id.call(cntr, null, employee.id);
            }).then(val => {
                if (val) {
                    item.data.employee = val;
                }
            }));
        }

        //<editor-fold desc="orgs">
        if ((client && isObject(client) && !client.data) || client_id) {
            promise.push(Events.get('plugin_sheq_assist/clients/').then(clients => {
                return clients.find_by_id.call(clients, null, client ? client.id || client_id : client_id);
            }).then(val => {
                item.data.client = val;
            }));
        }
        if ((project && isObject(project) && !project.data) || project_id) {
            promise.push(Events.get('plugin_sheq_assist/projects/').then(projects => {
                return projects.find_by_id.call(projects, null, project ? project.id || project_id : project_id);
            }).then(val => {
                item.data.project = val;
            }));
        }
        if ((site && isObject(site) && !site.data) || site_id) {
            promise.push(Events.get('plugin_sheq_assist/sites/').then(sites => {
                return sites.find_by_id.call(sites, null, site ? site.id || site_id : site_id);
            }).then(val => {
                item.data.site = val;
            }));
        }
        //</editor-fold>

        await Promise.all(promise);
//                    console.log(this.tbl, item)
        return item;
    }

    //</editor-fold>

    //<editor-fold desc="mapMatrixResults">
    static async mapMatrixResults(item, {incPlan = false, incRegister = false}) {
        let {
            id,
            data: {
                created_at,
                //1
                client, project, site, client_id, project_id, site_id,
                //2
                course_or_module, training_plan,
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
        } = item;

        const promise = [];

        if(hr && hr.id) {//this is for only people for company
            promise.push(employeesCntr.find_by_id(null, hr.id).then(val => {
                if (val) {
                    item.data.hr = val;
                }
            }));
        }
        if (course_or_module) {
            if (training_plan) {
                if (incPlan) {
                    promise.push(Events.get('plugin_sheq_assist/05_Trainings/training-plan/').then(cntr => {
                        return cntr.filter.call(cntr, null, {
                            year: training_plan,
                            course: course_or_module.id,
                            incCourse: false,
                            incRegister: false
                        });
                    }).then(val => {
                        if (val && val[0]) {
                            const groups = val.groupBy(({data: {year}}) => year);
                            val = Object.keys(groups).map(key=> {
                                const list = groups[key];
                                const group = key;
                                // console.log('group', group)

                                const cost = list.map(({data: {cost}}) => cost || 0).reduce((a, b) => a + b, 0);
                                const attendanceRate = list.map(({data: {cost}}) => cost || 0).reduce((a, b) => a + b, 0);
                                const results = list.map(({data: {results}}) => results || 'N/A');
                                const status = list.map(({data: {status}}) => status);

                                const employeeList = list.filter(({data: {employee}}) => !!employee).map(({data: {employee}}) => employee).distinct(({id}) => id);
                                const jobPositionList = list.filter(({data: {job_position}}) => !!job_position).map(({data: {job_position}}) => job_position).distinct(({id}) => id);
                                const courseList = list.map(({data: {course_or_module}}) => course_or_module).distinct(({id}) => id);

                                return {group, list, cost, attendanceRate, results, status, employeeList, jobPositionList, courseList};
                            });
                            item.data.training_plan = val[0];
                        }
                    }));
                }
            }
            if (incPlan) {
                promise.push(Events.get('plugin_sheq_assist/05_Trainings/training-plan/').then(cntr => {
                    return cntr.filter.call(cntr, null, {
                        course: course_or_module.id,
                        incCourse: false,
                        incRegister: false
                    });
                }).then(val => {
                    if (val) {
                        item.data.all_training_plan_list = val.distinct();
                    }
                }));
            }
        }
        if (incRegister) {
            promise.push(Events.get('plugin_sheq_assist/05_Trainings/training-register/').then(cntr => {
                return cntr.filter.call(cntr, null, {course: course_or_module.id, incMatrix: false, incPlan: false});
            }).then(val => {
                if (val) {
                    item.data.training_register_list = val.distinct();
                }
            }));
        }

        //<editor-fold desc="orgs">
        if ((client && isObject(client) && !client.data) || client_id) {
            promise.push(Events.get('plugin_sheq_assist/clients/').then(clients => {
                return clients.find_by_id.call(clients, null, client ? client.id || client_id : client_id);
            }).then(val => {
                item.data.client = val;
            }));
        }
        if ((project && isObject(project) && !project.data) || project_id) {
            promise.push(Events.get('plugin_sheq_assist/projects/').then(projects => {
                return projects.find_by_id.call(projects, null, project ? project.id || project_id : project_id);
            }).then(val => {
                item.data.project = val;
            }));
        }
        if ((site && isObject(site) && !site.data) || site_id) {
            promise.push(Events.get('plugin_sheq_assist/sites/').then(sites => {
                return sites.find_by_id.call(sites, null, site ? site.id || site_id : site_id);
            }).then(val => {
                item.data.site = val;
            }));
        }
        //</editor-fold>

        await Promise.all(promise);
//                    console.log(this.tbl, item)
        return item;
    }

    //</editor-fold>

    //<editor-fold desc="mapRegisterResults">
    static async mapRegisterResults(item, {incPlan = false, incMatrix = false}) {
        let {
            id,
            data: {
                client, project, site, client_id, project_id, site_id,
                training_matrix,
                list_table,
                list_table_keys,
                time_or_duration,
                date,
            }
        } = item;

        const promise = [];

        if (training_matrix) {
            if (incMatrix) {
                promise.push(Events.get('plugin_sheq_assist/05_Trainings/training-matrix/').then(cntr => {
                    return cntr.find_by_id.call(cntr, null, training_matrix.id, {incPlan: false, incRegister: false});
                }).then(val => {
                    if (val) {
                        item.data.training_matrix = val;
                    }
                }));
            }

            if (incPlan) {
                promise.push(Events.get('plugin_sheq_assist/05_Trainings/training-plan/').then(cntr => {
                    return cntr.filter.call(cntr, null, {
                        year: Dates.parse(date).getFullYear(),
                        course: (training_matrix.course_or_module || training_matrix.data.course_or_module).id,
                        incRegister: false,
                        incCourse: false,
                        incMatrix: true,
                    });
                }).then(val => {
                    if (val) {
                        item.data.training_plan_list = val.distinct();
                    }
                }));
            }
        }
        if (list_table) {
            promise.push(Events.get('plugin_sheq_assist/employees/').then(cntr => {
                return Promise.all(list_table.map(async ({employee, signature}) => {
                    employee = await cntr.find_by_id.call(cntr, null, employee.id);
                    return {employee, signature};
                }));
            }).then(val => {
                if (val) {
                    item.data.list_table = val.distinct();
                }
            }));
        }

        if(time_or_duration && time_or_duration.contains(', NaNmin')) {
            item.data.time_or_duration = time_or_duration.replace(', NaNmin', '');
        }

        //<editor-fold desc="orgs">
        if ((client && isObject(client) && !client.data) || client_id) {
            promise.push(Events.get('plugin_sheq_assist/clients/').then(clients => {
                return clients.find_by_id.call(clients, null, client ? client.id || client_id : client_id);
            }).then(val => {
                item.data.client = val;
            }));
        }
        if ((project && isObject(project) && !project.data) || project_id) {
            promise.push(Events.get('plugin_sheq_assist/projects/').then(projects => {
                return projects.find_by_id.call(projects, null, project ? project.id || project_id : project_id);
            }).then(val => {
                item.data.project = val;
            }));
        }
        if ((site && isObject(site) && !site.data) || site_id) {
            promise.push(Events.get('plugin_sheq_assist/sites/').then(sites => {
                return sites.find_by_id.call(sites, null, site ? site.id || site_id : site_id);
            }).then(val => {
                item.data.site = val;
            }));
        }
        //</editor-fold>

        await Promise.all(promise);
//                    console.log(this.tbl, item)
        return item;
    }

    //</editor-fold>

    //<editor-fold desc="mapToolboxTalkResults">
    static async mapToolboxTalkResults(item) {
        let {
            id,
            data: {
                created_at,
                //1
                client, project, site, client_id, project_id, site_id,
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
        } = item;

        const promise = [];

        //<editor-fold desc="orgs">
        if ((client && isObject(client) && !client.data) || client_id) {
            promise.push(Events.get('plugin_sheq_assist/clients/').then(clients => {
                return clients.find_by_id.call(clients, null, client ? client.id || client_id : client_id);
            }).then(val => {
                item.data.client = val;
            }));
        }
        if ((project && isObject(project) && !project.data) || project_id) {
            promise.push(Events.get('plugin_sheq_assist/projects/').then(projects => {
                return projects.find_by_id.call(projects, null, project ? project.id || project_id : project_id);
            }).then(val => {
                item.data.project = val;
            }));
        }
        if ((site && isObject(site) && !site.data) || site_id) {
            promise.push(Events.get('plugin_sheq_assist/sites/').then(sites => {
                return sites.find_by_id.call(sites, null, site ? site.id || site_id : site_id);
            }).then(val => {
                item.data.site = val;
            }));
        }
        //</editor-fold>

        await Promise.all(promise);
//                    console.log(this.tbl, item)
        return item;
    }

    //</editor-fold>

    //<editor-fold desc="filterActiveOrInactiveEmployees">
    static async filterActiveOrInactiveEmployees(list, employee_view) {
        if (employee_view === 'active') {
            list = await Promise.all(list.filter(({data: {employee}}) => !!employee).map(async (
                {
                    id,
                    data: {
                        employee,
                        ...others
                    }
                }
            ) => {
                employee = await Events.get('plugin_sheq_assist/employees/').then(employees_ctrl => {
                    return employees_ctrl.find_by_id.call(employees_ctrl, null, employee.id);
                });
                if (employee && !employee.data.removed) {
                    return {id, data: {...others, employee}};
                }
            }));
            list = list.filter((v) => !!v);
        } else if (employee_view === 'inactive') {
            list = await Promise.all(list.filter(({data: {employee}}) => !!employee).map(async (
                {
                    data: {
                        employee,
                        ...others
                    }
                }
            ) => {
                employee = await Events.get('plugin_sheq_assist/employees/').then(employees_ctrl => {
                    return employees_ctrl.find_by_id.call(employees_ctrl, null, employee.id);
                });
                if (employee && employee.data.removed) {
                    return {id, data: {...others, employee}};
                }
            }));
            list = list.filter((v) => !!v);
        }
        return list;
    }

    //</editor-fold>

}