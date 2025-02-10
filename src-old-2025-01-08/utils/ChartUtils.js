
//<editor-fold desc="createChartImpl">
function createChartImpl(title, title_axis_y, extraProps, data) {
    return {
        zoomEnabled: true,
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2",
        //title: {text: title},
        axisY: {title: title_axis_y},
        toolTip: {shared: true},
        data: data,
        ...extraProps};
}
//</editor-fold>

//<editor-fold desc="createLineChart">
function createLineChart(title, title_axis_y, title_axis_x, y_value_format_string, data_points) {
    return createChartImpl(title, title_axis_y, {
        axisX: {title: title_axis_x, interval: 1, /*intervalType: "month",*/ valueFormatString: "MMM"}
    }, [{
            type: "line",
            xValueFormatString: "MMM YYYY",
            yValueFormatString: y_value_format_string,
            toolTipContent: "{x}: {y}",
            dataPoints: data_points
        }]);
}
//</editor-fold>

//<editor-fold desc="createLineChartMulti">
function createLineChartMulti(title, title_axis_y, title_axis_x, y_value_format_string, data_points_list, onClick) {
    const data = data_points_list.map(({name, dataPoints}) => {
        return {
            type: "line",
            showInLegend: true,
            name,
            dataPoints
        };
    });
    return createChartImpl(title, title_axis_y, {
        axisX: {
            title: title_axis_x,
            valueFormatString: "MMM"
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "bottom",
            horizontalAlign: "center",
            dockInsidePlotArea: false,
            itemclick: onClick
        }
    }, data);
}
//</editor-fold>

//<editor-fold desc="createColumnChart">
function createColumnChart({title, title_axis_y, title_axis_x, y_value_format_string, indexLabel, interval = 1, intervalType = "month", valueFormatString = 'MMM', data_points}) {
    return createChartImpl(title, title_axis_y, {
        axisX: {title: title_axis_x, interval, intervalType, valueFormatString}
    }, [{
            type: "column",
//      showInLegend: true,
            xValueFormatString: "{label}",
            yValueFormatString: y_value_format_string,
            toolTipContent: "{y}",
            indexLabel: "{y}",
            indexLabelPlacement: "outside",
            indexLabelOrientation: "vertical",
            dataPoints: data_points
        }]);
}
//</editor-fold>

//<editor-fold desc="createColumnChart2">
function createColumnChart2({title, title_axis_y, title_axis_x, y_value_format_string, indexLabel, interval = 1, intervalType = "month", valueFormatString = 'MMM', data_points}) {
    return createChartImpl(title, title_axis_y, {
        axisX: {title: title_axis_x, interval, intervalType, valueFormatString}
    }, [{
        type: "column",
        showInLegend: true,
        legendText: "{legendText}",
        xValueFormatString: "{label}",
        yValueFormatString: y_value_format_string[0],
        toolTipContent: "{label} ({legendText}): {y}",
        indexLabel: "{y}",
        indexLabelPlacement: "outside",
        indexLabelOrientation: "vertical",
        dataPoints: data_points[0]
    }, {
        type: "column",
        showInLegend: true,
        legendText: "{legendText}",
        xValueFormatString: "{label}",
        yValueFormatString: y_value_format_string[1],
        toolTipContent: "{label} ({legendText}): {y}",
        indexLabel: "{y}",
        indexLabelPlacement: "outside",
        indexLabelOrientation: "vertical",
        dataPoints: data_points[1]
    }]);
}
//</editor-fold>

//<editor-fold desc="createColumnChart3">
function createColumnChart3(title, title_axis_y, title_axis_x, y_value_format_string, data_points) {
    return createChartImpl(title, title_axis_y, {
        axisX: {title: title_axis_x, interval: 1, /*intervalType: "month",*/ valueFormatString: "MMM"}
    }, [{
        type: "column",
        showInLegend: true,
        legendText: "{legendText}",
        xValueFormatString: "{label}",
        yValueFormatString: y_value_format_string[0],
        toolTipContent: "{label} ({legendText}): {y}",
        indexLabel: "{y}",
        indexLabelPlacement: "outside",
        indexLabelOrientation: "vertical",
        dataPoints: data_points[0]
    }, {
        type: "column",
        showInLegend: true,
        legendText: "{legendText}",
        xValueFormatString: "{label}",
        yValueFormatString: y_value_format_string[1],
        toolTipContent: "{label} ({legendText}): {y}",
        indexLabel: "{y}",
        indexLabelPlacement: "outside",
        indexLabelOrientation: "vertical",
        dataPoints: data_points[1]
    }, {
        type: "column",
        showInLegend: true,
        legendText: "{legendText}",
        xValueFormatString: "{label}",
        yValueFormatString: y_value_format_string[1],
        toolTipContent: "{label} ({legendText}): {y}",
        indexLabel: "{y}",
        indexLabelPlacement: "outside",
        indexLabelOrientation: "vertical",
        dataPoints: data_points[2]
    }]);
}
//</editor-fold>

//<editor-fold desc="createColumnLineChart4">
function createColumnLineChart4(title, title_axis_y, title_axis_x, y_value_format_string, data_points) {
    return createChartImpl(title, title_axis_y, {
        axisX: {title: title_axis_x, interval: 1, /*intervalType: "month",*/ valueFormatString: "MMM"}
    }, [{
            type: "column",
            showInLegend: true,
            legendText: "{legendText}",
            xValueFormatString: "{label}",
            yValueFormatString: y_value_format_string[0],
            toolTipContent: "{y}",
            indexLabel: "{y}",
            indexLabelPlacement: "outside",
            indexLabelOrientation: "vertical",
            dataPoints: data_points[0]
        }, {
            type: "column",
            showInLegend: true,
            legendText: "{legendText}",
            xValueFormatString: "{label}",
            yValueFormatString: y_value_format_string[1],
            toolTipContent: "{y}",
            indexLabel: "{y}",
            indexLabelPlacement: "outside",
            indexLabelOrientation: "vertical",
            dataPoints: data_points[1]
        }, {
            type: "line",
            xValueFormatString: "MMM YYYY",
            yValueFormatString: y_value_format_string[0],
            toolTipContent: "{x}: {y}",
            dataPoints: data_points[2]
        }, {
            type: "line",
            xValueFormatString: "MMM YYYY",
            yValueFormatString: y_value_format_string[1],
            toolTipContent: "{x}: {y}",
            dataPoints: data_points[3]
        }]);
}
//</editor-fold>

//<editor-fold desc="createPieChart">
function createPieChart(title, title_axis_y, y_value_format_string, data_points, extraProps = {}) {
    return createChartImpl(title, title_axis_y, {
        legend: {maxWidth: 400, itemWidth: 80},
        ...extraProps
    }, [{
            type: "pie",
            showInLegend: true,
            legendText: "{indexLabel}",
            yValueFormatString: y_value_format_string,
            toolTipContent: "{y} - #percent %",
            dataPoints: data_points
        }]);
}
//</editor-fold>

//<editor-fold desc="createDoughnutChart">
function createDoughnutChart(title, title_axis_y, y_value_format_string, data_points, extraProps = {}) {
    return createChartImpl(title, title_axis_y, {
        legend: {maxWidth: 400, itemWidth: 80},
        ...extraProps
    }, [{
            type: "doughnut",
            showInLegend: true,
            legendText: "{indexLabel}",
            yValueFormatString: y_value_format_string,
            toolTipContent: "{y} - #percent %",
            dataPoints: data_points
        }]);
}
//</editor-fold>

//<editor-fold desc="createScatterChartMulti">
function createScatterChartMulti(title, title_axis_y, title_axis_x, y_value_format_string, data_points_list, onClick) {
    const data = data_points_list.map(({name, dataPoints}) => {
        return {
            type: "scatter",
            showInLegend: true,
            name,
            dataPoints
        };
    });
    return createChartImpl(title, title_axis_y, {
        axisX: {
            title: title_axis_x,
//            valueFormatString: "MMM",
            intervalType: "month"
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "bottom",
            horizontalAlign: "center",
            dockInsidePlotArea: false,
            itemclick: onClick
        }
    }, data);
}
//</editor-fold>

//<editor-fold desc="createScatterChartMulti">
function createAreaChartMulti(title, title_axis_y, title_axis_x, y_value_format_string, data_points_list, onClick) {
    const data = data_points_list.map(({name, dataPoints}) => {
        return {
            type: "area",
            showInLegend: true,
            name,
            dataPoints
        };
    });
    return createChartImpl(title, title_axis_y, {
        axisX: {
            title: title_axis_x,
//            valueFormatString: "MMM",
            intervalType: "month"
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "bottom",
            horizontalAlign: "center",
            dockInsidePlotArea: false,
            itemclick: onClick
        }
    }, data);
}
//</editor-fold>

export {createLineChart, createLineChartMulti, createColumnChart, createColumnChart2, createColumnChart3, createColumnLineChart4, createPieChart, createDoughnutChart, createScatterChartMulti, createAreaChartMulti};