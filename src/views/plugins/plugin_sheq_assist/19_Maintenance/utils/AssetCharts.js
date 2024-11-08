//<editor-fold desc="imports">
import {Dates} from 'utils/Utils';

const unitsShort = {
    Time: "hrs", Distance: "km"
};
//</editor-fold>

//<editor-fold desc="createMonitoringPlanWorkingHrsOrKmStats">
const createMonitoringPlanWorkingHrsOrKmStats = (
    {
        list,
        units,
        view = 'Annually',
        date = new Date()
    }
) => {
    if (!list || list.isEmpty())
        return;

    console.log('createMonitoringPlanWorkingHrsOrKmStats', units, view, date, list.slice());

    //id, working_hrs_or_km_opening, working_hrs_or_km_closing, working_hrs_or_km, date

    const unitsS = unitsShort[units] || 'hrs/km';

    let data_points;

    const currY = date.getFullYear();
    let currM, currMStr;
    let currW, currWStr;

    list = list.filter(v => !!v && !!v.date).map(({date, ...others}) => ({
        ...others,
        date: Dates.parse(date)
    })).filter(({date}) => date.getFullYear() === currY);

    console.log('m', date.getMonth())

    const isAnnualView = view === 'Annually';
    const isMonthView = view === 'Monthly';
    const isWeekView = view === 'Weekly';
    if (isAnnualView) {
        data_points = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => {
            const _list = list.filter(({date}) => date.getMonth() === month);
            const sum = _list.map(({working_hrs_or_km}) => parseInt(working_hrs_or_km)).reduce((n1, n2) => n1 + n2, 0);
            const label = Dates.monthsStr.get(month);
            return {label, y: sum};
        });
    } else if (isWeekView) {
        currM = date.getMonth();
        currW = date.getWeekNumberOfMonth();
        currMStr = Dates.monthsStr.get(currM);

        list = list.filter(({date}) => date.getMonth() === currM);
        console.log('currM', currM, list)

        data_points = date.getWeeksOfMonthInMonth().map(n => {
            const _list = list.filter(({date}) => date.getWeekNumberOfMonth() === n);
            const sum = _list.map(({working_hrs_or_km}) => parseInt(working_hrs_or_km)).reduce((n1, n2) => n1 + n2, 0);
            const label = `Week ${n}`;
            return {label, y: sum};
        });
    } else {
        currM = date.getMonth();
        currMStr = Dates.monthsStr.get(currM);

        list = list.filter(({date}) => date.getMonth() === currM);
        console.log('currM', currM, list)
        const firstMonDate = date.toMonthStartDate().getDate();
        const lastMonDate = date.toMonthEndDate().getDate();

        data_points = Array.range(firstMonDate, lastMonDate).map(n => {
            const _list = list.filter(({date}) => date.getDate() === n);
            const sum = _list.map(({working_hrs_or_km}) => parseInt(working_hrs_or_km)).reduce((n1, n2) => n1 + n2, 0);
            const label = Dates.daysDoubleNumStr.get(n);
            return {label, y: sum};
        });
    }

    return {
        labels: data_points.map(v => v.label),
        datasets: [{
            label: 'Total',
            color: 'white',
            data: data_points.map(v => v.y),
        }],
    };
};
//</editor-fold>

//<editor-fold desc="createMonitoringPlanFuelUsageStats">
const createMonitoringPlanFuelUsageStats = (
    {
        list, units, view = 'Annually', date = new Date()
    }
) => {
    if (!list || list.isEmpty())
        return;

    console.log('createMonitoringPlanFuelUsageStats', units, view, date, list.slice());

    //id, refilled_fuel, current_hrs_or_km, working_hrs_or_km, date, receipt, cost

    let data_points_1, data_points_2;

    const currY = date.getFullYear();
    let currM, currMStr;
    let currW, currWStr;

    list = list.filter(v => v && v.date).map(({date, ...others}) => ({
        ...others,
        date: Dates.parse(date)
    })).filter(({date}) => date.getFullYear() === currY);
    console.log('list', list.slice(), currY);

    const isAnnualView = view === 'Annually';
    const isMonthView = view === 'Monthly';
    const isWeekView = view === 'Weekly';
    if (isAnnualView) {
        //refilled_fuel
        data_points_1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => {
            const _list = list.filter(({date}) => date.getMonth() === month).map(({refilled_fuel}) => parseInt(refilled_fuel));

            const sum = _list.reduce((n1, n2) => n1 + n2, 0);
            const label = Dates.monthsStr.get(month);
            return {label, y: sum};
        });
        //working_hrs_or_km
        data_points_2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => {
            const _list = list.filter(({date}) => date.getMonth() === month).map(({working_hrs_or_km}) => parseInt(working_hrs_or_km));
            const sum = _list.reduce((n1, n2) => n1 + n2, 0);
            const label = Dates.monthsStr.get(month);
            return {label, y: sum};
        });
    } else if (isWeekView) {
        currM = date.getMonth();
        currW = date.getWeekNumberOfMonth();
        currMStr = Dates.monthsStr.get(currM);

        list = list.filter(({date}) => date.getMonth() === currM);

        //refilled_fuel
        data_points_1 = date.getWeeksOfMonthInMonth().map(n => {
            const _list = list.filter(({date}) => date.getWeekNumberOfMonth() === n).map(({refilled_fuel}) => parseInt(refilled_fuel));
            const sum = _list.reduce((n1, n2) => n1 + n2, 0);
            const label = `Week ${n}`;
            return {label, y: sum};
        });
        //working_hrs_or_km
        data_points_2 = date.getWeeksOfMonthInMonth().map(n => {
            const _list = list.filter(({date}) => date.getWeekNumberOfMonth() === n).map(({working_hrs_or_km}) => parseInt(working_hrs_or_km));
            const sum = _list.reduce((n1, n2) => n1 + n2, 0);
            const label = `Week ${n}`;
            return {label, y: sum};
        });
    } else {
        currM = date.getMonth();
        currMStr = Dates.monthsStr.get(currM);

        list = list.filter(({date}) => date.getMonth() === currM);
        const firstMonDate = date.toMonthStartDate().getDate();
        const lastMonDate = date.toMonthEndDate().getDate();

        //refilled_fuel
        data_points_1 = Array.range(firstMonDate, lastMonDate).map(n => {
            const _list = list.filter(({date}) => date.getDate() === n).map(({refilled_fuel}) => parseInt(refilled_fuel));
            const sum = _list.reduce((n1, n2) => n1 + n2, 0);
            const label = Dates.daysDoubleNumStr.get(n);
            return {label, y: sum};
        });
        //working_hrs_or_km
        data_points_2 = Array.range(firstMonDate, lastMonDate).map(n => {
            const _list = list.filter(({date}) => date.getDate() === n).map(({working_hrs_or_km}) => parseInt(working_hrs_or_km));
            const sum = _list.reduce((n1, n2) => n1 + n2, 0);
            const label = Dates.daysDoubleNumStr.get(n);
            return {label, y: sum};
        });
    }

    // console.log('createColumnChart3', charts);
    return {
        labels: data_points_1.map(v => v.label),
        datasets: [{
            label: 'Fuel Usage',
            color: 'white',
            data: data_points_1.map(v => v.y),
        }],
    };
};
//</editor-fold>

//<editor-fold desc="createMaintenancePlanStats">
const createMaintenancePlanStats = (__list, units) => {
    if (!__list || __list.isEmpty())
        return;

    //id, reason_for_service, service, service_hrs_or_km, service_date, parts_used, cost_and_receipt
    console.log('createMaintenancePlanStats', __list.slice());

    const currY = new Date().getFullYear();
    let list = __list.filter(v => !!v && !!v.service_date).map(({service_date, ...others}) => ({
        ...others,
        service_date: Dates.parse(service_date)
    })).filter(({service_date}) => service_date.getFullYear() === currY);
    let data_points = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => {
        const _list = list.filter(({service_date}) => service_date.getMonth() === month);
        const sum = _list.map(({service_hrs_or_km}) => parseInt(service_hrs_or_km)).reduce((n1, n2) => n1 + n2, 0);
        const label = Dates.monthsStr.get(month);
        return {label, y: sum};
    });

    return {
        labels: data_points.map(v => v.label),
        datasets: [{
            label: 'Total',
            color: 'white',
            data: data_points.map(v => v.y),
        }],
    };
};
//</editor-fold>

export {
    createMonitoringPlanWorkingHrsOrKmStats,
    createMonitoringPlanFuelUsageStats,
    createMaintenancePlanStats
};
