import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {PageTitle} from "components";
import OHSDocListDialog from "views/plugins/plugin_sheq_assist/00_Document_and_Record_Control/OHSDocs";
import APage from "views/APage";

import DashboardTab from './DashboardTab';
import IncidentsTab from './IncidentsTab';
import InvestigationsTab from './InvestigationsTab';
import CorrectiveActionsTab from './CorrectiveActionsTab';

import Tabs from 'components/tabs/Tabs';

import style from "./Main.lazy.css";
import QuickIncidentsTab from "./QuickIncidentsTab";

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

        this.onDashboardClick = this.onDashboardClick.bind(this);
    }

    componentWillMount() {
        super.componentWillMount();
        style.use();
        const {isEmployee} = storage.is;
        if (isEmployee) {
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

    onDashboardClick(id) {
        const {isEmployee} = storage.is;

        const startIdx = isEmployee ? -1 : 0;

        const {mainTabs} = this.refs;
        switch (id) {
            case 'quick-incidents':
                mainTabs.onChange(startIdx + 1);
                break;
            case 'incidents':
                mainTabs.onChange(startIdx + 2);
                break;
            case 'investigations':
                mainTabs.onChange(startIdx + 3);
                break;
            case 'ncr':
                loggedInApp.refs.mainView.navigate('_18_Nonconformance_Management');
                break;
        }
    }

    render() {
        const {permissionKey} = this.props;
        const {isEmployee} = storage.is;
        return (
            <div key="_17_Incident_Investigation-page" id="_17_Incident_Investigation-page" className={this.classNames}>
                <PageTitle title="Incident Investigation" renderBackBtn={this.renderBackBtn}>
                    {/*<Button*/}
                    {/*    text="OHS Documents"*/}
                    {/*    hoverText="OHS Act, Legal register, etc"*/}
                    {/*    className="btn btn-primary pull-right"*/}
                    {/*    onClick={this.onViewOHSDocuments}*/}
                    {/*/>*/}
                </PageTitle>
                <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index}
                      onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                    {!isEmployee && <DashboardTab ref="dashboard" title="Dashboard" path={this.path}
                                                  onClick={this.onDashboardClick}/>}
                    <QuickIncidentsTab ref="quickIncidents" title="Quick Incidents" path={this.path}/>
                    <IncidentsTab ref="incidents" title="Incidents" path={this.path}/>
                    <InvestigationsTab ref="investigations" title="Investigations" path={this.path}/>
                    {!isEmployee &&
                        <CorrectiveActionsTab ref="correctiveActions" title="Corrective Actions" path={this.path}/>}
                    {/*<ManHoursTab ref="manHoursTab" title="Man Hours" path={this.path}/>*/}
                </Tabs>
                <OHSDocListDialog ref="ohsDocListDialog" plugin="plugin_sheq_assist"
                                  module="_17_Incident_Investigation"/>
            </div>);
    }
}

export default Main;
