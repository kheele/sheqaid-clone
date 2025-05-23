import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {Permissions} from "utils/Utils";
import {Tabs} from "components/tabs";
import DashboardTab from "./DashboardTab";
import UnsubmittedTab from "./UnsubmittedTab";
import AwaitingApprovalTab from "./AwaitingApprovalTab";
import AwaitingPaymentTab from "./AwaitingPaymentTab";
import CompletedTab from "./CompletedTab";
import RejectedTab from "./RejectedTab";
import RemovedTab from "../../AEmployeeDocDialog/RemovedTab";
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

        this.onViewRemovedTab = this.onViewRemovedTab.bind(this);
        this.onViewUnsubmitted = this.onViewUnsubmitted.bind(this);
        this.onViewAwaitingApproval = this.onViewAwaitingApproval.bind(this);
        this.onViewAwaitingPayment = this.onViewAwaitingPayment.bind(this);
        this.onViewCompleted = this.onViewCompleted.bind(this);
        this.onViewRejected = this.onViewRejected.bind(this);
    }

    //</editor-fold>

    @computed get isUnsubmitted() {
        return this.status === "Unsubmitted";
    }

    @computed get isAwaitingApproval() {
        return this.status === "Awaiting Approval";
    }

    @computed get isAwaitingPayment() {
        return this.status === "Awaiting Payment";
    }

    // </editor-fold>

    @computed get isCompleted() {
        return this.status === "Completed";
    }

    // </editor-fold>

    @computed get isRejected() {
        return this.status === "Rejected";
    }

    @computed get status() {
        const {mainTabs} = this.refs;
        switch (mainTabs.activeIndex) {
            case 1:
                return 'Unsubmitted';
            case 2:
                return 'Awaiting Approval';
            case 3:
                return 'Awaiting Payment';
            case 4:
                return 'Completed';
            case 5:
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

    // <editor-fold defaultstate="collapsed" desc="onSignatures">
    onSignatures(e, btn) {
        this.refs.signaturesDialog.open();
    }

    // <editor-fold defaultstate="collapsed" desc="onExport">
    onExport(e, btn) {
        this.refs.exportDialog.open();
    }

    // <editor-fold defaultstate="collapsed" desc="onViewRemovedTab">
    onViewRemovedTab() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(6);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onViewUnsubmitted, onViewAwaitingApproval, onViewAwaitingPayment, onViewCompleted, onViewRejected">
    onViewUnsubmitted() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(1);
    }

    onViewAwaitingApproval() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(2);
    }

    onViewAwaitingPayment() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(3);
    }

    onViewCompleted() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(4);
    }

    onViewRejected() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(5);
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

                    onViewRemovedTab={this.onViewRemovedTab}

                    onViewUnsubmitted={this.onViewUnsubmitted}
                    onViewAwaitingApproval={this.onViewAwaitingApproval}
                    onViewAwaitingPayment={this.onViewAwaitingPayment}
                    onViewCompleted={this.onViewCompleted}
                    onViewRejected={this.onViewRejected}

                    onViewDialog={onViewDialog}
                    onNewDialog={this.onNewDialog}
                    onSignatures={this.onSignatures}
                    onExport={this.onExport}
                />
                <UnsubmittedTab
                    ref="unsubmittedTab"
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                    title="Unsubmitted"
                    titleSingular={titleSingular}
                    titlePlural={title}
                    disableTopExpiryFilter
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
                <AwaitingApprovalTab
                    ref="awaitingApprovalTab"
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                    title="Awaiting Approval"
                    titleSingular={titleSingular}
                    titlePlural={title}
                    disableTopExpiryFilter
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
                <AwaitingPaymentTab
                    ref="awaitingPaymentTab"
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                    title="Awaiting Payment"
                    titleSingular={titleSingular}
                    titlePlural={title}
                    disableTopExpiryFilter
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
                <CompletedTab
                    ref="completedTab"
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                    title="Completed"
                    titleSingular={titleSingular}
                    titlePlural={title}
                    disableTopExpiryFilter
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
                    disableTopExpiryFilter
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
                    ref="employeesRemovedTab"
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                    title="Removed"
                    titleSingular={titleSingular}
                    titlePlural={title}
                    disableTopExpiryFilter
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
