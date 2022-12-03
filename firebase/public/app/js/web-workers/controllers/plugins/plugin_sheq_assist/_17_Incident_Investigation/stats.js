
(() => {
    self._17_Incident_Investigation_stats = (evt, yr) => {
        console.log('stats', yr)
        return Events.whenLoggedIn(async loggedUser => {
            const cntr = await Events.get('plugin_sheq_assist/17_Incident_Investigation/');
            const list = await cntr.list(evt);

            const nearmiss_list = list.filter(v => v.data.incident === "Near Miss");
            const first_aid_list = list.filter(v => v.data.incident === "First Aid");
            const minor_injuries_list = list.filter(v => v.data.incident === "Minor Injury");
            const serious_injuries_list = list.filter(v => v.data.incident === "Serious Injury");
            const environmental_impacts_list = list.filter(v => v.data.incident === "Environmental Impact");

//            incident: ["Near Miss", "First Aid", "Minor Injury", "Serious Injury", "Environmental Impact", "Crime", "Health", "Indutrial Action", "Accident", "Resource Wastage", "Equipment Failure", "Other"], //

            let nearmiss_pie = [];
            let first_aid_pie = [];
            let minor_injuries_pie = [];
            let serious_injuries_pie = [];
            let environmental_impacts_pie = [];

            let nearmiss_column = [];
            let first_aid_column = [];
            let minor_injuries_column = [];
            let serious_injuries_column = [];
            let environmental_impacts_column = [];

            const actions = [];
            for (var n = 1; n <= 12; n++) {
                actions.push(function () {
                    const mon = this;
                    return async function () {
                        const x = yr + "-" + (mon < 10 ? ('0' + mon) : mon);

                        const filter = v => {
                            const {created_at} = v.data;
                            console.log('created_at', created_at.getFullYear(), yr, created_at.getMonth(), mon - 1)
                            return created_at.getFullYear() === yr && created_at.getMonth() === mon - 1;
                        };

                        let y = nearmiss_list.filter(filter).length;
                        nearmiss_pie.push({x, y});
                        nearmiss_column.push({x, y});

                        y = first_aid_list.filter(filter).length;
                        first_aid_pie.push({x, y});
                        first_aid_column.push({x, y});

                        y = minor_injuries_list.filter(filter).length;
                        minor_injuries_pie.push({x, y});
                        minor_injuries_column.push({x, y});

                        y = serious_injuries_list.filter(filter).length;
                        serious_injuries_pie.push({x, y});
                        serious_injuries_column.push({x, y});

                        y = environmental_impacts_list.filter(filter).length;
                        environmental_impacts_pie.push({x, y});
                        environmental_impacts_column.push({x, y});

                        return null;
                    };
                }.bind(n));
            }

            await Promise.all(actions.map(f => f()).map(f => f()));

//            console.log(first_aid_pie, first_aid_column)

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
//                        showInLegend: true,
                            legendText: "{indexLabel}",
                            yValueFormatString: y_value_format_string,
                            toolTipContent: "{y} - #percent%",
                            dataPoints: data_points
                        }]
                };
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

            let pie_charts = {
                nearmiss: create_pie_chart("NEARMISSES SUMMARY (" + yr + ")", "No. Of Nearmisses", "Month (" + yr + ")", "###0 Nearmisses", nearmiss_pie),
                first_aid: create_pie_chart("FIRST AIDS SUMMARY (" + yr + ")", "No. Of First Aids", "Month (" + yr + ")", "###0 First Aids", first_aid_pie),
                minor_injuries: create_pie_chart("MINOR INJURIES SUMMARY (" + yr + ")", "No. Of Minor Injuries", "Month (" + yr + ")", "###0 Minor Injuries", minor_injuries_pie),
                serious_injuries: create_pie_chart("SERIOUS INJURIES SUMMARY (" + yr + ")", "No. Of Serious Injuries", "Month (" + yr + ")", "###0 Serious Injuries", serious_injuries_pie),
                environmental_impacts: create_pie_chart("ENVIRONMENTAL IMPACTS SUMMARY (" + yr + ")", "No. Of Environmental Impacts", "Month (" + yr + ")", "###0 Environmental Impacts", environmental_impacts_pie)
            };
            let column_charts = {
                nearmiss: create_column_chart("NEARMISSES SUMMARY (" + yr + ")", "No. Of Nearmisses", "Month (" + yr + ")", "###0 Nearmisses", nearmiss_column),
                first_aid: create_column_chart("FIRST AIDS SUMMARY (" + yr + ")", "No. Of First Aids", "Month (" + yr + ")", "###0 First Aids", first_aid_column),
                minor_injuries: create_column_chart("MINOR INJURIES SUMMARY (" + yr + ")", "No. Of Minor Injuries", "Month (" + yr + ")", "###0 Minor Injuries", minor_injuries_column),
                serious_injuries: create_column_chart("SERIOUS INJURIES SUMMARY (" + yr + ")", "No. Of Serious Injuries", "Month (" + yr + ")", "###0 Serious Injuries", serious_injuries_column),
                environmental_impacts: create_column_chart("ENVIRONMENTAL IMPACTS SUMMARY (" + yr + ")", "No. Of Environmental Impacts", "Month (" + yr + ")", "###0 Environmental Impacts", environmental_impacts_column)
            };
            const res = {
                charts: {
                    pie_charts,
                    column_charts
                }
            };

//            console.log('stats', JSON.stringify(res))

            return res;
        });
    };
})();