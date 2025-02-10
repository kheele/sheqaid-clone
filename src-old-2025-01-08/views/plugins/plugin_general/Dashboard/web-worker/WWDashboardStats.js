export default() => {
    self.on("plugin_sheq_assist/dashboard/stats", function (ack) {
        let res = {
			top_counts: {
				events: 30000,
				assets: 50000,
				incidents: 100000,
				sites: 7500
			}
		};

		let yr = new Date().getFullYear();
		
		let assets_pie = [];
		let incidents_pie = [];
		let sites_pie = [];
		
		let assets_line = [];
		let incidents_line = [];
		let sites_line = [];
	
        for (var n = 1; n <= 12; n++) {
            let y = Math.random();
			assets_pie.push({x: yr + "-0" + n, y: y * 100.0});
			assets_line.push({x: yr + "-0" + n, y: y * 100.0});
			y = Math.random();
			incidents_pie.push({x: yr + "-0" + n, y: y * 100.0});
			incidents_line.push({x: yr + "-0" + n, y: y * 100.0});
			y = Math.random();
			sites_pie.push({x: yr + "-0" + n, y: y * 100.0});
			sites_line.push({x: yr + "-0" + n, y: y * 100.0});
        }

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
		res["charts"] = {
			pie_charts,
			line_charts
		};
		
        ack(res);
    });
};