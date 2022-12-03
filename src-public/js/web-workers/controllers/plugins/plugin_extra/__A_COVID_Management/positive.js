
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
                let snapshot = await doc_ref.get();
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
                snapshot = await doc_ref.get();

                let data = snapshot.data();
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }

                const auditData = {id: snapshot.id, data: old_data};

                this.editAudit(loggedUser, new Date().getTime(), auditData);

//                console.log('update', updated)
                return data;
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
                let {list, date_from, date_to, type, business_id} = date_range;
                if (!list) {
                    list = await this.list(evt);

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
                    list = await this.filter_impl(evt, q, list);
                }

                if (list.isEmpty()) {
                    return "EMPTY";
                }

                const cols = [
                    {header: 'Business ID', key: 'Business ID', width: 35},
                    {header: 'Employee work ID ', key: 'Employee work ID ', width: 35},
                    {header: 'Employee SA National ID/ Passport number', key: 'Employee SA National ID/ Passport number', width: 35},
                    {header: 'Date', key: 'Date', width: 35},
                    {header: 'Province', key: 'Province', width: 35},
                    {header: 'District', key: 'District', width: 35},
                    {header: 'Industry', key: 'Industry', width: 35},
                    {header: 'Sex', key: 'Sex', width: 35},
                    {header: 'Age', key: 'Age', width: 35},
                    {header: 'Job category', key: 'Job category', width: 35},

                    {header: 'Test Date', key: 'Test Date', width: 35},
                    {header: 'Test type', key: 'Test type', width: 35},
                    {header: 'Symptoms Present', key: 'Symptoms Present', width: 35},
                    {header: 'Number of high-risk workplace contacts', key: 'Number of high-risk workplace contacts', width: 35},
                    {header: 'Vulnerability Present', key: 'Vulnerability Present', width: 35},
                    {header: 'Post-test result action', key: 'Post-test result action', width: 35},
                    {header: 'Exposure Contact type', key: 'Exposure Contact type', width: 35},
                    {header: 'Reporting Action', key: 'Reporting Action', width: 35}
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
                business_id: __business_id, employee, employee_id, sex, age, date, province, district, industry, job_category,
                        test_type, test_date, symptom_positive, high_risk_contacts_num, vulnerability_status, positive_test_result_action, exposure_info,
                        reporting_action_del, reporting_action_coid, reporting_action_dmre
                }}) => {
                    const employee_uid = employee.id;
                    const getReportingAction = () => {
                        const l = [];
                        if (reporting_action_del === "Yes")
                            l.push('DEL');
                        if (reporting_action_coid === "Yes")
                            l.push('COIDA');
                        if (reporting_action_dmre === "Yes")
                            l.push('DMRE');

                        if (l.isEmpty())
                            return '';
                        return l.map(v => `Reported to ${v}`).join(', ');
                    };
                    let val;
                    const formatDate = (date) => {
                        date = Dates.formatDate(date);
                        if (!date)
                            return "";
                        const arr = date.split('-');
                        const mNum = Dates.monthsNum.get(arr[1]);//0-11
                        const mNumStr = Dates.monthsDoubleNumStr.get(mNum);//1-12
                        return `${arr[2]}/${mNumStr}/${arr[0]}`;
                    };
                    const getJobCategory = job_category => {
                        if (!job_category)
                            return "";
                        if (isString(job_category))
                            return job_category;
                        const {name, data} = job_category;
                        return name || data.name;
                    };
                    if (type === "API") {
                        val = {
                            id,
                            "SAIDorPassportNumber": employee_id || "",
                            "EmployeeWorkID": employee_uid || "",
                            "Age": String(age || ""),
                            "Sex": sex || "",
                            "JobCategory": getJobCategory(job_category),
                            "Province": province || "",
                            "District": district || "",
                            "Industry": industry || "",
                            "TestDate": formatDate(test_date),
                            "TestTypePCR": test_type === "PCR" ? "Yes" : "No",
                            "TestTypeAntigen": test_type === "Antigen" ? "Yes" : "No",
                            "TestTypeAntibody": test_type === "Antibody" ? "Yes" : "No",
                            "SymptomsPositive": symptom_positive || "",
                            "NumberHighRiskContact": high_risk_contacts_num || "",
                            "VulnerabilityStatus": vulnerability_status || "",
                            "PositiveTestResultAction": positive_test_result_action || "",
                            "ExposureInformation": exposure_info || "",
                            "ReportingActionedDEL": reporting_action_del || "",
                            "ReportingActionCOIDA": reporting_action_coid || "",
                            "ReportingActionDMRE": reporting_action_dmre || "",
                            "Date": formatDate(test_date),
                            "Update": 0
                        };
                    } else {
                        val = {
                            'Business ID': business_id || __business_id,
                            'Employee work ID': employee_uid,
                            'Employee SA National ID/ Passport number': employee_id,
                            Province: province,
                            District: district,
                            Industry: industry,
                            Sex: sex,
                            Age: age,
                            'Job category': getJobCategory(job_category),

                            'Test Date': formatDate(test_date),
                            "Test type": test_type || 'Unknown',
                            'Symptoms Present': symptom_positive,
                            'Number of high-risk workplace contacts': high_risk_contacts_num,
                            'Vulnerability Present': vulnerability_status,
                            'Post-test result action': positive_test_result_action,
                            'Exposure Contact type': exposure_info,
                            'Reporting Action': getReportingAction()
                        };
                    }
                    return val;
                });


                if (type === "API") {
                    return rows;
                } else {
                    return await this.export_excel_impl(loggedUser, "COVID-Docs", "PositiveCase", "Positive Case Data", cols, rows);
                }
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