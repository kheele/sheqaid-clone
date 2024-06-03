import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./Main.lazy.css";

import { Button } from "components/inputs";
import { PageTitle } from "components";
import OHSDocListDialog from "views/plugins/plugin_sheq_assist/00_Document_and_Record_Control/OHSDocs";
import APage from "views/APage";
import DashboardTab from './DashboardTab';
import TemplatesTab from './TemplatesTab';
// import SafetyFilesTodayTab from './SafetyFilesTodayTab';
import SafetyFilesActiveTab from './SafetyFilesActiveTab';
import SafetyFilesCompletedTab from './SafetyFilesCompletedTab';

import Tabs from 'components/tabs/Tabs';

@observer
class Main extends APage {
    static key = 'SafetyFiles';
    static title = 'Safety Files';
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
    
    get tabs() {
        const {isEmployee} = storage.is;
        const w = $(window).width();
        const list = [];
        if(w > 767) {
            list.push(<DashboardTab ref="dashboard" title="Dashboard"/>);
        }
        list.push(...[
            // <SafetyFilesTodayTab ref="SafetyFilesTodayTab" title="Today's" path={this.path}/>,
            <SafetyFilesActiveTab ref="SafetyFilesActiveTab" title="Active" path={this.path}/>,
            <SafetyFilesCompletedTab ref="SafetyFilesCompletedTab" title="Completed" path={this.path}/>
        ]);
        if(!isEmployee && w > 767) {
            list.push(<TemplatesTab ref="forms" title="Templates" path={this.path}/>);
        }
        
        return list;
    }

    render() {
        const {permissionKey} = this.props;
        return (<div key="SafetyFiles-page" id="SafetyFiles-page" className={this.classNames}>
            <PageTitle title="Safety Files" renderBackBtn={this.renderBackBtn}>
                <Button
                    text="OHS Documents"
                    hoverText="OHS Act, Legal register, etc"
                    className="btn btn-primary pull-right"
                    onClick={this.onViewOHSDocuments}
                />
            </PageTitle>
            <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                {this.tabs}
            </Tabs>
            <OHSDocListDialog ref="ohsDocListDialog" plugin="plugin_sheq_assist" module="SafetyFiles"/>
        </div>);
    }
}

export default Main;
