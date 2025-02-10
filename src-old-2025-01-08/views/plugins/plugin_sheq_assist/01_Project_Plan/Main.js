import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./Main.lazy.css";

import APage from "views/APage";

import ProjectPlanTab from './ProjectPlanTab.js';
import DocumentsTab from './DocumentsTab.js';

import Tabs from 'components/tabs/Tabs';

@observer
class Main extends APage {
    static key = '_01_Project_Plan';
    static title = 'Project_Plan';
    static faIconLeft = 'users';

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
        return (<div key="_01_Project_Plan-page" id="_01_Project_Plan-page" className={this.classNames}>
            <div key="pageTitle" className="page-title">
                {this.renderBackBtn()}
                <h3 key="title">Project Plan</h3>
            </div>
            <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index}>
                <ProjectPlanTab ref="projectPlan" title="Project Plan"/>
                <DocumentsTab ref="documents" title="Company Documents"/>
            </Tabs>
        </div>);
    }
}

export default Main;
