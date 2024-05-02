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
    
    get tabs() {
        const {isEmployee} = storage.is;
        const w = $(window).width();
        const list = [];
        if(w > 767) {
            list.push(<DashboardTab ref="dashboard" title="Dashboard"/>);
        }
        list.push(...[
            <InspectionTodayTab ref="inspectionTodayTab" title="Today's" path={this.path}/>,
            <InspectionsActiveTab ref="inspectionsActiveTab" title="Active" path={this.path}/>,
            <InspectionUpcomingTab ref="inspectionUpcomingTab" title="Upcoming" path={this.path}/>,
            <InspectionsCompletedTab ref="inspectionsCompletedTab" title="Completed" path={this.path}/>
        ]);
        if(w > 767) {
            list.push(<InspectionUnansweredTab ref="inspectionUnansweredTab" title="Unanswered" path={this.path}/>);
        }
        if(!isEmployee && w > 767) {
            list.push(<TemplatesTab ref="forms" title="Templates" path={this.path}/>);
        }
        
        return list;
    }

    render() {
        const {permissionKey} = this.props;
        return (<div key="Inspections-page" id="Inspections-page" className={this.classNames}>
            <div key="pageTitle" className="page-title">
                {this.renderBackBtn()}
                <h3 key="title">Inspections</h3>
            </div>
            <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                {this.tabs}
            </Tabs>
        </div>);
    }
}

export default Main;
