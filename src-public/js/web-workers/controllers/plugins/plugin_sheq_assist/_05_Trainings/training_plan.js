(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //training_id, trainer_id, time_or_duration, date, list_proof, list_table
        constructor(events) {
            super(events, {
                singular: "Training Plan",
                plural: "Training Plans"
            }, "plugin_sheq_assist/05_Trainings/training-plan/", "plugin_sheq_assist_trainings_plan");

            const {addAction} = this;
            // addAction("create/employee", this.create_employee.bind(this));
            addAction("list/filter", this.filter.bind(this));

            addAction("dashboard/total/participants", this.dashboard_total_participants.bind(this));
            addAction("dashboard/doughnut/result", this.dashboard_doughnut_training_result.bind(this));
            addAction("dashboard/doughnut/gender", this.dashboard_doughnut_training_gender.bind(this));

            addAction("dashboard/freq/cost", this.dashboard_freq_cost.bind(this));
            addAction("dashboard/freq/cost/course", this.dashboard_freq_cost_course.bind(this));
            addAction("dashboard/freq/cost/job-position", this.dashboard_freq_cost_job_position.bind(this));

            addAction("dashboard/freq/results/course", this.dashboard_freq_results_course.bind(this));
            addAction("dashboard/freq/results/job-position", this.dashboard_freq_results_job_position.bind(this));
        }

        // </editor-fold>

        getDB() {
            return db;
        }

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                this.injectSavable(evt, loggedUser, data);

                const {
                    plan_list
                } = data;
                delete data.plan_list;

                const list = await Promise.all(plan_list.map(async (v) => {
                    const plan = {...v, ...data};
                    console.log('plan', plan)
                    return await AControllerAid.prototype.create.call(this, evt, plan);
                }));
                console.log('plan after', list)
                return list;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, data = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                const {view, employee_view, target_view} = data;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    return q;
                });

                list = await TrainingsFuns.filterActiveOrInactiveEmployees(list, employee_view);

                const incCourse = true, incMatrix = true, incRegister = true;

                list = await Promise.all(list.map(async item => TrainingsFuns.mapPlanResults(item, {
                    incCourse,
                    incMatrix,
                    incRegister
                })));

                let groups;
                const {id, target} = target_view || {};
                if (target === 'employee') {
                    groups = list.filter(({data: {employee}}) => !!employee && employee.id === id).groupBy(({data: {employee}}) => employee.id);
                } else if (target === 'job_position') {
                    groups = list.filter(({data: {job_position}}) => !!job_position && job_position.id === id).groupBy(({data: {job_position}}) => job_position.id);
                } else if (target === 'course') {
                    groups = list.filter(({data: {course_or_module}}) => course_or_module.id === id).groupBy(({data: {course_or_module}}) => course_or_module.id);
                } else if (target === 'year') {
                    groups = list.filter(({data: {year}}) => year === id).groupBy(({data: {year}}) => year);
                } else {
                    if (view === 'Employee') {
                        groups = list.filter(({data: {employee}}) => !!employee).groupBy(({data: {employee}}) => employee.id);
                    } else if (view === 'Job Position') {
                        groups = list.filter(({data: {job_position}}) => !!job_position).groupBy(({data: {job_position}}) => job_position.id);
                    } else if (view === 'Course') {
                        groups = list.groupBy(({data: {course_or_module}}) => course_or_module.id);
                    } else if (view === 'Year') {
                        groups = list.groupBy(({data: {year}}) => year);
                    } else {
                        return list;
                    }
                }

                if (target === 'employee' || view === 'Employee') {
                    return Object.keys(groups).map(key => {
                        const list = groups[key];
                        const [item] = list;
                        const {data: {employee: group, training_matrix}} = item;
                        console.log('group', group)

                        const cost = calcCost(list);
                        const attendanceRate = calcAttendanceRate(list);
                        const results = list.map(({data: {results}}) => results || 'N/A');
                        const status = list.filter(({data: {training_matrix}}) => !!training_matrix).
                        map(({data: {training_matrix}}) => training_matrix).
                        map(({data: {status}}) => status);//[Outstanding, Completed]

                        const courseList = list.map(({data: {course_or_module}}) => course_or_module).distinct();
                        const yearList = list.map(({data: {year}}) => year).distinct();

                        return {
                            group,
                            list,
                            cost,
                            attendanceRate,
                            results,
                            status,
                            courseList,
                            yearList
                        };
                    });
                } else if (target === 'job_position' || view === 'Job Position') {
                    return Object.keys(groups).map(key => {
                        const list = groups[key];
                        const [item] = list;
                        const {data: {job_position: group, training_matrix}} = item;
                        console.log('group', group)

                        const cost = calcCost(list);
                        const attendanceRate = calcAttendanceRate(list);
                        const results = list.map(({data: {results}}) => results || 'N/A');
                        const status = list.filter(({data: {training_matrix}}) => !!training_matrix).
                        map(({data: {training_matrix}}) => training_matrix).
                        map(({data: {status}}) => status);//[Outstanding, Completed]

                        const employeeList = list.filter(({data: {employee}}) => !!employee).map(({data: {employee}}) => employee).distinct();
                        const courseList = list.map(({data: {course_or_module}}) => course_or_module).distinct();
                        const yearList = list.map(({data: {year}}) => year).distinct();

                        return {
                            group,
                            list,
                            cost,
                            attendanceRate,
                            results,
                            status,
                            employeeList,
                            courseList,
                            yearList
                        };
                    });
                } else if (target === 'course' || view === 'Course') {
                    return Object.keys(groups).map(key => {
                        const list = groups[key];
                        const [item] = list;
                        const {data: {course_or_module: group, training_matrix}} = item;
                        console.log('group', group)

                        const cost = calcCost(list);
                        const attendanceRate = calcAttendanceRate(list);
                        const results = list.map(({data: {results}}) => results || 'N/A');
                        const status = list.filter(({data: {training_matrix}}) => !!training_matrix).
                        map(({data: {training_matrix}}) => training_matrix).
                        map(({data: {status}}) => status);//[Outstanding, Completed]

                        const employeeList = list.filter(({data: {employee}}) => !!employee).map(({data: {employee}}) => employee).distinct();
                        const jobPositionList = list.filter(({data: {job_position}}) => !!job_position).map(({data: {job_position}}) => job_position).distinct();
                        const yearList = list.map(({data: {year}}) => year).distinct();

                        return {
                            group,
                            list,
                            cost,
                            attendanceRate,//
                            // const failed = __value.filter(v => v < 50).length;
                            // const passed = __value.filter(v => v >= 50).length;
                            // const average = __value.isEmpty() ? 'N/A' : (__value.reduce((a, b) => a + b, 0) / (__value.length * 100) * 100).toFixed(1) + '%';
                            results,//
                            status,
                            employeeList,
                            jobPositionList,
                            yearList
                        };
                    });
                } else if (target === 'year' || view === 'Year') {
                    return Object.keys(groups).map(key => {
                        const list = groups[key];
                        const [item] = list;
                        const {data: {training_matrix}} = item;
                        const group = key;
                        console.log('group', group)

                        const cost = calcCost(list);
                        const attendanceRate = calcAttendanceRate(list);
                        const results = list.map(({data: {results}}) => results || 'N/A');
                        const status = list.filter(({data: {training_matrix}}) => !!training_matrix).
                        map(({data: {training_matrix}}) => training_matrix).
                        map(({data: {status}}) => status);//[Outstanding, Completed]

                        const employeeList = list.filter(({data: {employee}}) => !!employee).map(({data: {employee}}) => employee).distinct();
                        const jobPositionList = list.filter(({data: {job_position}}) => !!job_position).map(({data: {job_position}}) => job_position).distinct();
                        const courseList = list.map(({data: {course_or_module}}) => course_or_module).distinct();

                        return {
                            group,
                            list,
                            cost,
                            attendanceRate,
                            results,
                            status,
                            employeeList,
                            jobPositionList,
                            courseList
                        };
                    });
                } else {
                    return list;
                }
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {view, employee_view, target_view} = search_val;
                let {incCourse, incMatrix, incRegister} = search_val;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    return q;
                });

                list = await TrainingsFuns.filterActiveOrInactiveEmployees(list, employee_view);

                if (!('incCourse' in search_val)) {
                    incCourse = true;
                }
                if (!('incRegister' in search_val)) {
                    incRegister = true;
                }
                if (!('incMatrix' in search_val)) {
                    incMatrix = true;
                }

                list = await Promise.all(list.map(async item => TrainingsFuns.mapPlanResults(item, {
                    incCourse,
                    incMatrix,
                    incRegister
                })));

                const {year, job_position, employee, course, training_matrix} = search_val;
                const q = [
                    {key: 'year', comp: '=', val: year},
                    {key: 'job_position.id', comp: '=', val: job_position},
                    {key: 'course_or_module.id', comp: '=', val: course},
                    {key: 'training_matrix.id', comp: '=', val: training_matrix},
                    [
                        {key: 'employee.data.fname', comp: 'LIKE', val: employee},
                        {key: 'employee.data.lname', comp: 'LIKE', val: employee}
                    ]
                ];
                // console.log('filter_impl', year, list)
                return this.filter_impl(evt, q, list);
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="dashboard_totals">
        async dashboard_total_participants(evt, data = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                const {interval, employee_view} = data;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    return q;
                });

                list = await TrainingsFuns.filterActiveOrInactiveEmployees(list, employee_view);

                return list.filter(({
                                        data: {
                                            employee,
                                            status
                                        }
                                    }) => status === 'Completed').map(({data: {employee}}) => employee.id).distinct().length;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="dashboard_doughnuts">
        async dashboard_doughnut_training_impl(evt, {key, value1, value2, interval, employee_view}) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await this.list(evt);

                // list = await TrainingsFuns.filterActiveOrInactiveEmployees(list, employee_view);

                if (isFunction(key)) {
                    list = list.map(key);
                } else {
                    list = list.map(({data: {[key]: value}}) => value);
                }
                const res1 = list.filter(value => value === value1).length;
                const res2 = list.filter(value => value === value2).length;
                return [res1, res2];
            });
        }

        async dashboard_doughnut_training_result(evt, data = {}) {
            const {interval, employee_view} = data;
            return this.dashboard_doughnut_training_impl(evt, {
                key: 'results',
                value1: 'Pass',
                value2: 'Fail',
                interval,
                employee_view
            });
        }

        async dashboard_doughnut_training_gender(evt, data = {}) {
            const {interval, employee_view} = data;
            return this.dashboard_doughnut_training_impl(evt, {
                key: v => v.data.employee.data.gender,
                value1: 'Male',
                value2: 'Female',
                interval,
                employee_view
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="dashboard_freq">
        async dashboard_freq_cost_impl(evt, {key, onGroup, interval, employee_view}) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await this.list(evt);

                // list = await TrainingsFuns.filterActiveOrInactiveEmployees(list, employee_view);

                const groups = onGroup(list);
                const datasets = [];
                const colors = ['dark', 'primary', 'secondary', 'info', 'warning', 'success', 'text'];
                Object.keys(groups).forEach((__key, n) => {
                    const list = groups[__key];
                    const [item] = list;
                    const {data: {[key]: group}} = item;

                    const data = Array.range(1, 12).map(n => {
                        const cost = list.filter(({data: {cost}}) => cost || 0).map(({data: {cost}}) => cost || 0).reduce((a, b) => a + b, 0);
                        return cost;
                    });

                    datasets.push({
                        label: group.data.name,
                        color: colors[n],
                        data
                    });
                });

                return {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets
                };
            });
        }

        async dashboard_freq_cost(evt, data = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await this.list(evt);

                // list = await TrainingsFuns.filterActiveOrInactiveEmployees(list, employee_view);

                const groups = onGroup(list);
                const data = Array.range(1, 12).map(n => {
                    return Object.keys(groups).map((__key, n) => {
                        const list = groups[__key];

                        //filter by month
                        const cost = list.filter(({data: {cost}}) => cost || 0).map(({data: {cost}}) => cost || 0).reduce((a, b) => a + b, 0);
                        return cost;
                    }).reduce((a, b) => a + b, 0);
                });

                return {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Cost',
                        color: 'light',
                        data
                    }]
                };
            });
        }

        async dashboard_freq_cost_course(evt, data = {}) {
            const {interval, employee_view} = data;
            return this.dashboard_freq_cost_impl(evt, {
                key: 'course_or_module',
                onGroup: list => list.groupBy(({data: {course_or_module}}) => course_or_module.id),
                interval,
                employee_view
            });
        }

        async dashboard_freq_cost_job_position(evt, data = {}) {
            const {interval, employee_view} = data;
            return this.dashboard_freq_cost_impl(evt, {
                key: 'job_position',
                onGroup: list => list.filter(({data: {job_position}}) => !!job_position).groupBy(({data: {job_position}}) => job_position.id),
                interval,
                employee_view
            });
        }

        async dashboard_freq_results_impl(evt, {key, onGroup, interval, employee_view}) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await this.list(evt);

                // list = await TrainingsFuns.filterActiveOrInactiveEmployees(list, employee_view);

                const groups = onGroup(list);
                const labels = [];
                const datasets_data_pass = [];
                const datasets_data_fail = [];
                const datasets_data_other = [];
                Object.keys(groups).forEach(__key => {
                    const list = groups[__key];
                    const [item] = list;
                    const {data: {[key]: group}} = item;

                    labels.push(group.data.name);

                    const pass = list.filter(({data: {results}}) => results === 'Pass').length;
                    const fail = list.filter(({data: {results}}) => results === 'Fail').length;
                    const other = list.filter(({data: {results}}) => results !== 'Pass' && results !== 'Fail').length;

                    datasets_data_pass.push(pass);
                    datasets_data_fail.push(fail);
                    datasets_data_other.push(other);
                });

                return {
                    labels,
                    datasets: [
                        {
                            label: 'Pass',
                            color: 'success',
                            data: datasets_data_pass
                        },
                        {
                            label: 'Fail',
                            color: 'error',
                            data: datasets_data_fail
                        },
                        {
                            label: 'Unclassified',
                            color: 'warning',
                            data: datasets_data_other
                        },
                    ]
                };
            });
        }

        async dashboard_freq_results_course(evt, data = {}) {
            const {interval, employee_view} = data;
            return this.dashboard_freq_results_impl(evt, {
                key: 'course_or_module',
                onGroup: list => list.groupBy(({data: {course_or_module}}) => course_or_module.id),
                interval,
                employee_view
            });
        }

        async dashboard_freq_results_job_position(evt, data = {}) {
            const {interval, employee_view} = data;
            return this.dashboard_freq_results_impl(evt, {
                key: 'job_position',
                onGroup: list => list.filter(({data: {job_position}}) => !!job_position).groupBy(({data: {job_position}}) => job_position.id),
                interval,
                employee_view
            });
        }

        // </editor-fold>

        sortBy() {
            return "year";
        }
    }

    function calcCost(list) {
        return list.
        filter(({data: {training_matrix}}) => !!training_matrix).
        map(({data: {training_matrix}}) => training_matrix).
        map(({data: {cost}}) => cost || 0).
        reduce((a, b) => a + b, 0)
    }

    function calcAttendanceRate(list) {
        return list.
        filter(({data: {training_register_list}}) => !!training_register_list).
        map(({data: {training_register_list}}) => training_register_list).
        map(({data: {cost}}) => cost || 0).
        reduce((a, b) => a + b, 0)
    }

    self.trainingPlanCntr = new Controller(events);
})();
