import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./Main.lazy.css";

import APage from "../../../APage";

import DashboardTab from './DashboardTab.js';
import ScreeningTab from './ScreeningTab.js';
import PositiveTab from './PositiveTab.js';
import VulnerableTab from './VulnerableTab.js';
import ReturnToWorkTab from './ReturnToWorkTab.js';
import DocumentsTab from './DocumentsTab.js';

import Tabs from '../../../../components/tabs/Tabs';

@observer
class Main extends APage {
    static key = 'COVID_Management';
    static title = 'COVID Management';
    static faIconLeft = 'users';

    path = "plugin_sheq_assist/COVID_Management/";
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
        const {permissionKey} = this.props;
        return (<div key="COVID_Management-page" id="COVID_Management-page" className={this.classNames}>
            <div key="pageTitle" className="page-title">
                {this.renderBackBtn()}
                <h3 key="title">COVID Management</h3>
            </div>
            <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                <DashboardTab ref="dashboard" title="Dashboard" path={this.path}/>
                <ScreeningTab ref="screening" title="Screening" path={this.path}/>
                <PositiveTab ref="positive" title="Positive" path={this.path}/>
                <VulnerableTab ref="vulnerable" title="Vulnerable" path={this.path}/>
                <ReturnToWorkTab ref="returnToWork" title="Return To Work" path={this.path}/>
                {/*<VaccineCertificatesTab ref="vaccineCertificates" title="Vaccine Certificates" path={this.path}/>*/}
                <DocumentsTab ref="documents" title="Documents" path={this.path}/>
            </Tabs>
        </div>);
    }
}

export default Main;
