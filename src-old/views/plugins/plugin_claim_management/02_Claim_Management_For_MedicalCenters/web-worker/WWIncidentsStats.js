export default() => {
    self.on("plugin_sheq_assist/17_Incident_Investigation/stats", function (ack) {
        let res = {};

		let yr = new Date().getFullYear();
		
		let nearmiss_pie = [];
		let first_aid_pie = [];
		let minor_injuries_pie = [];
		let serious_injuries_pie = [];
		let environmental_impacts_pie = [];
		
		let nearmiss_line = [];
		let first_aid_line = [];
		let minor_injuries_line = [];
		let serious_injuries_line = [];
		let environmental_impacts_line = [];
		
		let nearmiss_bar = [];
		let first_aid_bar = [];
		let minor_injuries_bar = [];
		let serious_injuries_bar = [];
		let environmental_impacts_bar = [];
	
        for (var n = 1; n <= 12; n++) {
			let y = Math.random();
			nearmiss_pie.push({x: yr + "-0" + n, y: y * 100.0});
			nearmiss_line.push({x: yr + "-0" + n, y: y * 100.0});
			nearmiss_bar.push({x: yr + "-0" + n, y: y * 100.0});
			y = Math.random();
			first_aid_pie.push({x: yr + "-0" + n, y: y * 100.0});
			first_aid_line.push({x: yr + "-0" + n, y: y * 100.0});
			first_aid_bar.push({x: yr + "-0" + n, y: y * 100.0});
			y = Math.random();
			minor_injuries_pie.push({x: yr + "-0" + n, y: y * 100.0});
			minor_injuries_line.push({x: yr + "-0" + n, y: y * 100.0});
			minor_injuries_bar.push({x: yr + "-0" + n, y: y * 100.0});
			y = Math.random();
			serious_injuries_pie.push({x: yr + "-0" + n, y: y * 100.0});
			serious_injuries_line.push({x: yr + "-0" + n, y: y * 100.0});
			serious_injuries_bar.push({x: yr + "-0" + n, y: y * 100.0});
			y = Math.random();
			environmental_impacts_pie.push({x: yr + "-0" + n, y: y * 100.0});
			environmental_impacts_line.push({x: yr + "-0" + n, y: y * 100.0});
			environmental_impacts_bar.push({x: yr + "-0" + n, y: y * 100.0});
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
		
		function create_bar_chart(title, title_axis_y, title_axis_x, y_value_format_string, data_points) {
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
					type: "bar",
					xValueFormatString: "MMM YYYY",
					yValueFormatString: y_value_format_string,
					toolTipContent: "{label}: {y}",
					dataPoints: data_points
				}]
			};
		}
		
		let pie_charts = {
			nearmiss: create_pie_chart("NEARMISSES SUMMARY (" + yr + ")", "No. Of Nearmisses", "Month (" + yr + ")", "###0 Nearmisses", nearmiss_pie),
			first_aid: create_pie_chart("FIRST AIDS SUMMARY (" + yr + ")", "No. Of First Aids", "Month (" + yr + ")", "###0 First Aid", first_aid_pie),
			minor_injuries: create_pie_chart("MINOR INJURIES SUMMARY (" + yr + ")", "No. Of Minor Injuries", "Month (" + yr + ")", "###0 Minor Injuries", minor_injuries_pie),
			serious_injuries: create_pie_chart("SERIOUS INJURIES SUMMARY (" + yr + ")", "No. Of Serious Injuries", "Month (" + yr + ")", "###0 Serious Injuries", serious_injuries_pie),
			environmental_impacts: create_pie_chart("ENVIRONMENTAL IMPACTS SUMMARY (" + yr + ")", "No. Of Environmental Impacts", "Month (" + yr + ")", "###0 Environmental Impacts", environmental_impacts_pie)
		};
		let line_charts = {
			nearmiss: create_line_chart("NEARMISSES SUMMARY (" + yr + ")", "No. Of Nearmisses", "Month (" + yr + ")", "###0 Nearmisses", nearmiss_line),
			first_aid: create_line_chart("FIRST AIDS SUMMARY (" + yr + ")", "No. Of First Aids", "Month (" + yr + ")", "###0 First Aid", first_aid_line),
			minor_injuries: create_line_chart("MINOR INJURIES SUMMARY (" + yr + ")", "No. Of Minor Injuries", "Month (" + yr + ")", "###0 Minor Injuries", minor_injuries_line),
			serious_injuries: create_line_chart("SERIOUS INJURIES SUMMARY (" + yr + ")", "No. Of Serious Injuries", "Month (" + yr + ")", "###0 Serious Injuries", serious_injuries_line),
			environmental_impacts: create_line_chart("ENVIRONMENTAL IMPACTS SUMMARY (" + yr + ")", "No. Of Environmental Impacts", "Month (" + yr + ")", "###0 Environmental Impacts", environmental_impacts_line)
		};
		let bar_charts = {
			nearmiss: create_bar_chart("NEARMISSES SUMMARY (" + yr + ")", "No. Of Nearmisses", "Month (" + yr + ")", "###0 Nearmisses", nearmiss_bar),
			first_aid: create_bar_chart("FIRST AIDS SUMMARY (" + yr + ")", "No. Of First Aids", "Month (" + yr + ")", "###0 First Aid", first_aid_bar),
			minor_injuries: create_bar_chart("MINOR INJURIES SUMMARY (" + yr + ")", "No. Of Minor Injuries", "Month (" + yr + ")", "###0 Minor Injuries", minor_injuries_bar),
			serious_injuries: create_bar_chart("SERIOUS INJURIES SUMMARY (" + yr + ")", "No. Of Serious Injuries", "Month (" + yr + ")", "###0 Serious Injuries", serious_injuries_bar),
			environmental_impacts: create_bar_chart("ENVIRONMENTAL IMPACTS SUMMARY (" + yr + ")", "No. Of Environmental Impacts", "Month (" + yr + ")", "###0 Environmental Impacts", environmental_impacts_bar)
		};
		res["charts"] = {
			pie_charts,
			line_charts,
			bar_charts
		};
		
        ack(res);
    });
};