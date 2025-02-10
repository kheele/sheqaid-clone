import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./Main.lazy.css";

import APage from "views/APage";

import EmergencyNumbersTab from './EmergencyNumbersTab.js';
import EmergencyProcedureTab from './EmergencyProcedureTab.js';
import EmergencyRollCallTab from './EmergencyRollCallTab.js';
import EmergencyDrillTab from './EmergencyDrillTab.js';
import EvaluationRecordTab from './EvaluationRecordTab.js';
import NearbyServicesTab from './NearbyServicesTab.js';

import Tabs from 'components/tabs/Tabs';

@observer
class Main extends APage {
    static key = '_16_Emergency_Preparedness';
    static title = 'Emergency Preparedness';
    static faIconLeft = 'users';

    path = "plugin_sheq_assist/16_Emergency_Preparedness/";
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
        const {
            props: {permissionKey, type}
        } = this;
        
        let title;
        if(!type) {
            title = 'Emergency Preparedness';
        } else if(type === 'Contacts') {
            title = 'Contacts';
        }
        
        const tabs = [
            <EmergencyNumbersTab ref="emergencyNumbers" title="Emergency Numbers" path={this.path}/>
        ];
        if(title !== 'Contacts') {
            tabs.push(...[
                <EmergencyProcedureTab ref="emergencyProcedure" title="Emergency Procedure" path={this.path}/>,
                <EmergencyRollCallTab ref="emergencyRollCall" title="Emergency Roll Call" path={this.path}/>,
                <EmergencyDrillTab ref="emergencyDrill" title="Emergency Drill" path={this.path}/>,
                <EvaluationRecordTab ref="evaluationRecord" title="Evacuation Record" path={this.path}/>
            ]);
        }
        tabs.push(<NearbyServicesTab ref="nearbyServices" title="Nearby Services" path={this.path}/>);
        return (<div key="_16_Emergency_Preparedness-page" id="_16_Emergency_Preparedness-page" className={this.classNames}>
            <div key="pageTitle" className="page-title">
                {this.renderBackBtn()}
                <h3 key="title">{title}</h3>
            </div>
            <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                {tabs}
            </Tabs>
        </div>);
    }
}

//TODO: NearbyServicesTab

export default Main;
