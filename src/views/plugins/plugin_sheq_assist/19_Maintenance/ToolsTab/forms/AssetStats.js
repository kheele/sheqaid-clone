//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable, observable} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import Form from "utils/Form";
import {Dates, execWhen} from 'utils/Utils';

import {ClearableInput} from 'components/inputs';
import {Chart} from 'components/FormComponents';

import {
    createMaintenancePlanStats,
    createMonitoringPlanFuelUsageStats,
    createMonitoringPlanWorkingHrsOrKmStats
} from '../../utils/AssetCharts';
import VerticalBarChart from "../../../../../../containers/Charts/BarCharts/VerticalBarChart";
import MDBox from "../../../../../../components/MD/MDBox";
//</editor-fold>

//<editor-fold desc="MonitoringPlanStats">
@observer
class MonitoringPlanStats extends React.Component {

    @observable
    state = {
        lists: {
            views: ['Annually', 'Monthly', 'Weekly'].map(text => ({text, value: text, checked: false})),
            date_years: Array.range(2000, new Date().getFullYear()).reverse(),
            date_months: [...Dates.monthsNum.keys()]
        },
        units: null,
        chart: null,
        view: 'Monthly',//[Annually, Monthly, Weekly]
        date_y: null,
        date_m: null,
        dataLoaded: false
    };

    constructor(props) {
        super(props);

        const {defaultValue, item: asset} = this.props;
        if (asset) {
            const {asset_type} = asset.data.asset_detail;
            const units = ['Vehicles', 'Small Plant'].contains(asset_type) ? 'Distance' : 'Time';
            this.state.units = units;
        }

        this.form = new Form();
        this.form.addChangeOne('view', this.onViewChange.bind(this));
        this.form.addChangeOne('date_y', this.onDateYChange.bind(this));
        this.form.addChangeOne('date_m', this.onDateMChange.bind(this));
    }

    componentWillMount() {
        const date = new Date();
        this.state.date_y = date.getFullYear();
        this.state.date_m = date.getMonth();
    }

    componentDidMount() {
        this.load();
    }

    componentWillUpdate() {
        this.load();
    }

    onViewChange(el, val) {
        this.state.view = val;
        this.load();
    }

    onDateYChange(el, val) {
        this.state.date_y = val;
        this.load();
    }

    onDateMChange(el, val) {
        this.state.date_m = val;
        this.load();
    }

    async load() {
        const {name} = this.props;
        const {list} = this;
        if (list.isEmpty()) return;

        const fns = {
            //id, working_hrs_or_km_opening, working_hrs_or_km_closing, working_hrs_or_km, date
            working_distance_or_time_list: createMonitoringPlanWorkingHrsOrKmStats,
            //id, refilled_fuel, current_hrs_or_km, working_hrs_or_km, date, receipt, cost
            fuel_usage_list: createMonitoringPlanFuelUsageStats
        };

        const {units, view, date_y, date_m} = this.state;

        const date = new Date();
        if(date_y) {
            date.setUTCFullYear(date_y);
        }
        if(date_m) {
            date.setMonth(Dates.getMonthsNum(date_m));
        }

        const fn = fns[name];
        const chart = fn({[name]: list, units, view, date});
        this.update(chart);
    }

    update(chart) {
        this.state.chart = chart;
        this.state.dataLoaded = true;
    }

    setUnits(units) {
        this.state.units = units;
        this.load();
    }

    @computed get list() {
        const {name, item: asset, state} = this.props;
        if(asset) {
            const {
                data: {
                    monitoring_plan_list,
                }
            } = asset;
            const [monitoring_plan_item] = monitoring_plan_list || [];
            const {
                // id,
                // fuel_usage_list,
                // working_distance_or_time_list,
                [name]: list,
            } = monitoring_plan_item || {};
            // console.log('MonitoringPlanStats monitoring_plan_list', name, monitoring_plan_item, (list || []).slice());
            return list || [];
        } else {
            return (state[`monitoring_plan_${name}`] || []).filter(v => !!v);
        }
    }

    render() {
        const {name} = this.props;
        const {units} = this.state;
        const {
            list,
            state, state: {date_y, date_m, chart, dataLoaded}
        } = this;
        if (!chart || list.isEmpty()) {
            return null;
        }
        const title = name === 'working_distance_or_time_list' ? (units || 'Time/Distance') : 'Fuel';
        return <div className="Statistics -margin-l-10">
            <label className="text-center w-full bg-eee color-888 padding-10 -margin-t-10">
                Working {title} Usage Statistics
                <hr className="w-full margin-0 margin-t-10 bg-border-ddd"/>
                <ClearableInput name='view' type="radio" defaultValue='Monthly'
                                className='form-control w-290 margin-t-10 padding-b-0 hor-center'
                                isClearable={false}
                                onChange={this.form.onChange} values={state.lists.views} returnValue/>
                <hr className="w-full margin-0 margin-t-10 bg-border-ddd"/>
                <div className="w-290 hor-center margin-t-15 flex flex-center grid-gap-10">
                    <ClearableInput name='date_y' type="select" placeholder="Year..." defaultValue={date_y}
                                    className='form-control w-90'
                                    isClearable={false}
                                    onChange={this.form.onChange} values={state.lists.date_years} returnValue/>
                    <ClearableInput name='date_m' type="select" placeholder="Month..." defaultValue={date_m}
                                    className='form-control w-90'
                                    isClearable={false}
                                    onChange={this.form.onChange} values={state.lists.date_months} returnValue/>
                </div>
            </label>
            {!dataLoaded && <div className="fixed-center"><CircularProgress/><br/>Loading...</div>}
            {dataLoaded && <div className="content pos-relative h-360">
                <VerticalBarChart
                    height="398px"
                    title="Working Time/Distance & Fuel Usage"
                    color="#fff"
                    tickColor="white"
                    background="#344767"
                    sx={{
                        height: '100%',
                        position: 'absolute',
                        left: 0,
                        top: '-5px',
                        right: 0,
                        bottom: 0,
                        borderRadius: 0,
                    }}
                    displayLegend={true}
                    chart={chart}
                />
            </div>}
        </div>;
    }
}

//</editor-fold>

//<editor-fold desc="MaintenancePlanStats">
@observer
class MaintenancePlanStats extends React.Component {

    @observable
    state = {
        chart: null,
        dataLoaded: false
    };

    componentDidMount() {
        this.load();
    }

    componentWillUpdate() {
        this.load();
    }

    async load() {
        if (this.list.isEmpty()) return;

        const {units} = this.props.selfState;
        const chart = createMaintenancePlanStats(this.list, units);
        this.update(chart);
    }

    update(chart) {
        this.state.chart = chart;
        this.state.dataLoaded = true;
    }

    @computed get list() {
        const {asset, state} = this.props;
        if(asset) {
            const {
                data: {
                    maintenance_plan_list,
                }
            } = asset;
            const [maintenance_plan_item] = maintenance_plan_list || [];
            const {
                // id,
                next_service_hrs_or_km,
                plan_list,//id, reason_for_service, service, service_hrs_or_km, service_date, parts_used, cost_and_receipt
            } = maintenance_plan_item || {};
            return (plan_list || []).filter(v => !!v);
        }

        return (state.list || []).filter(v => !!v);
    }

    render() {
        const {state: {chart, dataLoaded}} = this;
        return !this.list.isEmpty() && <div className="Statistics">
            {!dataLoaded && <div className="fixed-center"><CircularProgress/><br/>Loading...</div>}
            {dataLoaded && <div className="content pos-relative h-360">
                <MDBox
                    className="w-full grid-gap-10"
                    sx={{
                        m: '0 !important', mb: '10px !important', justifyItems: 'center', background: "#fff", padding: "10px 0", borderRadius: "20%",
                    }}
                >
                    <VerticalBarChart
                        height="398px"
                        title="Maintenance Plan Stats"
                        color="#fff"
                        tickColor="white"
                        background="#344767"
                        sx={{
                            height: '100%',
                            position: 'absolute',
                            left: 0,
                            top: '-5px',
                            right: 0,
                            bottom: 0,
                            borderRadius: 0,
                        }}
                        displayLegend={true}
                        chart={chart}
                    />
                </MDBox>
            </div>}
            <hr/>
        </div>;
    }
}

//</editor-fold>

export {
    MonitoringPlanStats, MaintenancePlanStats
};