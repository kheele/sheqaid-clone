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
//</editor-fold>

//<editor-fold desc="MonitoringPlanStats">
@observer
class MonitoringPlanStats extends React.Component {

    @observable
    state = {
        lists: {
            views: ['Annually', 'Monthly', 'Weekly'].map(text => ({text, value: text, checked: false})),
            date_years: Array.range(2000, new Date().getFullYear()),
            date_months: [...Dates.monthsStr.values()]
        },
        units: null,
        charts: null,
        view: 'Monthly',//[Annually, Monthly, Weekly]
        date_y: null,
        date_m: null,
        dataLoaded: false
    };

    constructor(props) {
        super(props);

        this.form = new Form();
        this.form.addChangeOne('view', this.onViewChange.bind(this));
        this.form.addChangeOne('date_y', this.onDateYChange.bind(this));
        this.form.addChangeOne('date_m', this.onDateMChange.bind(this));
    }

    componentDidMount() {
        const date = new Date();
        extendObservable(this.state, {date_y: date.getFullYear(), date_m: date.getMonth()});

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
            working_distance_or_time_list: createMonitoringPlanWorkingHrsOrKmStats,
            fuel_usage_list: createMonitoringPlanFuelUsageStats
        };

        const {units, view, date_y, date_m} = this.state;

        const date = new Date();
        date.setUTCFullYear(date_y);
        date.setMonth(date_m);

        const fn = fns[name];
        const charts = fn({[name]: list, units, view, date});
        this.update(charts);
    }

    update(charts) {
        this.state.charts = charts;
        this.state.dataLoaded = true;

        execWhen(() => this.refs.chart).then(ref => {
            ref.options(charts);
        });
    }

    setUnits(units) {
        this.state.units = units;
        this.load();
    }

    @computed get list() {
        const {name} = this.props;
        return (this.props.state[`monitoring_plan_${name}`] || []).filter(v => !!v);
    }

    render() {
        const {name} = this.props;
        const {units} = this.state;
        const {
            list,
            state, state: {date_y, date_m, charts, dataLoaded}
        } = this;
        if (!charts || list.isEmpty()) {
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
            {dataLoaded && <div className="content">
                <Chart ref="chart" options={charts}/>
                <div className="chart-hider"/>
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
        charts: null,
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
        const charts = createMaintenancePlanStats(this.list, units);
        this.update(charts);
    }

    update(charts) {
        this.state.charts = charts;
        this.state.dataLoaded = true;

        execWhen(() => this.refs.chart).then(ref => {
            ref.options(charts);
        });
    }

    @computed get list() {
        return this.props.state.list.filter(v => !!v);
    }

    render() {
        const {state: {charts, dataLoaded}} = this;
        return !this.list.isEmpty() && <div className="Statistics">
            <hr/>
            <label>Statistics</label>
            {!dataLoaded && <div className="fixed-center"><CircularProgress/><br/>Loading...</div>}
            {dataLoaded && <div className="content">
                <Chart ref="chart" options={charts}/>
                <div className="chart-hider"/>
            </div>}
            <hr/>
        </div>;
    }
}

//</editor-fold>

export {
    MonitoringPlanStats, MaintenancePlanStats
};