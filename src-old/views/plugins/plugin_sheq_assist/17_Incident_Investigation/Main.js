import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import APage from "../../../APage";

import DashboardTab from './DashboardTab';
import IncidentsTab from './IncidentsTab.js';
import InvestigationsTab from './InvestigationsTab.js';
import CorrectiveActionsTab from './CorrectiveActionsTab.js';
import ManHoursTab from './ManHoursTab.js';

import Tabs from '../../../../components/tabs/Tabs';

import style from "./Main.lazy.css";

@observer
class Main extends APage {
    static key = '_17_Incident_Investigation';
    static title = 'Incident Investigation';
    static faIconLeft = 'users';

    path = "plugin_sheq_assist/17_Incident_Investigation/";
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
        return (<div key="_17_Incident_Investigation-page" id="_17_Incident_Investigation-page" className={this.classNames}>
            <div key="pageTitle" className="page-title">
                {this.renderBackBtn()}
                <h3 key="title">Incident Investigation</h3>
            </div>
            <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                {!isEmployee && <DashboardTab ref="dashboard" title="Dashboard" path={this.path}/>}
                <IncidentsTab ref="incidents" title="Incidents" path={this.path}/>
                <InvestigationsTab ref="investigations" title="Investigations" path={this.path}/>
                {!isEmployee && <CorrectiveActionsTab ref="correctiveActions" title="Corrective Actions" path={this.path}/>}
                <ManHoursTab ref="manHoursTab" title="Man Hours" path={this.path}/>
            </Tabs>
        </div>);
    }
}

export default Main;
