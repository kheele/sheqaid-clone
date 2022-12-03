import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import APage from "../../../APage";

import SafetyMeetingTab from './SafetyMeetingTab.js';
import KPITab from './KPITab.js';
import ManagementMeetingTab from './ManagementMeetingTab.js';

import Tabs from '../../../../components/tabs/Tabs';

import style from "./Main.lazy.css";

@observer
class Main extends APage {
    static key = '_06_Communication_And_Participation';
    static title = 'Communication & Participation';
    static faIconLeft = 'users';

    path = "plugin_sheq_assist/06_Communication_And_Participation/";
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
            this.state.index = 2;
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
    
    get tabKPI() {
        return <KPITab ref="kpi" title="KPI" path={this.path}/>;
    }
    
    get tabSafetyMeeting() {
        const {isEmployee} = storage.is;
        return !isEmployee && <SafetyMeetingTab ref="safetyMeeting" title="Safety Meeting" path={this.path}/>;
    }
    
    get tabManagementMeeting() {
        const {isEmployee} = storage.is;
        return !isEmployee && <ManagementMeetingTab ref="managementMeeting" title="Management Meeting" path={this.path}/>;
    }

    render() {
        const {
            tabKPI, tabSafetyMeeting, tabManagementMeeting,
            props: {permissionKey, type}
        } = this;
        const {isEmployee} = storage.is;
        
        let title;
        const list = [];
        if(!type) {
            title = 'Communication & Participation';
            list.push(...[tabSafetyMeeting, tabManagementMeeting, tabKPI]);
        } else if(type === 'KPI') {
            title = 'KPI';
            list.push(tabKPI);
        } else if(type === 'Meetings') {
            title = 'Meetings';
            list.push(...[tabSafetyMeeting, tabManagementMeeting]);
        }
        return (<div key="_06_Communication_And_Participation-page" id="_06_Communication_And_Participation-page" className={this.classNames}>
            {type !== 'KPI' && <div key="pageTitle" className="page-title">
                {this.renderBackBtn()}
                <h3 key="title">{title}</h3>
            </div>}
            {type === 'KPI' && list}
            {type !== 'KPI' && <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                {list}
            </Tabs>}
        </div>);
    }
}

//meeting minutes (type)
//date: , time(from, to), agenda, .
//Send minutes to participants(email)
//1. Safety Meeting 
//2. KPI - do it later
//3. Management Meeting

//Meeting Schedule (invitation of people in meeting(email))
export default Main;
