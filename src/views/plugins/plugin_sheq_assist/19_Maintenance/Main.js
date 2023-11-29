import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./Main.lazy.css";

import APage from "views/APage";

import DashboardTab from './DashboardTab';
import ToolsTab from './ToolsTab';
import ToolsWrittenOffTab from './ToolsTab/ToolsWrittenOffTab';
import MonitoringPlanTab from './MonitoringPlanTab';
import MaintanancePlanTab from './MaintanancePlanTab';
import CalibrationRecordTab from './CalibrationRecordTab';
import DocsTab from './DocsTab';

import Tabs from 'components/tabs/Tabs';
import PartsTab from "./PartsTab";
import JobCardsTab from "./JobCardsTab";

@observer
class Main extends APage {
    static key = '_19_Maintenance';
    static title = 'Maintenance';
    static faIconLeft = 'users';

    path = "plugin_sheq_assist/19_Maintenance/";
    @observable
    state = {index: 0, isLoaded: false};

    constructor(props) {
        super(props);

        this.onFilter = this.onFilter.bind(this);
    }

    componentWillMount() {
        super.componentWillMount();
        style.use();
    }

    componentDidMount() {
        super.componentDidMount();
        //app.onPageComplete();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        style.unuse();
    }

    onFilter(val) {
        const {tools, mainTabs} = this.refs;

        mainTabs.onChange(1);

        setTimeout(() => {
            mainTabs.getTabByRef('tools').onFilter(val);
        }, 100);
    }

    render() {
        const {permissionKey} = this.props;
        return (<div key="_19_Maintenance-page" id="_19_Maintenance-page" className={this.classNames}>
            <div key="pageTitle" className="page-title">
                {this.renderBackBtn()}
                <h3 key="title">Asset Management</h3>
            </div>
            <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index}>
                <DashboardTab ref="dashboard" title="Dashboard" path={this.path} onFilter={this.onFilter}/>
                <ToolsTab ref="tools" title="Assets" path={this.path}/>
                {/*<ToolsTab ref="audit" title="Audits" path={this.path}/>*/}
                {/*<TasksTab ref="task" title="Tasks" path={this.path}/>*/}
                {/*<ToolsTab ref="planner" title="Planner" path={this.path}/>*/}
                {/*<ActionsTab ref="actions" title="Actions" path={this.path}/>*/}
                <ToolsWrittenOffTab ref="toolsWrittenOff" title="Assets Written Off" path={this.path}/>
                {/*<PartsTab ref="parts" title="Parts" path={this.path}/>*/}
                {/*<JobCardsTab ref="jobCards" title="Job Cards" path={this.path}/>*/}
                <MonitoringPlanTab ref="monitoringPlan" title="Monitoring Plan" path={this.path}/>
                <MaintanancePlanTab ref="maintanancePlan" title="Maintanance Plan" path={this.path}/>
                <CalibrationRecordTab ref="calibrationRecord" title="Calibration Record" path={this.path}/>
                <DocsTab ref="docsTab" title="Documents" path={this.path}/>
            </Tabs>
        </div>);
    }
}

export default Main;
