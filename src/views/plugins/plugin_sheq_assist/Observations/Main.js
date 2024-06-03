import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./Main.lazy.css";

import { Button } from "components/inputs";
import { PageTitle } from "components";
import OHSDocListDialog from "views/plugins/plugin_sheq_assist/00_Document_and_Record_Control/OHSDocs";
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
            <PageTitle title="Observations" renderBackBtn={this.renderBackBtn}>
                <Button
                    text="OHS Documents"
                    hoverText="OHS Act, Legal register, etc"
                    className="btn btn-primary pull-right"
                    onClick={this.onViewOHSDocuments}
                />
            </PageTitle>
            <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                <DashboardTab ref="dashboard" title="Dashboard" path={this.path}/>
                <SafetyObservationReportTab ref="safetyObservationReport" title="Safety Observations" path={this.path}/>
            </Tabs>
            <OHSDocListDialog ref="ohsDocListDialog" plugin="plugin_sheq_assist" module=""/>
        </div>);
    }
}

export default Main;
