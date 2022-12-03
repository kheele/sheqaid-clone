
(() => {
    class Controller extends AControllerAssist {
        //name, department, desc
        constructor(events, db) {
            super(events, db, {singular: "Training Report", plural: "Training Reports"}, "plugin_sheq_assist/05_Trainings/reports/");
            
            this.stats = this.stats.bind(this);
            const {addAction, stats} = this;
            addAction("stats", stats);
        }

        async stats(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                const cntr = await Events.get('plugin_sheq_assist/05_Trainings/training-matrix/');
                const list = await cntr.list(evt);
                let stats_count = await Promise.all(Object.entries({
                    completed_trainings: 'Completed',
                    outstanding_trainings: 'Outstanding',
                    accredited_trainings: 'Accredited',
                    non_accredited_trainings: 'Non-Accredited'
                }).map(async ([key, val]) => {
                    let res = alasql("SELECT COUNT(*) AS _count, SUM(o.data.cost) AS cost FROM ? AS o WHERE o.data.status = '" + val + "'", [list]);
                    res = res[0];
                    res.count = res._count;
                    res.cost = parseInt(res.cost);
                    delete res._count;
                    const o = {};
                    o[key] = res;
                    return o;
                }));
                stats_count = stats_count.reduce(function (acc, cur) {
                    var key = Object.keys(cur)[0]; //first property: a, b, c
                    acc[key] = cur[key];
                    return acc;
                }, {});
                console.log('stats_count', stats_count)
                return {stats_count};
            });
        }
    }

    new Controller(events, db);
})();