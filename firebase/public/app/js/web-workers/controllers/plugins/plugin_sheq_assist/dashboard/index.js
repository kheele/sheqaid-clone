
(() => {
    class Controller extends AControllerAssist {
        //approvals, contracts, documents, employees, incidents, medical_records, sick_leaves, trainings, warnings, work_permits
        constructor(events, db) {
            super(events, db, {singular: "Dashboard", plural: "Dashboard"}, "plugin_sheq_assist/dashboard/");

            this.stats = this.stats.bind(this);
            const {addAction, stats} = this;
            addAction("stats", stats);
        }

        async stats(evt, yr) {
            return Events.whenLoggedIn(async loggedUser => {
                const assets = await Events.get('plugin_sheq_assist/19_Maintenance/tools/');
                const assets_list = await assets.list(evt);
                const incidents = await Events.get('plugin_sheq_assist/17_Incident_Investigation/');
                const incidents_list = await incidents.list(evt);
                const sites = await Events.get('plugin_sheq_assist/sites/');
                const sites_list = await sites.list(evt);

                let res = {
                    top_counts: {
                        assets: assets_list.length,
                        incidents: incidents_list.length,
                        sites: sites_list.length
                    }
                };

                let assets_pie = [];
                let incidents_pie = [];
                let sites_pie = [];

                let assets_line = [];
                let incidents_line = [];
                let sites_line = [];

                const actions = [];
                for (var n = 1; n <= 12; n++) {
                    actions.push(function () {
                        const mon = this;
                        return async function () {
                            const x = yr + (mon < 10 ? ('0' + mon) : mon);

                            const filter = v => {
                                const {created_at} = v.data;
                                return created_at.getYear() === yr && created_at.getYear() === mon - 1;
                            };

                            let y = assets_list.filter(filter).length;
                            assets_pie.push({x, y});
                            assets_line.push({x, y});

                            y = incidents_list.filter(filter).length;
                            incidents_pie.push({x, y});
                            incidents_line.push({x, y});

                            y = sites_list.filter(filter).length;
                            sites_pie.push({x, y});
                            sites_line.push({x, y});

                            return null;
                        };
                    }.bind(n));
                }

                await Promise.all(actions.map(f => f()));

                function create_pie_chart(title, title_axis_y, title_axis_x, y_value_format_string, data_points) {
                    return {
                        zoomEnabled: true,
                        animationEnabled: true,
                        exportEnabled: true,
                        theme: "light2",
                        //          title: {text: title},
                        axisY: {title: title_axis_y},
                        toolTip: {
                            shared: true
                        },
                        legend: {
                            maxWidth: 400,
                            itemWidth: 80
                        },
                        data: [{
                                type: "pie",
                                showInLegend: true,
                                legendText: "{indexLabel}",
                                yValueFormatString: y_value_format_string,
                                toolTipContent: "{y} - #percent %",
                                dataPoints: data_points
                            }]
                    };
                }

                function create_line_chart(title, title_axis_y, title_axis_x, y_value_format_string, data_points) {
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
                            intervalType: "month",
                            valueFormatString: "MMM"
                        },
                        toolTip: {
                            shared: true
                        },
                        data: [{
                                type: "line",
                                xValueFormatString: "MMM YYYY",
                                yValueFormatString: y_value_format_string,
                                toolTipContent: "{x}: {y}",
                                dataPoints: data_points
                            }]
                    };
                }

                let pie_charts = {
                    assets: create_pie_chart("ASSETS SUMMARY (" + yr + ")", "No. Of Assets", "Month (" + yr + ")", "###0 Assets", assets_pie),
                    incidents: create_pie_chart("INCIDENTS SUMMARY (" + yr + ")", "No. Of Incidents", "Month (" + yr + ")", "###0 Incidents", incidents_pie),
                    sites: create_pie_chart("SITES SUMMARY (" + yr + ")", "No. Of Sites", "Month (" + yr + ")", "###0 Sites", sites_pie)
                };
                let line_charts = {
                    assets: create_line_chart("ASSETS SUMMARY (" + yr + ")", "No. Of Assets", "Month (" + yr + ")", "###0 Assets", assets_line),
                    incidents: create_line_chart("INCIDENTS SUMMARY (" + yr + ")", "No. Of Incidents", "Month (" + yr + ")", "###0 Incidents", incidents_line),
                    sites: create_line_chart("SITES SUMMARY (" + yr + ")", "No. Of Sites", "Month (" + yr + ")", "###0 Sites", sites_line)
                };
                res.charts = {
                    pie_charts,
                    line_charts
                };

                return res;
            });
        }
    }

    new Controller(events, db);
})();