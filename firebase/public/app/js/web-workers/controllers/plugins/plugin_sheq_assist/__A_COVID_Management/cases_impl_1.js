
function createTimeFilter(time) {
    let filter;
    if (time === "Today") {
        filter = "o.data.date.formatDate() = new Date().formatDate()";
    } else if (time === "Yesterday") {
        filter = "o.data.date_split.year = new Date().getFullYear() and \n\
                            o.data.date_split.month = new Date().getMonth() and \n\
                            o.data.date_split.date = new Date().getDate() - 1";
    } else if (time === "This Week") {
        filter = "o.data.date_split.year = new Date().getFullYear() and \n\
                            o.data.date_split.month = new Date().getMonth() and \n\
                            o.data.created_at.getWeekNumber() = new Date().getWeekNumber()";
    } else if (time === "Last Week") {
        filter = "o.data.date_split.year = new Date().getFullYear() and \n\
                            o.data.date_split.month = new Date().getMonth() and \n\
                            o.data.created_at.getWeekNumber() = new Date().getWeekNumber() - 1";
    } else if (time === "This Month") {
        filter = "o.data.date_split.year = new Date().getFullYear() and \n\
                            o.data.date_split.month = new Date().getMonth()";
    } else if (time === "Last Month") {
        filter = "o.data.date_split.year = new Date().getFullYear() and \n\
                            o.data.date_split.month = new Date().getMonth() - 1";
    } else if (time === "This Year") {
        filter = "o.data.date_split.year = new Date().getFullYear()";
    } else if (time === "Last Year") {
        filter = "o.data.date_split.year + 1 = new Date().getFullYear()";
    }
    
    return filter;
}

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

            const _fn = async () => {
                const doc_ref = await this.getDB().collection(tbl);//Promise < DocumentReference < T > >
                const querySnapshot = await doc_ref.get();
                const list = [];
                querySnapshot.forEach((doc) => {
                    list.push(doc);
                });

                await Promise.all(list.map(async (doc) => {
                    const doc_ref = await this.getDB().collection(tbl).doc(doc.id);
                    let snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
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
                    }

                    const updated = await doc_ref.set(old_data, {merge: true});//Promise < void >

                    console.log('cases dates done', doc.id);
                }));
                console.log('cases dates final');
            };

//            _fn().catch(err => {
//                console.error('cases dates error', err)
//            });
    }

    async stats(evt) {
        return Events.whenLoggedIn(async loggedUser => {
            let list = await this.list(evt);
            const res = await Promise.all(["Today", "This Week", "This Month", "Last Month"].map(async title => {
                let q = "SELECT COUNT(*) as _count FROM ? AS o";
                if (title !== "Total")
                    q += " WHERE " + createTimeFilter(title);
                if(loggedUser.access_type === "Employee")
                    q += " AND o.data.employee.id === " + loggedUser.user.id;
                const {_count: count} = alasql(q, [list])[0];
                return {title, count};
            }));
//            console.log(this.tbl, 'stats', res)
            return res;
        });
    }

    async stats_graphs(evt, year) {
        return Events.whenLoggedIn(async loggedUser => {
            let list = await this.list(evt);
            let columns = await Promise.all([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(async month => {
                const q = "SELECT COUNT(*) as _count FROM ? AS o WHERE o.data.date_split.year = " + year + " and o.data.date_split.month = " + month;
                if(loggedUser.access_type === "Employee")
                    q += " AND o.data.employee.id === " + loggedUser.user.id;
                month++;
                const x = year + "-" + (month < 10 ? ('0' + month) : month);
                const y = alasql(q, [list])[0]._count;
                return {x, y};
            }));
            
            const res = create_column_chart("SUMMARY (" + year + ")", "No. Of Cases", "Month (" + year + ")", "###0 Cases", columns);
            console.log(this.tbl, 'stats', res)
            return res;
        });
    }

    async list_by_employee(evt, time) {
        return Events.whenLoggedIn(async loggedUser => {
            let list = await this.list(evt);
            let q = "SELECT DISTINCT o.data.employee.id as e_id, o.data.employee.fname as e_fname, o.data.employee.lname as e_lname FROM ? AS o";

            console.log('list_by_employee', time, createTimeFilter(time))
            const groupList = alasql(q + " where " + createTimeFilter(time), [list]);
//            console.log('list_by_employee', groupList)
            list = groupList.map(o => {
                const q = "SELECT * FROM ? AS o WHERE o.data.employee.id = '" + o.e_id + "'";
                return {_group: {id: o.e_id, fname: o.e_fname, lname: o.e_lname}, list: alasql(q + ' and ' + createTimeFilter(time), [list])};
            });
            console.log(this.tbl, groupList, list)
            return list;
        });
    }

    async filter_by_employee(evt, search_val) {
        return Events.whenLoggedIn(async loggedUser => {
            let list = await this.list_by_employee(evt);

            const {employee} = search_val;
            const q = [
                [
                    {key: '_group.fname', comp: 'LIKE', val: employee},
                    {key: '_group.lname', comp: 'LIKE', val: employee}
                ]
            ];
            return this.filter_impl(evt, q, list);
        });
    }
}