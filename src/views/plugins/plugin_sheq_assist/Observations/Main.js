import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./Main.lazy.css";

import APage from "views/APage";

import DashboardTab from './DashboardTab';
import SafetyObservationReportTab from './SafetyObservationReportTab.js';

import Tabs from 'components/tabs/Tabs';

@observer
class Main extends APage {
    static key = '_21_Internal_Audit';
    static title = 'Internal Audit';
    static faIconLeft = 'users';

    path = "plugin_sheq_assist/21_Internal_Audit/";
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
        return (<div key="_21_Internal_Audit-page" id="_21_Internal_Audit-page" className={this.classNames}>
            <div key="pageTitle" className="page-title">
                {this.renderBackBtn()}
                <h3 key="title">Observations</h3>
            </div>
            <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                <DashboardTab ref="dashboard" title="Dashboard" path={this.path}/>
                <SafetyObservationReportTab ref="safetyObservationReport" title="Safety Observations" path={this.path}/>
            </Tabs>
        </div>);
    }
}

export default Main;
