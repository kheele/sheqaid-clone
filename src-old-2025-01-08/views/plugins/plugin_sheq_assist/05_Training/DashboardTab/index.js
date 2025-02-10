import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./DashboardTab.lazy.css";
import Card from "@mui/material/Card";
import Stats from "./Stats";
import IntervalButtons from "components/Omni/IntervalButtons";
import MKBox from "components/MK/MKBox";
import TrainingPlanEmployeesButtons from "components/Omni/TrainingPlanEmployeesButtons";
import {execWhen} from "utils/UtilsFuns";

//<editor-fold desc="DashboardTab">
@observer
class DashboardTab extends React.Component {

    pageKey = "DashboardTab";

    @observable state = {
        value: 'DashboardTrainingMatrix',
        employee_view: 'active',
        interval: 'Month',
        range_start: '- All -',
        range_end: '- All -',
    };

    constructor(props) {
        super(props);

        this.onUpdate = this.onUpdate.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        const {employee_view, interval, range_start, range_end} = this.state;
        this.onUpdate({employee_view, interval, range_start, range_end});
    }

    // </editor-fold>

    componentWillUnmount() {
        style.unuse();
    }

    //<editor-fold desc="setEmployees">
    onUpdate({employee_view, interval, range_start, range_end}) {
        employee_view && (this.state.employee_view = employee_view);
        interval && (this.state.interval = interval);
        range_start && (this.state.range_start = range_start);
        range_end && (this.state.range_end = range_end);

        execWhen(() => this.refs.viewButtonsRefBox).then(ref => {
            const {employee_view, interval, range_start, range_end} = this.state;
            ref.update({employee_view, interval, range_start, range_end});

            this.update();
        });
    }

    //</editor-fold>

    update() {
        const {employee_view, interval, range_start, range_end} = this.state;
        execWhen(() => this.refs.stats).then(ref => {
            ref.update({employee_view, interval, range_start, range_end});
        });
    }

    render() {
        return <div id="DashboardTab" className={"DashboardTab-page"}>
            <div className="page-content grid-1 grid-gap-10 nice-scrollbars">
                <Card sx={{
                    background: "#fff",
                    mt: '10px',
                    p: '20px',
                    position: 'absolute',
                    bottom: '10px',
                    left: 0,
                    right: 0,
                    top: 0,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                }}>
                    <ViewByButtonsBox
                        ref="viewButtonsRefBox"
                        onUpdate={this.onUpdate}
                    />
                    <Stats ref="stats"/>
                </Card>
            </div>
        </div>;
    }
}

//</editor-fold>

// <editor-fold defaultstate="collapsed" desc="ViewByButtonsBox">
@observer
class ViewByButtonsBox extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.setEmployees = this.setEmployees.bind(this);
        this.setInterval = this.setInterval.bind(this);
        this.setRangeStart = this.setRangeStart.bind(this);
        this.setRangeEnd = this.setRangeEnd.bind(this);
        this.update = this.update.bind(this);
    }
    // </editor-fold>

    setEmployees(employee_view) {
        const {onUpdate} = this.props;
        onUpdate({employee_view});
    }

    setInterval(interval) {
        const {onUpdate} = this.props;
        onUpdate({interval});
    }

    setRangeStart(range_start) {
        const {onUpdate} = this.props;
        onUpdate({range_start});
    }

    setRangeEnd(range_end) {
        const {onUpdate} = this.props;
        onUpdate({range_end});
    }

    update({employee_view, interval, range_start, range_end}) {
        if(employee_view) {
            execWhen(() => this.viewButtonsRef).then(ref => {
                ref.setView(employee_view);
            });
        }
        if(interval) {
            execWhen(() => this.refs.intervalButtons).then(ref => {
                ref.setInterval(interval);
            });
        }
        if(range_start) {
            execWhen(() => this.refs.intervalButtons).then(ref => {
                ref.setRangeStart(range_start);
            });
        }
        if(range_end) {
            execWhen(() => this.refs.intervalButtons).then(ref => {
                ref.setRangeEnd(range_end);
            });
        }
    }

    render() {
        return (
            <MKBox width="100%" display="flex" alignItems="flex-start" justifyContent="center" mb="15px" pb="70px"
                sx={{
                    minHeight: '130px !important',
                    border: "1px dotted #ddd !important",
                    background: "#fafafa !important",
                    paddingTop: "20px !important",
                    borderRadius: "8px !important",
                    boxShadow: "0 0 3px #ccc !important",
                }}
            >
                <TrainingPlanEmployeesButtons ref={ref => {
                    this.viewButtonsRef = ref;
                }} onChange={this.setEmployees}/>
                <IntervalButtons
                    ref="intervalButtons"
                    onChange={this.setInterval}
                    setMonthRangeStart={this.setRangeStart}
                    setMonthRangeEnd={this.setRangeEnd}
                    setQuarterRangeStart={this.setRangeStart}
                    setQuarterRangeEnd={this.setRangeEnd}
                    setBiannualRangeStart={this.setRangeStart}
                    setBiannualRangeEnd={this.setRangeEnd}
                    setAnnualRangeStart={this.setRangeStart}
                    setAnnualRangeEnd={this.setRangeEnd}
                />
            </MKBox>
        );
    }
}
// </editor-fold>

export default DashboardTab;
