import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./Main.lazy.css";

import APage from "views/APage";
import PollutionRegisterTab from './PollutionRegisterTab.js';
import IncidentsTab from './IncidentsTab.js';
import EnviroRATab from './EnviroRATab.js';
import ChecklistTab from './ChecklistTab.js';
import QAPTab from './QAPTab.js';
import EMPTab from './EMPTab.js';
import NCRTab from './NCRTab.js';

import Tabs from 'components/tabs/Tabs';

@observer
class Main extends APage {
    static key = '_08_Environmental_Aspects';
    static title = 'Environmental Aspects';
    static faIconLeft = 'users';

    path = "plugin_sheq_assist/08_Environmental_Aspects/";
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
        return (<div key="_08_Environmental_Aspects-page" id="_08_Environmental_Aspects-page" className={this.classNames}>
            <div key="pageTitle" className="page-title">
                {this.renderBackBtn()}
                <h3 key="title">Environmental Aspects</h3>
            </div>
            <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                {/*<ReportsTab ref="reports" title="Reports" path={this.path}/>*/}
                {/*<MatrixTab ref="matrix" title="Matrix" path={this.path}/>*/}
                <PollutionRegisterTab ref="pollutionRegister" title="Pollution Register" path={this.path}/>
                <IncidentsTab ref="incidents" title="Incidents" path={this.path}/>
                <EnviroRATab ref="enviroRA" title="Enviro - Risk Assessment" path={this.path}/>
                <ChecklistTab ref="checklist" title="Checklist" path={this.path}/>
                <QAPTab ref="qap" title="QA Plan" path={this.path}/>
                <EMPTab ref="emp" title="Enviro - Management Plan" path={this.path}/>
                <NCRTab ref="ncr" title="Non-Conformance Report" path={this.path}/>
            </Tabs>
        </div>);
    }
}
//IMPLEMENT LATER
//<MatrixTab ref="matrix" title="Matrix" path={this.path}/>
//left on serve-side
//
//<PollutionRegisterTab ref="pollutionRegister" title="Pollution Register" path={this.path}/>...
//<IncidentsTab ref="incidents" title="Incidents" path={this.path}/>...
//  -> <CauseAnalysisDialog />...
//  -> <RemedialActionPlanDialog />...
//<EnviroRATab ref="enviroRA" title="Enviro - Risk Assessment" path={this.path}/>...
//<ChecklistTab ref="checklist" title="Checklist" path={this.path}/>...
//<QAPTab ref="qap" title="QA Plan" path={this.path}/>...
//<EMPTab ref="emp" title="Enviro - Management Plan" path={this.path}/>...
//<NCRTab ref="ncr" title="Non-Conformance Report" path={this.path}/>...
export default Main;
