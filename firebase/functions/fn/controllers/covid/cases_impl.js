
class ACasesCntr extends ACntr {
    constructor(eventManager, root, tbl) {
        super(eventManager, root, tbl);

        const {addAction} = this;

        addAction("stats", this.stats.bind(this));
        addAction("list/by_employee", this.list_by_employee.bind(this));
    }

    async count(ctx, data) {
        return this.whenLoggedIn(ctx).then(async loggedUser => {
//        console.log('total_stats', data);
            const {client_id, project_id, site_id} = data;
            let q = db.collection(this.tbl);//Promise < DocumentReference < T > >
            q = q.where("company_id", "=", loggedUser.company.id);
            q = q.where("created_at", ">=", new Date().toMonthStartDate());
            if (client_id) {
                q = q.where("client_id", "=", client_id);
            }
            if (project_id) {
                q = q.where("project_id", "=", project_id);
            }
            if (site_id) {
                q = q.where("site_id", "=", site_id);
            }
            const querySnapshot = await q.get();//Promise < DocumentReference < T > >    
            console.log(
                'count', 
                this.tbl, 
                querySnapshot.size, 
                new Date().toMonthStartDate(),
                loggedUser.company.id, 
                client_id, project_id, site_id
            )    
            return querySnapshot.size;
        });
    }

    async stats(ctx, data) {
        return this.whenLoggedIn(ctx).then(async loggedUser => {
//        console.log('stats', data);
            const {client_id, project_id, site_id} = data;
//            let q = db.collection(this.tbl + '_stats').where;//Promise < DocumentReference < T > >
            
            let q = db.collection(this.tbl);//Promise < DocumentReference < T > >
            q = q.where("company_id", "=", loggedUser.company.id);
            q = q.where("created_at", ">=", new Date().toMonthStartDate().addDays(-1).toMonthStartDate());
            if (client_id) {
                q = q.where("client_id", "=", client_id);
            }
            if (project_id) {
                q = q.where("project_id", "=", project_id);
            }
            if (site_id) {
                q = q.where("site_id", "=", site_id);
            }
            const querySnapshot = await q.get();//Promise < DocumentReference < T > >
            const list = [];
            querySnapshot.docs.forEach(doc => {
                const {created_at} = doc.data();
                if (created_at) {
                    list.push(created_at.toDate());
                }
            });

            const d = new Date();
            const lastMonth = list.filter(created_at => {
                return created_at.durationNext(d)._data.months === 1;
            });
            const thisMonth = list.filter(created_at => {
                return created_at.durationNext(d)._data.months === 0;
            });
            const lastWeek = list.filter(created_at => {
                return created_at.getWeekNumber() === d.getWeekNumber() - 1;
            });
            const thisWeek = list.filter(created_at => {
                return created_at.getWeekNumber() === d.getWeekNumber();
            });
            const yesterday = list.filter(created_at => {
                return created_at.durationNext(d)._data.days === 1;
            });
            const today = thisWeek.filter(created_at => {
                return created_at.durationNext(d)._data.days === 0;
            });

            const stats = {};
            stats.today = today.length;
            stats.yesterday = yesterday.length;
            stats.thisWeek = thisWeek.length;
            stats.lastWeek = lastWeek.length;
            stats.thisMonth = thisMonth.length;
            stats.lastMonth = lastMonth.length;
            console.log(
                'stats', 
                this.tbl, 
                JSON.stringify(stats), 
                new Date().toMonthStartDate().addDays(-1).toMonthStartDate(),
                loggedUser.company.id, 
                client_id, project_id, site_id
            )
            return stats;
        });
    }

    async list_by_employee(ctx, data) {
        const {company_id, client_id, project_id, site_id, time} = data;
        let q = db.collection(this.tbl);//Promise < DocumentReference < T > >
        q = q.where("company_id", "=", company_id);
        if (client_id) {
            q = q.where("client_id", "=", client_id);
        }
        if (project_id) {
            q = q.where("project_id", "=", project_id);
        }
        if (site_id) {
            q = q.where("site_id", "=", site_id);
        }
        const querySnapshot = await q.get();//Promise < DocumentReference < T > >

        const d = new Date();
        const times = {
            today: (created_at) => {
                return created_at.durationNext(d)._data.days === 0;
            },
            yesterday: (created_at) => {
                return created_at.durationNext(d)._data.days === 1;
            },
            thisWeek: (created_at) => {
                return created_at.getWeekNumber() === d.getWeekNumber();
            },
            lastWeek: (created_at) => {
                return created_at.getWeekNumber() === d.getWeekNumber() - 1;
            },
            thisMonth: (created_at) => {
                return created_at.durationNext(d)._data.months === 0;
            },
            lastMonth: (created_at) => {
                return created_at.durationNext(d)._data.months === 1;
            },
            thisYear: (created_at) => {
                return created_at.durationNext(d)._data.years === 0;
            },
            lastYear: (created_at) => {
                return created_at.durationNext(d)._data.years === 1;
            }
        };

        let _list = [];
        querySnapshot.docs.forEach(doc => {
            const {created_at} = doc.data();
            if (created_at) {
                const filter = times[time];
                if (filter) {
                    const found = filter(created_at.toDate());
                    if (found) {
                        _list.push({id: doc.id, data: doc.data()});
                    }
                }
            }
        });

        return _list.map(({data: {employee: {id, fname, lname}}}) => {
            return {id, fname, lname};
        }).distinct().map(_group => {
            const list = _list.filter(({data: {employee: {id}}}) => {
                return id === _group.id;
            });
            return {_group, list};
        });
    }
}

exports.ACasesCntr = ACasesCntr;