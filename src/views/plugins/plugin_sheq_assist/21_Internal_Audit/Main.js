import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./Main.lazy.css";

import APage from "views/APage";
import DashboardTab from './DashboardTab';
import AuditTab from './AuditTab';
import ConstructionAuditsTab from './ConstructionAuditsTab.js';

import Tabs from 'components/tabs/Tabs';

@observer
class Main extends APage {
    static key = '_21_Internal_Audit';
    static title = 'Internal Audit';
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
        return (<div key="_21_Internal_Audit-page" id="_21_Internal_Audit-page" className={this.classNames}>
            <div key="pageTitle" className="page-title">
                {this.renderBackBtn()}
                <h3 key="title">Audits</h3>
            </div>
            <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                <DashboardTab ref="dashboard" title="Dashboard"/>
                {!isEmployee && <AuditTab ref="audit" title="Audits" path={this.path}/>}
                {!isEmployee && <ConstructionAuditsTab ref="constructionAudits" title="Construction Audits" path={this.path}/>}
            </Tabs>
        </div>);
    }
}

export default Main;
