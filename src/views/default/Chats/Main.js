import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import APage from "../../APage";

import GeneralTab from './GeneralTab.js';
import UsersTab from './UsersTab.js';
import SafetyTab from './SafetyTab.js';
import ManagementTab from './ManagementTab.js';
import SeniorManagementTab from './SeniorManagementTab.js';
import ManagementAndSafetyTab from './ManagementAndSafetyTab.js';

import Tabs from '../../../components/tabs/Tabs';

import style from "./Main.lazy.css";

@observer
class Main extends APage {
    static key = 'Chats';
    static title = 'Chats';
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
        return (<div key="Chats-page" id="Chats-page" className={this.classNames}>
            <div key="pageTitle" className="page-title">
                {this.renderBackBtn()}
                <h3 key="title">Chats</h3>
            </div>
            <Tabs key="tabs" ref="mainTabs" index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                <GeneralTab ref="generalTab" title="General"/>
                <UsersTab ref="usersTab" title="Users"/>
                <SafetyTab ref="safetyTab" title="Safety"/>
                <ManagementTab ref="managementTab" title="Management"/>
                <SeniorManagementTab ref="seniorManagementTab" title="Senior Management"/>
                <ManagementAndSafetyTab ref="managementAndSafetyTab" title="Management & Safety"/>
            </Tabs>
        </div>);
    }
}

export default Main;