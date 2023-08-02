import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import APage from "../../../APage";

import Tabs from '../../../../components/tabs/Tabs';

import ContractorsTab from './ContractorsTab.js';

import DashboardMainTab from './DashboardMainTab.js';
import DashboardSingleContractorTab from './DashboardSingleContractorTab.js';
import TemplatesTab from './TemplatesTab.js';
import LibraryTab from './LibraryTab.js';
import ActiveTab from './ActiveTab.js';
import CompleteTab from './CompleteTab.js';

import style from "./Main.lazy.css";

@observer
class Main extends APage {
    static key = 'Contractors';

    path = "plugin_sheq_assist/contractors/";
    pageKey = "Contractors";

    @observable
    state = {index: 0, isLoaded: false};

    constructor(props) {
        super(props);
        
        this.onOpenContractorsTab = this.onOpenContractorsTab.bind(this);
    }

    componentWillMount() {
        super.componentWillMount();
        style.use();
        this.state.index = 0;
    }

    componentDidMount() {
        super.componentDidMount();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        style.unuse();
    }
    
    update() {
        const {contractors} = this.refs;
        const {root} = contractors.refs;
        root.refs.body.onLoadList();
    }
    
    onOpenContractorsTab() {
        setTimeout(() => {
            this.state.index = 1;
        });
    }

    render() {
        const {isContractor, isContractorView} = storage.is;
        const {permissionKey} = this.props;
        const showContractors = (!isContractor && !isContractorView);
        return (<div key={this.pageKey + "-page"} id={this.pageKey + "-page"} className={this.classNames}>
            <div key="pageTitle" className="page-title">
                {this.renderBackBtn()}
                <h3 key="title">{showContractors ? "Contractors" : "Questionnaires"}</h3>
            </div>
            {showContractors && <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                <DashboardMainTab ref="dashboard" title="Dashboard" path={this.path}/>
                <ContractorsTab ref="contractors" permissionKey={permissionKey} title="Contractors" path={this.path}/>
                <TemplatesTab ref="templates" title="Templates" path={this.path}/>
                <LibraryTab ref="library" title="Master Questionnaires" onOpenContractorsTab={this.onOpenContractorsTab} path={this.path}/>
            </Tabs>}
            {!showContractors && <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                <DashboardSingleContractorTab ref="dashboard" title="Dashboard" path={this.path}/>
                {!isContractor && <TemplatesTab ref="templates" title="Templates" path={this.path}/>}
                {!isContractor && <LibraryTab ref="library" title="Master Questionnaires" path={this.path}/>}
                <ActiveTab ref="active" title="Active" path={this.path}/>
                <CompleteTab ref="complete" title="Complete" path={this.path}/>
            </Tabs>}
        </div>);
    }
}

export default Main;
