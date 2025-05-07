import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {PageTitle} from "components";
import OHSDocListDialog from "./OHSDocs";
import Tabs from "components/tabs/Tabs";
import DashboardTab from "./DashboardTab";
import APage from "views/APage";
import style from "./Main.lazy.css";

import OtherDocsTab from "../../plugin_hr_management/HRDocs/HRDocsDialog/OtherDocsTab";
import ProcedureDocsTab from "../../plugin_hr_management/HRDocs/HRDocsDialog/ProcedureDocsTab";
import PolicyDocsTab from "../../plugin_hr_management/HRDocs/HRDocsDialog/PolicyDocsTab";
import ProjectPlanDocsTab from "../../plugin_hr_management/HRDocs/HRDocsDialog/ProjectPlanDocsTab";
import RecordControlTab from "./RecordControlTab";

@observer
class Main extends APage {
    static key = 'Documents';
    static title = 'Documents';
    static faIconLeft = 'users';

    @observable
    state = {index: 0, isLoaded: false};

    pageKey = "Documents";

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
        return (<div key="Documents-page" id="Documents-page" className={this.classNames}>
            <PageTitle title="Documents" renderBackBtn={this.renderBackBtn}>
                {/*<Button*/}
                {/*    text="OHS Documents"*/}
                {/*    hoverText="OHS Act, Legal register, etc"*/}
                {/*    className="btn btn-primary pull-right"*/}
                {/*    onClick={this.onViewOHSDocuments}*/}
                {/*/>*/}
            </PageTitle>
            <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index}>
                <DashboardTab ref="dashboardTab" title="Dashboard"/>
                <PolicyDocsTab ref="policyDocsTab" title="IMS Policies"/>
                <ProjectPlanDocsTab ref="projectPlanTab" title="Project Plans"/>
                <ProcedureDocsTab ref="procedureDocsTab" title="Procedures"/>
                <OtherDocsTab ref="otherDocsTab" title="Other Documents"/>
                <RecordControlTab ref="recordControlTab" title="Record & Document Control"/>
            </Tabs>
            <OHSDocListDialog ref="ohsDocListDialog"/>
        </div>);
    }
}

export default Main;
