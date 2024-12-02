import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {PageTitle} from "components";
import OHSDocListDialog from "./OHSDocs";
import Tabs from "components/tabs/Tabs";
import DashboardTab from "./DashboardTab";
import ProjectPlanTab from "./ProjectPlanTab";
import IMSPolicyTab from "./IMSPolicyTab";
import DocumentsTab from "./DocumentsTab";
import RecordControlTab from "./RecordControlTab";
import APage from "views/APage";
import style from "./Main.lazy.css";

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
                <ProjectPlanTab ref="projectPlanTab" title="Project Plans"/>
                <IMSPolicyTab ref="imsPolicyTab" title="IMS Policies"/>
                <DocumentsTab ref="documentsTab" title="Company Documents"/>
                <RecordControlTab ref="recordControlTab" title="Record & Document Control"/>
            </Tabs>
            <OHSDocListDialog ref="ohsDocListDialog"/>
        </div>);
    }
}

export default Main;
