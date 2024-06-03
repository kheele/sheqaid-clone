import React from "react";
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import APage from "views/APage";

import Tabs from 'components/tabs/Tabs';

import ContractorsTab from './ContractorsTab';

import DashboardMainTab from './DashboardMainTab';
import DashboardSingleContractorTab from './DashboardSingleContractorTab';
import TemplatesTab from './TemplatesTab';
import LibraryTab from './LibraryTab';
import ActiveTab from './ActiveTab';
import CompleteTab from './CompleteTab';
import UnansweredTab from './UnansweredTab';

import style from "./Main.lazy.css";
import { Button } from "components/inputs";
import { PageTitle } from "components";
import OHSDocListDialog from "views/plugins/plugin_sheq_assist/00_Document_and_Record_Control/OHSDocs";
import { Permissions } from "utils/Utils";
import EditClientDialog from "../../plugin_general/Clients/EditDialog";

@observer
class Main extends APage {
    static key = 'Contractors';

    path = "plugin_sheq_assist/contractors/";
    pageKey = "Contractors";

    @observable
    state = { index: 0, isLoaded: false };

    constructor(props) {
        super(props);

        this.onPostChange = this.onPostChange.bind(this);
        this.onRegisterAsContractor = this.onRegisterAsContractor.bind(this);
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

    onRegisterAsContractor() {
        const { selectedClient } = storage.selected;

        if (Permissions.allowEditOther("Clients")) {
            this.refs.editClientDialog.extraProp('index', 3).open(selectedClient);
        } else {
            infoDialog.open("Permission denied");
        }
    }

    onPostChange(index) {
        const { isContractor, isContractorView } = storage.is;
        const showContractors = (!isContractor && !isContractorView);
        if (!showContractors) return;

        const { registerAsContractorBtn } = this.refs;
        const node = registerAsContractorBtn.getDOMNode();
        if (index === 0) {
            node.style.marginRight = "0";
        } else {
            node.style.marginRight = "190px";
        }
    }

    update() {
        const { contractors } = this.refs;
        const { root } = contractors.refs;
        root.refs.body.onLoadList();
    }

    onOpenContractorsTab() {
        setTimeout(() => {
            this.state.index = 1;
        });
    }

    render() {
        const { isContractor, isContractorView } = storage.is;
        const { permissionKey } = this.props;
        const showContractors = (!isContractor && !isContractorView);
        return (<div key={this.pageKey + "-page"} id={this.pageKey + "-page"} className={this.classNames}>
            <PageTitle title={showContractors ? "Contractors" : "Questionnaires"} renderBackBtn={this.renderBackBtn}>
                {showContractors && <Button
                    ref="registerAsContractorBtn"
                    text="Register As Contractor"
                    hoverText="Used to link this company as a contractor of other companies when required."
                    className="btn btn-primary pull-right"
                    onClick={this.onRegisterAsContractor}
                />}
                <Button
                    text="OHS Documents"
                    hoverText="OHS Act, Legal register, etc"
                    className="btn btn-primary pull-right"
                    onClick={this.onViewOHSDocuments}
                />
            </PageTitle>
            {showContractors && <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                <DashboardMainTab ref="dashboard" title="Dashboard" path={this.path} />
                <ContractorsTab ref="contractors" permissionKey={permissionKey} title="Contractors" path={this.path} />
                <TemplatesTab ref="templates" title="Templates" path={this.path} />
                <LibraryTab ref="library" title="Master Questionnaires" onOpenContractorsTab={this.onOpenContractorsTab} path={this.path} />
            </Tabs>}
            {!showContractors && <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                <DashboardSingleContractorTab ref="dashboard" title="Dashboard" path={this.path} />
                {!isContractor && <TemplatesTab ref="templates" title="Templates" path={this.path} />}
                {!isContractor && <LibraryTab ref="library" title="Master Questionnaires" path={this.path} />}
                <UnansweredTab ref="unanswered" title="Unanswered" path={this.path} />
                <ActiveTab ref="active" title="Active" path={this.path} />
                <CompleteTab ref="complete" title="Complete" path={this.path} />
            </Tabs>}
            <EditClientDialog ref="editClientDialog" />
            <OHSDocListDialog ref="ohsDocListDialog" plugin="plugin_extra" module="__B_Contractors"/>
        </div>);
    }
}

export default Main;
