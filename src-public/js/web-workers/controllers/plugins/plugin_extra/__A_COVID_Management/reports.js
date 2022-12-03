
(() => {
    class Controller extends AControllerAid {
        //name, department, desc
        constructor(events, db) {
            super(events, db, {singular: "COVID Management Report", plural: "COVID Management Reports"}, "plugin_sheq_assist/COVID_Management/reports/");
            this.stats = this.stats.bind(this);
            const {addAction, stats} = this;
            addAction("stats", stats);
        }

        async stats(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                const cntr = await Events.get('plugin_sheq_assist/COVID_Management/screening/');
                const list = await cntr.list(evt);
                let stats_count = await Promise.all(Object.entries({
                    temperature_low: true,
                    temperature_normal: true,
                    temperature_high: true,

                    chillis: true,
                    dry_cough: true,
                    sore_throat: true,

                    shortness_of_breath: true,
                    body_pains: true,
                    diarrhea: true,

                    redness_of_eye: true,
                    loss_of_taste: true,
                    loss_of_smell: true,

                    nausea: true,
                    weakness: true,
                    in_contact_with_covid_patient: true,

                    last_14_days_travelled: true,
                    last_14_days_to_locations: true,
                    last_14_days_to_doctor: true
                }).map(async ([key, val]) => {
                    let q = "SELECT COUNT(*) AS _count FROM ? AS o WHERE o.data.checklist.";
                    if (key === 'temperature_low') {
                        q += "temperature.status <= 35.0";
                    } else if (key === 'temperature_normal') {
                        q += "temperature.status >= 36.5 AND o.data.checklist.temperature.status <= 37.5";
                    } else if (key === 'temperature_high') {
                        q += "temperature.status > 37.5";
                    } else {
                        q += key + ".status = '" + (!!val ? 'Yes' : 'No') + "'";
                    }
                    let res = alasql(q, [list]);
                    res = res[0];
                    const o = {};
                    o[key] = res._count;
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