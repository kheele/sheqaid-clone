import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./Main.lazy.css";

import APage from "views/APage";
import DashboardTab from './DashboardTab';
import TemplatesTab from './TemplatesTab';
import InspectionTodayTab from './InspectionTodayTab';
import InspectionUpcomingTab from './InspectionUpcomingTab';
import InspectionsActiveTab from './InspectionsActiveTab';
import InspectionsCompletedTab from './InspectionsCompletedTab';

import Tabs from 'components/tabs/Tabs';
import InspectionUnansweredTab from "./InspectionUnansweredTab";

@observer
class Main extends APage {
    static key = 'Inspections';
    static title = 'Inspections';
    static faIconLeft = 'users';

    @observable
    state = {index: 0, isLoaded: false};

    constructor(props) {
        super(props);

    }

    componentWillMount() {
        super.componentWillMount();
        style.use();
        const {isEmployee} = storage.is;
        if(isEmployee) {
            this.state.index = 1;
        }
    }

    componentDidMount() {
        super.componentDidMount();
        //app.onPageComplete();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        style.unuse();
    }

    render() {
        const {permissionKey} = this.props;
        const {isEmployee} = storage.is;
        return (<div key="Inspections-page" id="Inspections-page" className={this.classNames}>
            <div key="pageTitle" className="page-title">
                {this.renderBackBtn()}
                <h3 key="title">Inspections</h3>
            </div>
            <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                <DashboardTab ref="dashboard" title="Dashboard"/>
                <InspectionTodayTab ref="inspectionTodayTab" title="Today's" path={this.path}/>
                <InspectionsActiveTab ref="inspectionsActiveTab" title="Active" path={this.path}/>
                <InspectionUpcomingTab ref="inspectionUpcomingTab" title="Upcoming" path={this.path}/>
                <InspectionsCompletedTab ref="inspectionsCompletedTab" title="Completed" path={this.path}/>
                <InspectionUnansweredTab ref="inspectionUnansweredTab" title="Unanswered" path={this.path}/>
                {!isEmployee && <TemplatesTab ref="forms" title="Templates" path={this.path}/>}
            </Tabs>
        </div>);
    }
}

export default Main;
