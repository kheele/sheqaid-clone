import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Button} from 'components/inputs';

import style from "./DashboardTab.lazy.css";
import DashboardIncidents from "./DashboardIncidents";
import DashboardInvestigations from "./DashboardInvestigations";
import DashboardCorrectiveActions from "./DashboardCorrectiveActions";
import DashboardManHours from "./DashboardManHours";

//<editor-fold desc="DashboardTab">
@observer
class DashboardTab extends React.Component {
//    path;
    pageKey = "DashboardTab";

    @observable state = {
        value: 'DashboardIncidents'
    };

    constructor(props) {
        super(props);

        this.toggleFilter = this.toggleFilter.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    toggleFilter(evt, btn) {
        const {view} = btn.props;
        this.state.value = view;
    }

    update() {
        const {dashboardIncidents, dashboardInvestigations, dashboardCorrectiveActions, dashboardManHours} = this.refs;
        dashboardIncidents.update();
        // dashboardInvestigations.update();
        // dashboardCorrectiveActions.update();
        // dashboardManHours.update();
    }

    render() {
        const {path, onFilter} = this.props;
        const {state} = this;
        return <div id="DashboardTab" className={"DashboardTab-page"}>
            <div className="page-content grid-1 grid-gap-10 nice-scrollbars">
                <div className="flex w-1000 h-35 hor-center margin-t-10 margin-r-10">
                    <ButtonList state={state} onClick={this.toggleFilter}/>
                </div>
                <DashboardIncidents ref="dashboardIncidents" state={state} path={path + "stats"}/>
                {/*<DashboardInvestigations ref="dashboardInvestigations" state={state} path={path + "investigations/stats"}/>*/}
                {/*<DashboardCorrectiveActions ref="dashboardCorrectiveActions" state={state} path={path + "corrective-actions/stats"}/>*/}
                {/*<DashboardManHours ref="dashboardManHours" state={state} path={path + "man-hours/stats"}/>*/}
            </div>
        </div>;
    }
}
//</editor-fold>

//<editor-fold desc="ButtonList">
@observer
class ButtonList extends React.Component {

    render() {
        const {state: {value}, onClick} = this.props;
        return <React.Fragment>
            <Button className={`btn btn-primary no-border border-radius-0 border-radius-l-20${value !== 'DashboardIncidents' ? ' bg-grey' : ''}`} view='DashboardIncidents' text="Incidents Dashboard" onClick={onClick}/>
            <Button className={`btn btn-primary no-border border-radius-0${value !== 'DashboardInvestigations' ? ' bg-grey' : ''}`} view='DashboardInvestigations' text="Investigations Dashboard" onClick={onClick}/>
            <Button className={`btn btn-primary no-border border-radius-0${value !== 'DashboardCorrectiveActions' ? ' bg-grey' : ''}`} view='DashboardCorrectiveActions' text="Corrective Actions Dashboard" onClick={onClick}/>
            <Button className={`btn btn-primary no-border border-radius-0 border-radius-r-20${value !== 'DashboardManHours' ? ' bg-grey' : ''}`} view='DashboardManHours' text="Man Hours Dashboard" onClick={onClick}/>
        </React.Fragment>;
    }
}
//</editor-fold>

export default DashboardTab;
