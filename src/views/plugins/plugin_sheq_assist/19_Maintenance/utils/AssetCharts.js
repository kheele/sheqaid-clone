//<editor-fold desc="imports">
import {Dates} from '../../../../../utils/Utils';
import {createColumnChart, createColumnChart2} from '../../../../../utils/ChartUtils';

const unitsShort = {
    Time: "hrs", Distance: "km"
};
//</editor-fold>

//<editor-fold desc="createMonitoringPlanWorkingHrsOrKmStats">
const createMonitoringPlanWorkingHrsOrKmStats = ({working_distance_or_time_list, units, view = 'Annually', date = new Date()}) => {
    if (!working_distance_or_time_list || working_distance_or_time_list.isEmpty())
        return;

    const unitsS = unitsShort[units] || 'hrs/km';

    let data_points;

    const currY = date.getFullYear();
    let currM, currMStr;
    let currW, currWStr;

    working_distance_or_time_list = working_distance_or_time_list.filter(v => !!v).filter(({date}) => date && Dates.parse(date).getFullYear() === currY);

    const isAnnualView = view === 'Annually';
    const isMonthView = view === 'Monthly';
    const isWeekView = view === 'Weekly';
    if(isAnnualView) {
        data_points = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => {
            const list = working_distance_or_time_list.filter(({date}) => Dates.parse(date).getMonth() === month);
            const sum = list.map(({working_hrs_or_km}) => parseInt(working_hrs_or_km)).reduce((n1, n2) => n1 + n2, 0);
            const label = Dates.monthsStr.get(month);
            return {label, y: sum, legendText: units + "(" + unitsS + ")"};
        });
    } else if (isWeekView) {
        currM = date.getMonth();
        currW = date.getWeekNumberOfMonth();
        currMStr = Dates.monthsStr.get(currM);

        working_distance_or_time_list = working_distance_or_time_list.filter(({date}) => Dates.parse(date).getMonth() === currM);

        data_points = date.getWeeksOfMonthInMonth().map(n => {
            const list = working_distance_or_time_list.filter(({date}) => Dates.parse(date).getWeekNumberOfMonth() === n);
            const sum = list.map(({working_hrs_or_km}) => parseInt(working_hrs_or_km)).reduce((n1, n2) => n1 + n2, 0);
            const label = `Week ${n}`;
            return {label, y: sum, legendText: units + "(" + unitsS + ")"};
        });
    } else {
        currM = date.getMonth();
        currMStr = Dates.monthsStr.get(currM);

        working_distance_or_time_list = working_distance_or_time_list.filter(({date}) => Dates.parse(date).getMonth() === currM);
        const firstMonDate = date.toMonthStartDate().getDate();
        const lastMonDate = date.toMonthEndDate().getDate();

        data_points = Array.range(firstMonDate, lastMonDate).map(n => {
            const list = working_distance_or_time_list.filter(({date}) => Dates.parse(date).getDate() === n);
            const sum = list.map(({working_hrs_or_km}) => parseInt(working_hrs_or_km)).reduce((n1, n2) => n1 + n2, 0);
            const label = Dates.daysDoubleNumStr.get(n);
            return {label, y: sum, legendText: units + "(" + unitsS + ")"};
        });
    }

    const title = `Monitoring Plan Summary (${isAnnualView ? currY : currMStr})`;
    const title_axis_y = `${units || 'Time/Distance'} Usage`;
    const title_axis_x = isAnnualView ? `Month (${currY})` : isWeekView ? `Week (${currMStr}-${currY})` : `Date (${currMStr}-${currY})`;
    const y_value_format_string = `###0${unitsS}`;
    const valueFormatString = isAnnualView ? 'MMM' : null;
    const intervalType = isAnnualView ? 'month' : null;
    const charts = createColumnChart({
        title,
        title_axis_y,
        title_axis_x,
        y_value_format_string,
        valueFormatString,
        intervalType,
        data_points
    });

    return charts;
};
//</editor-fold>

//<editor-fold desc="createMonitoringPlanFuelUsageStats">
const createMonitoringPlanFuelUsageStats = ({fuel_usage_list, units, view = 'Annually', date = new Date()}) => {
    if (!fuel_usage_list || fuel_usage_list.isEmpty())
        return;

    const unitsS = unitsShort[units] || 'hrs/km';

    let data_points_1, data_points_2;

    const currY = date.getFullYear();
    let currM, currMStr;
    let currW, currWStr;

    fuel_usage_list = fuel_usage_list.filter(v => !!v).filter(({date}) => date && Dates.parse(date).getFullYear() === currY);

    const isAnnualView = view === 'Annually';
    const isMonthView = view === 'Monthly';
    const isWeekView = view === 'Weekly';
    if(isAnnualView) {
        data_points_1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => {
            const list = fuel_usage_list.filter(({date}) => Dates.parse(date).getMonth() === month);
            const sum = list.map(({refilled_fuel}) => parseInt(refilled_fuel)).reduce((n1, n2) => n1 + n2, 0);
            const label = Dates.monthsStr.get(month);
            return {label, y: sum, legendText: "Refilled Fuel(l)"};
        });
        data_points_2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => {
            const list = fuel_usage_list.filter(({date}) => Dates.parse(date).getMonth() === month);
            const sum = list.map(({working_hrs_or_km}) => parseInt(working_hrs_or_km)).reduce((n1, n2) => n1 + n2, 0);
            const label = Dates.monthsStr.get(month);
            return {label, y: sum, legendText: "Used " + units + "(" + unitsS + ")"};
        });
    } else if (isWeekView) {
        currM = date.getMonth();
        currW = date.getWeekNumberOfMonth();
        currMStr = Dates.monthsStr.get(currM);

        fuel_usage_list = fuel_usage_list.filter(({date}) => Dates.parse(date).getMonth() === currM);

        data_points_1 = date.getWeeksOfMonthInMonth().map(n => {
            const list = fuel_usage_list.filter(({date}) => Dates.parse(date).getWeekNumberOfMonth() === n);
            const sum = list.map(({refilled_fuel}) => parseInt(refilled_fuel)).reduce((n1, n2) => n1 + n2, 0);
            const label = `Week ${n}`;
            return {label, y: sum, legendText: "Refilled Fuel(l)"};
        });
        data_points_2 = date.getWeeksOfMonthInMonth().map(n => {
            const list = fuel_usage_list.filter(({date}) => Dates.parse(date).getWeekNumberOfMonth() === n);
            const sum = list.map(({working_hrs_or_km}) => parseInt(working_hrs_or_km)).reduce((n1, n2) => n1 + n2, 0);
            const label = `Week ${n}`;
            return {label, y: sum, legendText: "Used " + units + "(" + unitsS + ")"};
        });
    } else {
        currM = date.getMonth();
        currMStr = Dates.monthsStr.get(currM);

        fuel_usage_list = fuel_usage_list.filter(({date}) => Dates.parse(date).getMonth() === currM);
        const firstMonDate = date.toMonthStartDate().getDate();
        const lastMonDate = date.toMonthEndDate().getDate();

        data_points_1 = Array.range(firstMonDate, lastMonDate).map(n => {
            const list = fuel_usage_list.filter(({date}) => Dates.parse(date).getDate() === n);
            const sum = list.map(({refilled_fuel}) => parseInt(refilled_fuel)).reduce((n1, n2) => n1 + n2, 0);
            const label = Dates.daysDoubleNumStr.get(n);
            return {label, y: sum, legendText: "Refilled Fuel(l)"};
        });
        data_points_2 = Array.range(firstMonDate, lastMonDate).map(n => {
            const list = fuel_usage_list.filter(({date}) => Dates.parse(date).getDate() === n);
            const sum = list.map(({working_hrs_or_km}) => parseInt(working_hrs_or_km)).reduce((n1, n2) => n1 + n2, 0);
            const label = Dates.daysDoubleNumStr.get(n);
            return {label, y: sum, legendText: "Used " + units + "(" + unitsS + ")"};
        });
    }

    const title = `Monitoring Plan Summary (${isAnnualView ? currY : currMStr})`;
    const title_axis_y = `Fuel & ${units || 'Time/Distance'} Usage`;
    const title_axis_x = isAnnualView ? `Month (${currY})` : isWeekView ? `Week (${currMStr}-${currY})` : `Date (${currMStr}-${currY})`;
    const y_value_format_string = ["###0l", `###0${unitsS}`];
    const valueFormatString = isAnnualView ? 'MMM' : null;
    const intervalType = isAnnualView ? 'month' : null;
    const charts = createColumnChart2({
        title,
        title_axis_y,
        title_axis_x,
        y_value_format_string,
        valueFormatString,
        intervalType,
        data_points: [data_points_1, data_points_2]
    });

    // console.log('createColumnChart3', charts);
    return charts;
};
//</editor-fold>

//<editor-fold desc="createMaintenancePlanStats">
const createMaintenancePlanStats = (__list, units) => {
    if (!__list || __list.isEmpty())
        return;

    const currY = new Date().getFullYear();
    let list = __list.filter(v => !!v).filter(({service_date}) => service_date && Dates.parse(service_date).getFullYear() === currY);
    let data_points = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => {
        const _list = list.filter(({service_date}) => Dates.parse(service_date).getMonth() === month);
        const sum = _list.map(({service_hrs_or_km}) => parseInt(service_hrs_or_km)).reduce((n1, n2) => n1 + n2, 0);
        const label = Dates.monthsStr.get(month);
        return {label, y: sum};
    });

    const unitsS = unitsShort[units] || 'hrs/km';
    const title = "Maintenance Plan Summary (" + currY + ")";
    const title_axis_y = (units || 'Time/Distance');
    const title_axis_x = "Month (" + currY + ")";
    const y_value_format_string = "###0 " + unitsS;
    const charts = createColumnChart({title, title_axis_y, title_axis_x, y_value_format_string, data_points});

    return charts;
};
//</editor-fold>

export {
    createMonitoringPlanWorkingHrsOrKmStats,
    createMonitoringPlanFuelUsageStats,
    createMaintenancePlanStats
};