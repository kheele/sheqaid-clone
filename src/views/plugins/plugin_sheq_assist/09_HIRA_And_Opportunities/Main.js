import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./Main.lazy.css";

import { Button } from "components/inputs";
import { PageTitle } from "components";
import OHSDocListDialog from "views/plugins/plugin_sheq_assist/00_Document_and_Record_Control/OHSDocs";

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
            <PageTitle title="HIRA & Opportunities" renderBackBtn={this.renderBackBtn}>
                <Button
                    text="OHS Documents"
                    hoverText="OHS Act, Legal register, etc"
                    className="btn btn-primary pull-right"
                    onClick={this.onViewOHSDocuments}
                />
            </PageTitle>
            <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                <BaselineRiskAssessmentTab ref="baselineRiskAssessment" title="Baseline Risk Assessment" path={this.path}/>
                <TaskBaseRiskAssessmentTab ref="taskBaseRiskAssessment" title="Task-Based Risk Assessment" path={this.path}/>
                <SOPTab ref="sop" title="Safe Operating Procedure" path={this.path}/>
                <SWPTab ref="swp" title="Written Safe Work Procedure" path={this.path}/>
            </Tabs>
            <OHSDocListDialog ref="ohsDocListDialog" plugin="plugin_sheq_assist" module="_09_HIRA_And_Opportunities"/>
        </div>);
    }
}

export default Main;
