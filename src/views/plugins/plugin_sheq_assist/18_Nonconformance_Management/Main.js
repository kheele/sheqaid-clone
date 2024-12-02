import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./Main.lazy.css";
import {PageTitle} from "components";
import OHSDocListDialog from "views/plugins/plugin_sheq_assist/00_Document_and_Record_Control/OHSDocs";
import APage from "views/APage";

import DashboardTab from './DashboardTab';
import NCRTab from './NCRTab';

import Tabs from 'components/tabs/Tabs';

@observer
class Main extends APage {
    static key = '_18_Nonconformance_Management';
    static title = 'Non-Conformance Reports';
    static faIconLeft = 'users';

    path = "plugin_sheq_assist/ncr/";
    @observable
    state = {index: 0, isLoaded: false};

    constructor(props) {
        super(props);

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

    render() {
        const {permissionKey} = this.props;
        const {isEmployee} = storage.is;
        return (<div key="_21_Internal_Audit-page" id="_21_Internal_Audit-page" className={this.classNames}>
            <PageTitle title="Non-Conformance Reports" renderBackBtn={this.renderBackBtn}>
                {/*<Button*/}
                {/*    text="OHS Documents"*/}
                {/*    hoverText="OHS Act, Legal register, etc"*/}
                {/*    className="btn btn-primary pull-right"*/}
                {/*    onClick={this.onViewOHSDocuments}*/}
                {/*/>*/}
            </PageTitle>
            <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index}
                  onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                <DashboardTab ref="dashboard" title="Dashboard" path={this.path}/>
                <NCRTab ref="ncr" title="Non-Conformances" path={this.path}/>
            </Tabs>
            <OHSDocListDialog ref="ohsDocListDialog" plugin="plugin_sheq_assist"
                              module="_18_Nonconformance_Management"/>
        </div>);
    }
}

export default Main;
