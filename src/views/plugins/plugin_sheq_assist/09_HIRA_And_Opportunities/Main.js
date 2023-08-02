import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./Main.lazy.css";

import APage from "views/APage";
import Tabs from 'components/tabs/Tabs';

import BaselineRiskAssessmentTab from './BaselineRiskAssessmentTab';
import TaskBaseRiskAssessmentTab from './TaskBaseRiskAssessmentTab';
import SOPTab from './SOPTab';
import SWPTab from './SWPTab';

@observer
class Main extends APage {
    static key = '_09_HIRA_And_Opportunities';
    static title = 'HIRA & Opportunities';
    static faIconLeft = 'users';

    path = "plugin_sheq_assist/09_HIRA_And_Opportunities/";
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
        return (<div key="_09_HIRA_And_Opportunities-page" id="_09_HIRA_And_Opportunities-page" className={this.classNames}>
            <div key="pageTitle" className="page-title">
                {this.renderBackBtn()}
                <h3 key="title">HIRA & Opportunities</h3>
            </div>
            <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                <BaselineRiskAssessmentTab ref="baselineRiskAssessment" title="Baseline Risk Assessment" path={this.path}/>
                <TaskBaseRiskAssessmentTab ref="taskBaseRiskAssessment" title="Task-Based Risk Assessment" path={this.path}/>
                <SOPTab ref="sop" title="Safe Operating Procedure" path={this.path}/>
                <SWPTab ref="swp" title="Written Safe Work Procedure" path={this.path}/>
            </Tabs>
        </div>);
    }
}

export default Main;
