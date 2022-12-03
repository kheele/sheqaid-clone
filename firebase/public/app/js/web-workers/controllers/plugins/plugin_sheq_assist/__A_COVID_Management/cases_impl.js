
function create_column_chart(title, title_axis_y, title_axis_x, y_value_format_string, data_points) {
    return {
        zoomEnabled: true,
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2",
        //            title: {text: title},
        axisY: {title: title_axis_y},
        axisX: {
            title: title_axis_x,
            interval: 1,
            //            intervalType: "month",
            valueFormatString: "MMM"
        },
        toolTip: {
            shared: true
        },
        data: [
            {
                type: "column",
//                                showInLegend: true,
                xValueFormatString: "{label}",
                yValueFormatString: y_value_format_string,
                toolTipContent: "{y}",
                dataPoints: data_points
            }
        ]
    };
}

class ACasesController extends AControllerAssist {
    //audit_findings, audit_summary, possible_score, achieved_score
    constructor(events, db, name, root, tbl, fn) {
        super(events, db, name, root, tbl, fn);

        const {addAction} = this;

        addAction("stats", this.stats.bind(this));
        addAction("stats/graphs", this.stats_graphs.bind(this));

        addAction("list/by_employee", this.list_by_employee.bind(this));
        addAction("list/by_employee/filter", this.filter_by_employee.bind(this));

        const _fn = async (from, limit) => {
            const doc_ref = await this.getDB().collection(tbl).orderBy('created_at', 'asc')
                    ;//.limit(4000);//Promise < DocumentReference < T > >
            const querySnapshot = await doc_ref.get();

            console.log('cases start', tbl, querySnapshot.size)

            const map = async (doc) => {
                const doc_ref = await this.getDB().collection(tbl).doc(doc.id);
                let snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                try {
                    const old_data = snapshot.data();
                    if (old_data.date) {
                        const {
                            date: date_old,
                            date_split: date_split_old
                        } = old_data;
                        old_data.date_split = date_split_old || {};

                        const __date = Dates.parse(date_old);
                        //                        console.log('date', date, __date)
                        old_data.date_split.year = __date.getFullYear();
                        old_data.date_split.month = __date.getMonth();
                        old_data.date_split.date = __date.getDate();
                        old_data.date_split.day = __date.getDay();
                        old_data.date_split.week = __date.getWeekNumber();
                    }

                    const updated = await doc_ref.set(old_data, {merge: true});//Promise < void >
                    console.log('cases updated done', doc.id);
                } catch (ex) {
                    console.error('cases updated err', doc.id, ex);
                    throw ex;
                }

//                    console.log('cases updated done', doc.id);
            };
            const list = querySnapshot.docs;//.filter(doc => !doc.data().date_split);
            console.log('cases list', tbl, list.length)

            await Promise.all(list.slice(0, 500).map(map));
            await Promise.all(list.slice(500, 1000).map(map));
            await Promise.all(list.slice(1000, 1500).map(map));
            await Promise.all(list.slice(1500, 2000).map(map));
            await Promise.all(list.slice(2000, 2500).map(map));
            await Promise.all(list.slice(2500, 3000).map(map));
            await Promise.all(list.slice(3000, 3500).map(map));
            await Promise.all(list.slice(3500, 4000).map(map));
            await Promise.all(list.slice(4000, 4500).map(map));
            await Promise.all(list.slice(4500, 5000).map(map));
            await Promise.all(list.slice(5000, 5500).map(map));
            await Promise.all(list.slice(5500, 6000).map(map));
            await Promise.all(list.slice(6000, 6500).map(map));
            await Promise.all(list.slice(6500, 7000).map(map));

            console.log('cases dates final');
        };

//        const exec = async () => {
//            await _fn();
//        };
//        exec();
    }

    // <editor-fold defaultstate="collapsed" desc="create">
    async create(evt, data) {
        return Events.whenLoggedIn(async loggedUser => {
            const {date} = data;
            const __date = Dates.parse(date);
            data.date_split = {
                year: __date.getFullYear(),
                month: __date.getMonth(),
                date: __date.getDate(),
                day: __date.getDay(),
                week: __date.getWeekNumber()
            };

            const res = await AControllerAssist.prototype.create.call(this, evt, data);
            if (res) {
                const {notification_key} = this;
                if (notification_key === "receive_covid_positive_case_notifs" || notification_key === "receive_covid_return_to_work_notifs") {
                    let {contractor_id: logged_contractor_id} = loggedUser;
                    if (logged_contractor_id) {
                        const users_ctrl = await Events.get('users/');
                        const employees_ctrl = await Events.get('plugin_sheq_assist/employees/');
                        const user_list = await users_ctrl.filter_by_notification_key.call(users_ctrl, null, this.notification_key, true);
                        const employee_list = await employees_ctrl.filter_by_notification_key.call(employees_ctrl, null, this.notification_key, true);

                        const emails = [
                            ...user_list.map(val => val.data.username),
                            ...employee_list.filter(val => val.data.email).map(val => val.data.email)
                        ];

                        const titles = {
                            receive_covid_positive_case_notifs: 'Positive Case', 
                            receive_covid_return_to_work_notifs: 'Return To Work Case' 
                        };
                        const {data: {date, client, project, site}} = res;
                        let location = "";
                        if(client) {
                            location = client.name || client.data.name;
                        }
                        if(project) {
                            location += " > " + (project.name || project.data.name);
                        }
                        if(site) {
                            location += " > " + (site.name || site.data.name);
                        }
                        if(location.isEmpty()) {
                            location = "N/A";
                        }
                        const opts = {
                            from: '"SHEQ Assist" <support@sheqsolve.com>',
                            to: emails.join(','),
                            subject: 'New COVID ' + titles[notification_key] +' Recorded',
                            html: '<p>This is an automated email from SHEQ Assist.<br />Please do not reply to this email.</p>\n\
                            <p>The following COVID ' + titles[notification_key] + ' has been reported:</p>\n\
                            <p>Location (Company/Project/Site): <b>' + location + '</b></p>\n\
                            <p>ID: <b>' + res.id + '</b></p>\n\
                            <p>Date: <b>' + (Dates.formatDate(date) || 'N/A') + '</b></p>\n\
                            <p>Kind Regards<br/>SHEQ Assist</p>'
                        };

                        console.log('callables-sendEmail', opts)
                        const sendEmail = functions.httpsCallable('callables-sendEmail');
                        const mailRes = await sendEmail(opts);
                        console.log('mailRes', mailRes)
                    }
                }
            }
            return res;
        });
    }

    async stats(evt) {
        return Events.whenLoggedIn(async loggedUser => {
            const cal = new Date();
            const list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1, direction: "desc"}, q => {
                const year = cal.getFullYear();
                const week = cal.getWeekNumber();
                console.log('stats', year, week)

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

    async stats_graphs(evt, year) {
        return Events.whenLoggedIn(async loggedUser => {
            const list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1, direction: "desc"}, q => {
                q = q.where('date_split.year', '==', year);

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

    async list_by_employee(evt, time) {
        return Events.whenLoggedIn(async loggedUser => {
            let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1, direction: "desc"}, q => {
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

    async filter_by_employee(evt, search_val, time) {
        return Events.whenLoggedIn(async loggedUser => {
            const {employee, date_range} = search_val;
            let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1, direction: "desc"}, q => {
                if (employee) {
                    q = q.where('employee.id', '==', employee);
                }
                if (date_range) {
                    const {start, end} = date_range;
                    if (start) {
                        q = q.where('date', '>=', start);
                    }
                    if (end) {
                        q = q.where('date', '<=', end);
                    }
                }
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

    sortBy() {
        return "date";
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