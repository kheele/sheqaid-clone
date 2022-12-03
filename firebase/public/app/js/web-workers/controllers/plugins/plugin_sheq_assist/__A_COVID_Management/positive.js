
(() => {
    class Controller extends ACasesController {
        //audit_findings, audit_summary, possible_score, achieved_score
        constructor(events, db) {
            super(events, db, {singular: "COVID Management Positive Case", plural: "COVID Management Positive Cases"}, "plugin_sheq_assist/COVID_Management/positive/", "plugin_sheq_assist_COVID_Management_positive");

            this.notification_key = "receive_covid_positive_case_notifs";
        
            this.approve = this.approve.bind(this);

            this.stats_approved = this.stats_approved.bind(this);
            this.stats_unapproved = this.stats_unapproved.bind(this);
            this.stats_graphs_approved = this.stats_graphs_approved.bind(this);
            this.stats_graphs_unapproved = this.stats_graphs_unapproved.bind(this);

            this.list_by_employee_approved = this.list_by_employee_approved.bind(this);
            this.list_by_employee_unapproved = this.list_by_employee_unapproved.bind(this);

            this.export_excel_approved = this.export_excel_approved.bind(this);

            const {addAction, approve, stats_approved, stats_unapproved, stats_graphs_approved, stats_graphs_unapproved, list_by_employee_approved, list_by_employee_unapproved, export_excel_approved} = this;

            addAction("approve", approve);

            addAction("approved/stats", stats_approved);
            addAction("unapproved/stats", stats_unapproved);
            addAction("approved/stats/graphs", stats_graphs_approved);
            addAction("unapproved/stats/graphs", stats_graphs_unapproved);

            addAction("approved/list/by_employee", list_by_employee_approved);
            addAction("unapproved/list/by_employee", list_by_employee_unapproved);
//            addAction("return-to-work/list/by_employee", list_by_employee_unapproved);

            addAction("approved/export-excel", export_excel_approved);
//            addAction("unapproved/export-excel", export_excel_unapproved);
        }

        async create(evt, data) {
            data.approved = false;
            return await ACasesController.prototype.create.call(this, evt, data);
        }

        async approve(evt, id, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                const snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                const old_data = snapshot.data();
                const {created_at} = old_data;
                if (created_at && created_at.toDate) {
                    old_data.created_at = created_at.toDate();
                }

                updateAttrs.approved = true;
                const updated = await doc_ref.update(updateAttrs);//Promise < void >

                const auditData = {id: snapshot.id, data: old_data};

                this.editAudit(loggedUser, new Date().getTime(), auditData);

                console.log('update', updated)
                return updated === 1;
            });
        }

        async stats_approved(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                const cal = new Date();
                const list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1, direction: "desc"}, q => {
                    const year = cal.getFullYear();
                    const week = cal.getWeekNumber();
                    console.log('stats', year, week)

                    q = q.where('approved', '==', true);
                    q = q.where('date_split.year', '==', year).where('date_split.week', '==', week);

                    if (loggedUser.access_type === "Employee") {
                        q = q.where('employee.id', '==', loggedUser.user.id);
                    }

                    return q;
                });

                const mapper = async (title) => {
                    const count = list.filter(({data: {date_split}}) => {
                        if (!date_split)
                            return false;
                        if (title === "Today") {
                            console.log('stats', title, date_split.date, '=', cal.getDate())
                            return date_split.date === cal.getDate();
                        }
                        return true;
                    }).length;
//                console.log(this.tbl, 'stats here 2', list)
                    return {title, count};
                };

//            console.log(this.tbl, 'stats')
                const res = await Promise.all(["Today", "This Week"].map(mapper));
//            console.log(this.tbl, 'stats', res)
                return res;
            });
        }

        async stats_unapproved(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                const cal = new Date();
                const list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1, direction: "desc"}, q => {
                    const year = cal.getFullYear();
                    const week = cal.getWeekNumber();
                    console.log('stats', year, week)

                    q = q.where('approved', '==', false);
                    q = q.where('date_split.year', '==', year).where('date_split.week', '==', week);

                    if (loggedUser.access_type === "Employee") {
                        q = q.where('employee.id', '==', loggedUser.user.id);
                    }

                    return q;
                });

                const mapper = async (title) => {
                    const count = list.filter(({data: {date_split}}) => {
                        if (!date_split)
                            return false;
                        if (title === "Today") {
                            console.log('stats', title, date_split.date, '=', cal.getDate())
                            return date_split.date === cal.getDate();
                        }
                        return true;
                    }).length;
//                console.log(this.tbl, 'stats here 2', list)
                    return {title, count};
                };

//            console.log(this.tbl, 'stats')
                const res = await Promise.all(["Today", "This Week"].map(mapper));
//            console.log(this.tbl, 'stats', res)
                return res;
            });
        }

        async stats_graphs_approved(evt, year) {
            return Events.whenLoggedIn(async loggedUser => {
                const list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1, direction: "desc"}, q => {
                    q = q.where('date_split.year', '==', year);

                    q = q.where('approved', '==', true);
                    if (loggedUser.access_type === "Employee") {
                        q = q.where('employee.id', '==', loggedUser.user.id);
                    }

                    return q;
                });
//            console.log('stats_graphs', evt, list.length, year)
                const mapper = async (month) => {
                    const y = list.filter(({data: {date_split}}) => date_split && date_split.month === month).length;
                    month++;
                    const x = year + "-" + (month < 10 ? ('0' + month) : month);
                    return {x, y};
                };

                let columns = await Promise.all([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(mapper));
//            console.log(this.tbl, 'stats_graphs')
                const res = create_column_chart("SUMMARY (" + year + ")", "No. Of Cases", "Month (" + year + ")", "###0 Cases", columns);
//            console.log(this.tbl, 'stats_graphs', res)
                return res;
            });
        }

        async stats_graphs_unapproved(evt, year) {
            return Events.whenLoggedIn(async loggedUser => {
                const list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1, direction: "desc"}, q => {
                    q = q.where('date_split.year', '==', year);

                    q = q.where('approved', '==', false);
                    if (loggedUser.access_type === "Employee") {
                        q = q.where('employee.id', '==', loggedUser.user.id);
                    }

                    return q;
                });
//            console.log('stats_graphs', evt, list.length, year)
                const mapper = async (month) => {
                    const y = list.filter(({data: {date_split}}) => date_split && date_split.month === month).length;
                    month++;
                    const x = year + "-" + (month < 10 ? ('0' + month) : month);
                    return {x, y};
                };

                let columns = await Promise.all([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(mapper));
//            console.log(this.tbl, 'stats_graphs')
                const res = create_column_chart("SUMMARY (" + year + ")", "No. Of Cases", "Month (" + year + ")", "###0 Cases", columns);
//            console.log(this.tbl, 'stats_graphs', res)
                return res;
            });
        }

        async list_by_employee_approved(evt, time) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1, direction: "desc"}, q => {
                    q = q.where('approved', '==', true);
                    const filter = covidCreateDbFilterByTime.call(this, time);
                    return filter(q);
                });

                const groupList = list.map(({id, data}) => {
                    return {_id: id, ...data};
                }).groupBy('employee.id');
                list = Object.keys(groupList).map(k => {
                    const list = groupList[k].map(v => {
                        const {_id: id} = v;
                        delete v._id;
                        return {id, data: v};
                    });
                    const _group = list.find(v => v.data.employee.id === k).data.employee;
                    return {_group, list};
                });
//            console.log(this.tbl, list)
                return list;
            });
        }

        async list_by_employee_unapproved(evt, time) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1, direction: "desc"}, q => {
                    q = q.where('approved', '==', false);
                    const filter = covidCreateDbFilterByTime.call(this, time);
                    return filter(q);
                });

                const groupList = list.map(({id, data}) => {
                    return {_id: id, ...data};
                }).groupBy('employee.id');
                list = Object.keys(groupList).map(k => {
                    const list = groupList[k].map(v => {
                        const {_id: id} = v;
                        delete v._id;
                        return {id, data: v};
                    });
                    const _group = list.find(v => v.data.employee.id === k).data.employee;
                    return {_group, list};
                });
//            console.log(this.tbl, list)
                return list;
            });
        }

        async export_excel_approved(evt, date_range) {
            return Events.whenLoggedIn(async loggedUser => {
                const {date_from, date_to} = date_range;
                const d_from = new Date(date_from);
                d_from.setHours(0);
                d_from.setMinutes(0);
                d_from.setSeconds(0);

                const d_to = new Date(date_to);
                d_to.setHours(23);
                d_to.setMinutes(59);
                d_to.setSeconds(59);
                let q = [
                    [
                        {key: 'approved', comp: '=', val: true},
                        {key: 'created_at.getTime()', comp: '>=', val: d_from.getTime()},
                        {key: 'created_at.getTime()', comp: '<=', val: d_to.getTime()}
                    ]
                ];
                let list = await this.filter_impl(evt, q, list);

                if (list.isEmpty()) {
                    return "EMPTY";
                }

                const cols = [
                    {header: 'BusinessID', key: 'BusinessID', width: 35},
                    {header: 'EmployeeID', key: 'EmployeeID', width: 35},
                    {header: 'EmployeeNationalID', key: 'EmployeeNationalID', width: 35},
                    {header: 'Date', key: 'Date', width: 35},
                    {header: 'Province', key: 'Province', width: 35},
                    {header: 'District', key: 'District', width: 35},
                    {header: 'Sex', key: 'Sex', width: 35},
                    {header: 'Age', key: 'Age', width: 35},
                    {header: 'JobCategory', key: 'JobCategory', width: 35},

                    {header: 'TestDate', key: 'TestDate', width: 35},
                    {header: 'TestType-PCR', key: 'TestType-PCR', width: 35},
                    {header: 'TestType-Antigen', key: 'TestType-Antigen', width: 35},
                    {header: 'TestType-Antibody', key: 'TestType-Antibody', width: 35},
                    {header: 'SymptomsPositive', key: 'SymptomsPositive', width: 35},
                    {header: 'NumberHighRiskContact', key: 'NumberHighRiskContact', width: 35},
                    {header: 'VulnerabilityStatus', key: 'VulnerabilityStatus', width: 35},
                    {header: 'PositiveTestResultAction', key: 'PositiveTestResultAction', width: 35},
                    {header: 'ExposureInformation', key: 'ExposureInformation', width: 35},
                    {header: 'ReportingActionedDEL', key: 'ReportingActionedDEL', width: 35},
                    {header: 'ReportingActionCOIDA', key: 'ReportingActionCOIDA', width: 35},
                    {header: 'ReportingActionDMRE', key: 'ReportingActionDMRE', width: 35}
                ];

//                employee: {id, fname, lname}, employee_id, business_id, date: date.getTime(), sex, age, province, district, job_category, 
//                test_type, test_date: test_date.getTime(), symptom_positive, high_risk_contacts_num, vulnerability_status, positive_test_result_action, exposure_info,
//                if(reporting_action_del) {
//                    data.reporting_action_del = reporting_action_del;
//                }
//                if(reporting_action_coid) {
//                    data.reporting_action_coid = reporting_action_coid;
//                }
//                if(reporting_action_dmre) {
//                    data.reporting_action_dmre = reporting_action_dmre;
//                }
                const rows = list.map(({id, data: {
                business_id, employee_id, sex, age, date, province, district, job_category,
                        test_type, test_date, symptom_positive, high_risk_contacts_num, vulnerability_status, positive_test_result_action, exposure_info,
                        reporting_action_del, reporting_action_coid, reporting_action_dmre
                }}) => {
                    return {
                        BusinessID: business_id,
                        EmployeeID: employee_id,
                        EmployeeNationalID: employee_id,
                        Date: new Date(date),
                        Province: province,
                        District: district,
                        Sex: sex,
                        Age: age,
                        JobCategory: job_category ? job_category.name || job_category : null,

                        TestDate: new Date(test_date),
                        "TestType-PCR": test_type === "PCR" ? "Yes" : "No",
                        "TestType-Antigen": test_type === "Antigen" ? "Yes" : "No",
                        "TestType-Antibody": test_type === "Antibody" ? "Yes" : "No",
                        SymptomsPositive: symptom_positive,
                        NumberHighRiskContact: high_risk_contacts_num,
                        VulnerabilityStatus: vulnerability_status,
                        PositiveTestResultAction: positive_test_result_action,
                        ExposureInformation: exposure_info,
                        ReportingActionedDEL: reporting_action_del || '',
                        ReportingActionCOIDA: reporting_action_coid || '',
                        ReportingActionDMRE: reporting_action_dmre || ''
                    };
                });

                return await this.export_excel_impl(loggedUser, "COVID-Docs", "PositiveCase", "Positive Case Data", cols, rows);
            });
        }
    }

    function covidCreateDbFilterByTime(title) {
        return q => {
            const cal = new Date();
            const year = cal.getFullYear();
            const month = cal.getMonth();
            const date = cal.getDate();
            const week = cal.getWeekNumber();

            if (title === 'Today') {
                q = q.where('date_split.year', '==', year).
                        where('date_split.month', '==', month).
                        where('date_split.date', '==', date);
            } else if (title === 'Yesterday') {
                q = q.where('date_split.year', '==', year).
                        where('date_split.month', '==', month).
                        where('date_split.date', '==', date - 1);
            } else if (title === 'This Week') {
                q = q.where('date_split.year', '==', year).
                        where('date_split.week', '==', week);
            } else if (title === 'Last Week') {
                q = q.where('date_split.year', '==', year).
                        where('date_split.week', '==', week - 1);
            } else if (title === 'This Month') {
                q = q.where('date_split.year', '==', year).
                        where('date_split.month', '==', month);
            } else if (title === 'Last Month') {
                q = q.where('date_split.year', '==', year).
                        where('date_split.month', '==', month - 1);
            } else if (title === 'This Year') {
                q = q.where('date_split.year', '==', year);
            } else if (title === 'Last Year') {
                q = q.where('date_split.year', '==', year - 1);
            }
            return q;
        };
    }

    new Controller(events, db);
})();