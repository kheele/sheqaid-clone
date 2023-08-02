
class CalculationUtils {
    static getTimeOrDistanceTakenFromLastService(asset) {
        if (!asset)
            return null;
        const {data: {
                //8
                monitoring_plan_list,
                //9
                maintenance_plan
            }
        } = asset;
        const {next_service_hrs_or_km, list = []} = maintenance_plan;
        //list = [service_hrs_or_km, reason_for_service, service_date]
        list.sortBy('service_date');
        const lastService = list.getLastElement() || {};
        const {service_hrs_or_km, reason_for_service, service_date} = lastService;

        //monitoring_plan_list = [fuel_usage, working_hrs_or_km, date]
        monitoring_plan_list.sortBy('date');

        let monitoring_plan_list_with_date = monitoring_plan_list.filter(({date}) => !!date);
        if (service_date) {
            monitoring_plan_list_with_date = monitoring_plan_list_with_date.filter(({date}) => date > service_date);
        }
        const timeOrDistanceTakenFromLastService = monitoring_plan_list_with_date.
                map(({working_hrs_or_km}) => parseInt(working_hrs_or_km)).
                reduce((n1, n2) => n1 + n2, 0);
        return timeOrDistanceTakenFromLastService;
    }

    static getTimeOrDistanceLeftToNextService(asset) {
        if (!asset)
            return null;
        const {data: {
                maintenance_plan
            }
        } = asset;
        const {next_service_hrs_or_km} = maintenance_plan;
        return parseInt(next_service_hrs_or_km) - CalculationUtils.getTimeOrDistanceTakenFromLastService(asset);
    }
}

export default CalculationUtils;