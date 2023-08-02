import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./Main.lazy.css";

import APage from "views/APage";
import Tabs from 'components/tabs/Tabs';

import DashboardTab from './DashboardTab';

import InventoryProductTab from './InventoryProductTab';
import MSDSTab from './MSDSTab';
import HazchemSheetTab from './HazchemSheetTab';

@observer
class Main extends APage {
    static key = 'Hazardous_Chemical_Substances';
    static title = 'Hazardous Chemical Substances';
    static faIconLeft = 'users';

    path = "plugin_sheq_assist/Hazardous_Chemical_Substances/";
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
        return (<div key="Hazardous_Chemical_Substances-page" id="Hazardous_Chemical_Substances-page" className={this.classNames}>
            <div key="pageTitle" className="page-title">
                {this.renderBackBtn()}
                <h3 key="title">Hazardous Chemical Substances</h3>
            </div>
            <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                <DashboardTab ref="dashboard" title="Dashboard" path={this.path}/>
                <InventoryProductTab ref="inventoryProduct" title="Chemical Inventory" path={this.path}/>
                {/*<InventoryContainerTab ref="inventoryContainer" title="Container Inventory" path={this.path}/>*/}
                <MSDSTab ref="msds" title="Safety Data Sheets" path={this.path}/>
                <HazchemSheetTab ref="hazchemSheet" title="Hazchem Sheets" path={this.path}/>
                {/*<TemplatesTab ref="forms" title="SDS Templates" path={this.path}/>*/}
            </Tabs>
        </div>);
    }
}

export default Main;
