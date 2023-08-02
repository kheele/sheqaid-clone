import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./DashboardTab.lazy.css";
import Card from "@mui/material/Card";
import Stats from "./Stats";
import IntervalButtons from "../../../../../components/Omni/IntervalButtons";
import MKBox from "../../../../../components/MK/MKBox";
import TrainingPlanEmployeesButtons from "../../../../../components/Omni/TrainingPlanEmployeesButtons";
import {execWhen} from "../../../../../utils/UtilsFuns";

//<editor-fold desc="DashboardTab">
@observer
class DashboardTab extends React.Component {
//    path;
    pageKey = "DashboardTab";

    @observable state = {
        value: 'DashboardTrainingMatrix',
        employee_view: 'active',
        interval: 'Month',
    };

    constructor(props) {
        super(props);

//        this.path = props.path + 'reports/';

        this.setEmployees = this.setEmployees.bind(this);
        this.setInterval = this.setInterval.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        this.setEmployees(this.state.employee_view, false);
    }

    // </editor-fold>

    componentWillUnmount() {
        style.unuse();
    }

    //<editor-fold desc="setEmployees">
    async setEmployees(value, load = true) {
        let ref;
        if (this.trainingPlanEmployeesButtonsRef) {
            ref = this.trainingPlanEmployeesButtonsRef;
        } else {
            ref = await execWhen(() => this.trainingPlanEmployeesButtonsRef);
        }

        ref.setView(value);
        this.state.employee_view = value;

        // if (load) {
        //     this.refs.root.load();
        // }
    }

    //</editor-fold>

    //<editor-fold desc="setInterval">
    setInterval(value) {
        const {intervalButtons, stats} = this.refs;
        intervalButtons.setInterval(value);
        stats.setInterval(value);
    }
    //</editor-fold>

    update() {
        const {
            stats
        } = this.refs;
        // stats.update();
    }

    render() {
        const {state: {interval, employee_view}} = this;
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
                    <MKBox width="100%" display="flex" alignItems="center" justifyContent="center" mb={7}>
                        <TrainingPlanEmployeesButtons ref={ref => {
                            this.trainingPlanEmployeesButtonsRef = ref;
                        }} value={employee_view} onChange={this.setEmployees}/>
                        <IntervalButtons ref="intervalButtons" value={interval} onChange={this.setInterval} />
                    </MKBox>
                    <Stats ref="stats" employee_view={employee_view} interval={interval}/>
                </Card>
            </div>
        </div>;
    }
}

//</editor-fold>

export default DashboardTab;
