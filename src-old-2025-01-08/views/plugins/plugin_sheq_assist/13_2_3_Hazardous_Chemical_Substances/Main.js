import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./Main.lazy.css";
import {PageTitle} from "components";
import OHSDocListDialog from "views/plugins/plugin_sheq_assist/00_Document_and_Record_Control/OHSDocs";

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
        return (<div key="Hazardous_Chemical_Substances-page" id="Hazardous_Chemical_Substances-page"
                     className={this.classNames}>
            <PageTitle title="Hazardous Chemical Substances" renderBackBtn={this.renderBackBtn}>
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
                <InventoryProductTab ref="inventoryProduct" title="Chemical Inventory" path={this.path}/>
                {/*<InventoryContainerTab ref="inventoryContainer" title="Container Inventory" path={this.path}/>*/}
                <MSDSTab ref="msds" title="Safety Data Sheets" path={this.path}/>
                <HazchemSheetTab ref="hazchemSheet" title="Hazchem Sheets" path={this.path}/>
                {/*<TemplatesTab ref="forms" title="SDS Templates" path={this.path}/>*/}
            </Tabs>
            <OHSDocListDialog ref="ohsDocListDialog" plugin="plugin_sheq_assist"
                              module="_13_2_3_Hazardous_Chemical_Substances"/>
        </div>);
    }
}

export default Main;
