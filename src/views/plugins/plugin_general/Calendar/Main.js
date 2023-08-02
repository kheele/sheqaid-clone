import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Permissions} from 'utils/Utils';

import APage from "../../../APage";

import TabExpiredDocs from './TabExpiredDocs.js';
import TabExpiredEmployeeDocs from './TabExpiredEmployeeDocs.js';
import TabExpiredSharedDocs from './TabExpiredSharedDocs.js';
import TabMeetings from './TabMeetings.js';
import TabTasks from './TabTasks.js';
import TabAppointments from './TabAppointments.js';
import TabCOVID from './TabCOVID.js';

import Tabs from 'components/tabs/Tabs';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import style from "./Main.lazy.css";

@observer
class Main extends APage {
    static key = 'Calendar';
    static title = 'Calendar';
    static faIconLeft = 'users';

    path = "plugin_sheq_assist/calendar/";
    @observable
    state = {index: 0, isLoaded: false};

    constructor(props) {
        super(props);

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

    render() {
        const {isEmployee, isContractor, isContractorView} = storage.is;
        const {permissions_modules} = storage.loggedUser.user.data;
        const permEmployees = (permissions_modules || []).find(v => v.key === "Employees");
        
        const tabs = [];
        
        if(isEmployee || isContractorView || Permissions.allow(permEmployees)) {
            tabs.push(...[
                <TabExpiredEmployeeDocs ref="tabExpiredEmployeeDocs" title="Employees Documents" path={this.path}/>,
                <TabCOVID ref="tabCOVID" title="COVID Management" path={this.path}/>
            ]);
        }
        if(!isContractor) {
            tabs.insertAt(0, <TabExpiredDocs ref="tabExpiredDocs" title="Company Documents" path={this.path}/>);
            tabs.insertAt(2, <TabExpiredSharedDocs ref="tabExpiredSharedDocs" title="Shared Documents" path={this.path}/>);
            
            tabs.push(...[
                <TabMeetings ref="tabMeetings" title="Meetings" path={this.path}/>,
                <TabTasks ref="tabTasks" title="Tasks" path={this.path}/>,
                <TabAppointments ref="tabAppointments" title="Appointments" path={this.path}/>
            ]);
        }
        return (<div key="Calendar-page" id="Calendar-page" className={this.classNames}>
            <div key="pageTitle" className="page-title">
                {this.renderBackBtn()}
                <h3 key="title">Calendar</h3>
            </div>
            <Tabs key="tabs" ref="mainTabs" index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                {tabs}
            </Tabs>
        </div>);
    }
}

export default Main;
