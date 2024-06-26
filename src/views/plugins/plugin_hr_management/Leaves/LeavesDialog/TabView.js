import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {execWhen} from "utils/UtilsFuns";
import {Permissions} from "utils/Utils";
import {Tabs} from "components/tabs";

import DashboardTab from "../../AEmployeeDocDialog/ADashboardTab";
import RemovedTab from "../../AEmployeeDocDialog/RemovedTab";

import AwaitingApprovalTab from "./AwaitingApprovalTab";
import ApprovedTab from "./ApprovedTab";
import RejectedTab from "./RejectedTab";

import SignatureDialog from "components/dialogs/SignatureDialog";

// <editor-fold defaultstate="collapsed" desc="TabView">
@observer
class TabView extends React.Component {

    @observable
    state = {index: 0};

    //<editor-fold desc="constructor">
    constructor() {
        super();

        this.onChange = this.onChange.bind(this);

        this.onNewDialog = this.onNewDialog.bind(this);
        this.onSignatures = this.onSignatures.bind(this);
        this.onExport = this.onExport.bind(this);

        this.onViewActiveTab = this.onViewActiveTab.bind(this);
        this.onViewRemovedTab = this.onViewRemovedTab.bind(this);
        this.onViewNoExpiry = this.onViewNoExpiry.bind(this);
        this.onViewExpired = this.onViewExpired.bind(this);
        this.onViewMonExpiry = this.onViewMonExpiry.bind(this);
        this.onView2MonExpiry = this.onView2MonExpiry.bind(this);
        this.onView3MonExpiry = this.onView3MonExpiry.bind(this);
        this.onView4MonExpiry = this.onView4MonExpiry.bind(this);
    }

    //</editor-fold>

    @computed get isAwaitingApproval() {
        return this.status === "Awaiting Approval";
    }

    @computed get isApproved() {
        return this.status === "Approved";
    }

    @computed get isRejected() {
        return this.status === "Rejected";
    }

    // </editor-fold>

    @computed get status() {
        const {mainTabs} = this.refs;
        switch (mainTabs.activeIndex) {
            case 1:
                return 'Awaiting Approval';
            case 2:
                return 'Approved';
            case 3:
                return 'Rejected';
        }
    }

    // </editor-fold>

    onChange(index) {
        const {state} = this;
        state.index = index;
    }

    onNewDialog(evt, elem, item) {
        const {permissionKey} = this.props;
        if (permissionKey) {
            if (Permissions.disallowCreateMod(permissionKey)) {
                return infoDialog.open(<p className='action-prohibited'>The action is prohibited</p>);
            }
        }

        this.refs.newDialog.open().then(item => {
            const {state: {index}, refs: {mainTabs: {refs: {tabContent: {activeTab}}}}} = this;
            if (index === 1) {
                activeTab.onNewItem(item);
            }
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSignatures">
    onSignatures(e, btn) {
        this.refs.signaturesDialog.open();
    }

    // <editor-fold defaultstate="collapsed" desc="onExport">
    onExport(e, btn) {
        this.refs.exportDialog.open();
    }

    // <editor-fold defaultstate="collapsed" desc="onViewActiveTab, onViewRemovedTab">
    onViewActiveTab() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(1);
    }

    onViewRemovedTab() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(4);
    }

    // <editor-fold defaultstate="collapsed" desc="onViewNoExpiry, onViewExpired, onViewMonExpiry, onView2MonExpiry, onView3MonExpiry, onView4MonExpiry">
    onViewNoExpiry() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(1);
        execWhen(() => mainTabs.getTabByRef('employeesActiveTab')).then(ref => {
            ref.setView({expiry_date: null});
        });
    }

    onViewExpired() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(1);
        execWhen(() => mainTabs.getTabByRef('employeesActiveTab')).then(ref => {
            ref.setView({expiry_date: -1});
        });
    }

    // </editor-fold>

    onViewMonExpiry() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(1);
        execWhen(() => mainTabs.getTabByRef('employeesActiveTab')).then(ref => {
            ref.setView({expiry_date: 1});
        });
    }

    onView2MonExpiry() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(1);
        execWhen(() => mainTabs.getTabByRef('employeesActiveTab')).then(ref => {
            ref.setView({expiry_date: 2});
        });
    }

    onView3MonExpiry() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(1);
        execWhen(() => mainTabs.getTabByRef('employeesActiveTab')).then(ref => {
            ref.setView({expiry_date: 3});
        });
    }

    onView4MonExpiry() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(1);
        execWhen(() => mainTabs.getTabByRef('employeesActiveTab')).then(ref => {
            ref.setView({expiry_date: 4});
        });
    }

    //<editor-fold desc="render">
    render() {
        const {
            onUpdate,
            onRemove,
            title,
            titleSingular,
            permissionKey,
            isRemoved,
            NewDialog, ProfileDialog, EditDialog, ExportDialog, module,
            loadDashboard,
            hasSignatures,
            onBuildQuery,
            onChangeViewExpiryDate,
            renderFilterNodeActive, renderFilterNodeRemoved,
            renderTHeadActive, renderTHeadRemoved,
            renderItemActive, renderItemRemoved,
            onViewDialog,
            renderTopActions,
        } = this.props;

        return (<>
            <Tabs
                key="tabs"
                ref="mainTabs"
                permissionKey={permissionKey}
                index={this.state.index}
                onChange={this.onChange}
            >
                <DashboardTab
                    ref="dashboard"
                    title="Dashboard"
                    loadDashboard={loadDashboard}
                    hasSignatures={hasSignatures}

                    onViewActiveTab={this.onViewActiveTab}
                    onViewRemovedTab={this.onViewRemovedTab}

                    onViewNoExpiry={this.onViewNoExpiry}
                    onViewExpired={this.onViewExpired}
                    onViewMonExpiry={this.onViewMonExpiry}
                    onView2MonExpiry={this.onView2MonExpiry}
                    onView3MonExpiry={this.onView3MonExpiry}
                    onView4MonExpiry={this.onView4MonExpiry}

                    renderTopActions={renderTopActions}

                    onViewDialog={onViewDialog}
                    onNewDialog={this.onNewDialog}
                    onSignatures={this.onSignatures}
                    onExport={this.onExport}
                />
                <AwaitingApprovalTab
                    ref="awaitingApprovalTab"
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                    title="Awaiting Approval"
                    titleSingular={titleSingular}
                    titlePlural={title}
                    renderFilterNode={renderFilterNodeActive}
                    renderTHead={renderTHeadActive}
                    renderItem={renderItemActive}
                    onChangeViewExpiryDate={onChangeViewExpiryDate}
                    hasSignatures={hasSignatures}
                    onSignatures={this.onSignatures}
                    onExport={this.onExport}
                    NewDialog={NewDialog}
                    ProfileDialog={ProfileDialog}
                    EditDialog={EditDialog}
                    permissionKey={permissionKey}
                    module={module}
                    onBuildQuery={onBuildQuery}
                />
                <ApprovedTab
                    ref="approvedTab"
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                    title="Approved"
                    titleSingular={titleSingular}
                    titlePlural={title}
                    renderFilterNode={renderFilterNodeActive}
                    renderTHead={renderTHeadActive}
                    renderItem={renderItemActive}
                    onChangeViewExpiryDate={onChangeViewExpiryDate}
                    hasSignatures={hasSignatures}
                    onSignatures={this.onSignatures}
                    onExport={this.onExport}
                    NewDialog={NewDialog}
                    ProfileDialog={ProfileDialog}
                    EditDialog={EditDialog}
                    permissionKey={permissionKey}
                    module={module}
                    onBuildQuery={onBuildQuery}
                />
                <RejectedTab
                    ref="rejectedTab"
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                    title="Rejected"
                    titleSingular={titleSingular}
                    titlePlural={title}
                    renderFilterNode={renderFilterNodeActive}
                    renderTHead={renderTHeadActive}
                    renderItem={renderItemActive}
                    onChangeViewExpiryDate={onChangeViewExpiryDate}
                    hasSignatures={hasSignatures}
                    onSignatures={this.onSignatures}
                    onExport={this.onExport}
                    NewDialog={NewDialog}
                    ProfileDialog={ProfileDialog}
                    EditDialog={EditDialog}
                    permissionKey={permissionKey}
                    module={module}
                    onBuildQuery={onBuildQuery}
                />
                <RemovedTab
                    ref="removedTab"
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                    title="Removed"
                    titleSingular={titleSingular}
                    titlePlural={title}
                    renderFilterNode={renderFilterNodeRemoved}
                    renderTHead={renderTHeadRemoved}
                    renderItem={renderItemRemoved}
                    onChangeViewExpiryDate={onChangeViewExpiryDate}
                    hasSignatures={hasSignatures}
                    onSignatures={this.onSignatures}
                    onExport={this.onExport}
                    ProfileDialog={ProfileDialog}
                    permissionKey={permissionKey}
                    module={module}
                    onBuildQuery={onBuildQuery}
                />
            </Tabs>

            {NewDialog && <NewDialog ref="newDialog" onSetSignatureSettings={this.onSignatures}/>}
            {hasSignatures && <SignatureDialog ref="signaturesDialog" plugin="plugin_hr_management" module={module}/>}
            {ExportDialog && <ExportDialog ref="exportDialog"/>}
        </>);
    }

    //</editor-fold>
}

// </editor-fold>

export default TabView;
