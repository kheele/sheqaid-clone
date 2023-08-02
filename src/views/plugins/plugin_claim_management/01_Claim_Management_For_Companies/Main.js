import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./Main.lazy.css";

import APage from "../../../APage";

import ClaimsEmployeeTab from './ClaimsEmployeeTab.js';
import ClaimsClientTab from './ClaimsClientTab.js';
import ClaimsContractorTab from './ClaimsContractorTab.js';

import COIDServiceProvidersTab from './COIDServiceProvidersTab.js';
import COIDMedicalCentersTab from './COIDMedicalCentersTab.js';

import Tabs from 'components/tabs/Tabs';

@observer
class Main extends APage {
    static key = 'COIDA_Management';
    static title = 'COIDA Management';
    static faIconLeft = 'users';

    path = "plugin_sheq_assist/COIDA_Management/";
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
        const {isEmployee, isUser, isContractor} = storage.is;
        const {permissionKey} = this.props;
        return (<div key="COIDA_Management-page" id="COIDA_Management-page" className={this.classNames}>
            <div key="pageTitle" className="page-title">
                {this.renderBackBtn()}
                <h3 key="title">COIDA Management</h3>
            </div>
            {isEmployee && <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                {/*<DashboardEmployeeTab ref="dashboard" title="Dashboard" path={this.path}/>*/}
                <ClaimsEmployeeTab ref="clientClaims" title="Claims" path={this.path}/>
            </Tabs>}
            {isUser && <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                {/*<DashboardUserTab ref="dashboard" title="Dashboard" path={this.path}/>*/}
                <ClaimsClientTab ref="clientClaims" title="Claims" path={this.path}/>
                <COIDServiceProvidersTab ref="coidServiceProvidersTab" title="COID Providers" path={this.path}/>
                <COIDMedicalCentersTab ref="coidMedicalCentersTab" title="Medical Centers" path={this.path}/>
            </Tabs>}
            {isContractor && <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                {/*<DashboardContractorTab ref="dashboard" title="Dashboard" path={this.path}/>*/}
                <ClaimsContractorTab ref="clientClaims" title="Claims" path={this.path}/>
                <COIDServiceProvidersTab ref="coidServiceProvidersTab" title="COID Providers" path={this.path}/>
                <COIDMedicalCentersTab ref="coidMedicalCentersTab" title="Medical Centers" path={this.path}/>
            </Tabs>}
        </div>);
    }
}

export default Main;
