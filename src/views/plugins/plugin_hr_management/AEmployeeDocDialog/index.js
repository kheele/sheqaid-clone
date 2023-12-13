// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./AEmployeeDocDialog.lazy.css";
import DashboardTab from "./ADashboardTab";
import ActiveTab from "./ActiveTab";
import RemovedTab from "./RemovedTab";

import Popover from "components/popovers/Popover";
import ADialogTab from "../../../ADialogTab";
import {Tabs} from "components/tabs";
import {execWhen, Permissions} from "utils/Utils";
import SignatureDialog from "components/dialogs/SignatureDialog";
import {
    ClearableInput,
    SelectDepartmentInput,
    SelectEmployeeInput,
    SelectJobPositionInput,
    SelectTeamInput
} from "../../../../components/inputs";

// </editor-fold>

@observer
class Dialog extends ADialogTab {

    @observable
    selfState = {
        lists: {
            expiry_date: [{label: 'No Expiry', value: 'null'}, {label: 'Expired', value: -1}, {label: '1 month', value: 1}, {label: '2 months', value: 2}, {label: '3 months', value: 3}, {label: '4 months +', value: 4}],
        }
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        this.classNames = "AEmployeeDocDialog-dialog";

        this.onNew = this.onNew.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.onChangeViewExpiryDate = this.onChangeViewExpiryDate.bind(this);

        this.loadDashboard && (this.loadDashboard = this.loadDashboard.bind(this));

        this.renderFilterNodeActive && (this.renderFilterNodeActive = this.renderFilterNodeActive.bind(this));
        this.renderFilterNodeRemoved && (this.renderFilterNodeRemoved = this.renderFilterNodeRemoved.bind(this));
        this.renderTHeadActive && (this.renderTHeadActive = this.renderTHeadActive.bind(this));
        this.renderTHeadRemoved && (this.renderTHeadRemoved = this.renderTHeadRemoved.bind(this));
        this.renderItemActive && (this.renderItemActive = this.renderItemActive.bind(this));
        this.renderItemRemoved && (this.renderItemRemoved = this.renderItemRemoved.bind(this));
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount">
    componentWillMount() {
        style.use();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillUnmount">
    componentWillUnmount() {
        style.unuse();
    }

    // </editor-fold>

    //<editor-fold desc="loadDashboard">
    async loadDashboard() {
        const topStats = await this.loadDashboardTopStats();
        const bottomStats = await this.loadDashboardBottomStats();//[{id, month_year: date.formatMonthYear(), count}]
        return {topStats, bottomStats};
    };

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNew, onFilter">
    onNew(evt, elem, item) {
        const {refs: {newDialog, mainTabs: {refs: {tabContent: {activeTab}}}}} = this;
        activeTab.refs.root.onNew();
    }

    onFilter() {
        const {refs: {mainTabs: {refs: {tabContent: {activeTab}}}}} = this;
        activeTab.refs.root.onFilter();
    }

    // </editor-fold>

    //<editor-fold desc="onChangeViewExpiryDate">
    onChangeViewExpiryDate(expiry_date) {
        this.expiry_date = expiry_date;
    }

    //</editor-fold>

    //<editor-fold desc="renderFilterNodeActive">
    renderFilterNodeActive(onChange) {
        const filterNodeMarginBClass = this.filterNodeMarginB ? ` -margin-b-${this.filterNodeMarginB}` : '';
        return <div className={`controls grid-${this.filterNodeGrid || 4} grid-gap-5 padding-r-10${filterNodeMarginBClass}`}>
            <SelectDepartmentInput name="department" placeholder="Department..." className="form-control" onChange={onChange} add={false}/>
            <SelectJobPositionInput name="job_position" placeholder="Job Position..." className="form-control" onChange={onChange} add={false}/>
            <SelectTeamInput name="team" placeholder="Team..." className="form-control" onChange={onChange}/>
            <SelectEmployeeInput name="supervisor" placeholder="Supervisor..." className="form-control" onChange={onChange}/>
            <SelectEmployeeInput name="employee" placeholder="Employee..." className="form-control" onChange={onChange}/>

            {this.renderFilterNodeAll && this.renderFilterNodeAll(onChange)}

            {this.expiry_date === 'ALL' && <ClearableInput
                ref="expiry_date"
                name="expiry_date"
                type="select"
                placeholder="Expiry..."
                className="form-control"
                onChange={onChange}
                values={this.selfState.lists.expiry_date}
                returnValue
            />}
        </div>;
    }

    //</editor-fold>

    //<editor-fold desc="renderFilterNodeRemoved">
    renderFilterNodeRemoved(onChange) {
        return <div className="controls grid-4 grid-gap-5 padding-r-10 -margin-b-35">
            <SelectDepartmentInput name="department" placeholder="Department..." className="form-control" onChange={onChange} add={false}/>
            <SelectJobPositionInput name="job_position" placeholder="Job Position..." className="form-control" onChange={onChange} add={false}/>
            <SelectTeamInput name="team" placeholder="Team..." className="form-control" onChange={onChange}/>
            <SelectEmployeeInput name="supervisor" placeholder="Supervisor..." className="form-control" onChange={onChange}/>
            <SelectEmployeeInput name="employee" placeholder="Employee..." className="form-control" onChange={onChange}/>

            {this.renderFilterNodeAll && this.renderFilterNodeAll(onChange)}

            {this.expiry_date === 'ALL' && <ClearableInput
                ref="expiry_date"
                name="expiry_date"
                type="select"
                placeholder="Expiry..."
                className="form-control"
                onChange={onChange}
                values={this.selfState.lists.expiry_date}
                returnValue
            />}
        </div>;
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHeadActive">
    renderTHeadActive({view}) {
        return this.renderTHeadAll({view});
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHeadRemoved">
    renderTHeadRemoved({view}) {
        return this.renderTHeadAll({view});
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemActive">
    renderItemActive({item, idx, view, onClick}) {
        return this.renderItemAll({item, idx, view, onClick});
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemRemoved">
    renderItemRemoved({item, idx, view, onClick}) {
        return this.renderItemAll({item, idx, view, onClick});
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderPage">
    renderPage() {
        const {permissionKey, module} = this;
        const {isRemoved} = this.props;
        const {NewDialog, ProfileDialog, EditDialog, ExportDialog,} = this.dialogs;

        return (<>
            <TabWrapper
                ref="tabWrapper"
                onUpdate={this.onUpdate}
                title={this.title}
                titleSingular={this.titleSingular}
                permissionKey={permissionKey}
                isRemoved={isRemoved}
                NewDialog={NewDialog}
                ProfileDialog={ProfileDialog}
                EditDialog={EditDialog}
                ExportDialog={ExportDialog}
                module={module}

                loadDashboard={this.loadDashboard}
                onBuildQuery={this.onBuildQuery}
                renderFilterNodeActive={this.renderFilterNodeActive}
                renderFilterNodeRemoved={this.renderFilterNodeRemoved}
                renderTHeadActive={this.renderTHeadActive}
                renderTHeadRemoved={this.renderTHeadRemoved}
                renderItemActive={this.renderItemActive}
                renderItemRemoved={this.renderItemRemoved}

                onChangeViewExpiryDate={this.onChangeViewExpiryDate}
                onViewDialog={this.onViewDialog}
            />

            <Popover ref="popover"/>
        </>);
    }

    // </editor-fold>

}

// <editor-fold defaultstate="collapsed" desc="TabWrapper">
@observer
class TabWrapper extends React.Component {

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

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onExport">
    onExport(e, btn) {
        this.refs.exportDialog.open();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onViewActiveTab, onViewRemovedTab">
    onViewActiveTab() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(1);
    }

    onViewRemovedTab() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(2);
    }

    // </editor-fold>

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

    // </editor-fold>

    //<editor-fold desc="render">
    render() {
        const {
            onUpdate,
            title,
            titleSingular,
            permissionKey,
            isRemoved,
            NewDialog, ProfileDialog, EditDialog, ExportDialog, module,
            loadDashboard,
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

                    onViewActiveTab={this.onViewActiveTab}
                    onViewRemovedTab={this.onViewRemovedTab}

                    onViewNoExpiry={this.onViewNoExpiry}
                    onViewExpired={this.onViewExpired}
                    onViewMonExpiry={this.onViewMonExpiry}
                    onView2MonExpiry={this.onView2MonExpiry}
                    onView3MonExpiry={this.onView3MonExpiry}
                    onView4MonExpiry={this.onView4MonExpiry}

                    onViewDialog={onViewDialog}
                    onNewDialog={this.onNewDialog}
                    onSignatures={this.onSignatures}
                    onExport={this.onExport}
                />
                <ActiveTab
                    ref="employeesActiveTab"
                    onUpdate={onUpdate}
                    title="Active"
                    titleSingular={titleSingular}
                    titlePlural={title}
                    renderFilterNode={renderFilterNodeActive}
                    renderTHead={renderTHeadActive}
                    renderItem={renderItemActive}
                    onChangeViewExpiryDate={onChangeViewExpiryDate}
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
                    title="Removed"
                    titleSingular={titleSingular}
                    titlePlural={title}
                    renderFilterNode={renderFilterNodeRemoved}
                    renderTHead={renderTHeadRemoved}
                    renderItem={renderItemRemoved}
                    onChangeViewExpiryDate={onChangeViewExpiryDate}
                    onSignatures={this.onSignatures}
                    onExport={this.onExport}
                    ProfileDialog={ProfileDialog}
                    permissionKey={permissionKey}
                    module={module}
                    onBuildQuery={onBuildQuery}
                />
            </Tabs>

            {NewDialog && <NewDialog ref="newDialog" onSetSignatureSettings={this.onSignatures}/>}
            <SignatureDialog ref="signaturesDialog" plugin="plugin_hr_management" module={module}/>
            {ExportDialog && <ExportDialog ref="exportDialog"/>}
        </>);
    }

    //</editor-fold>
}

// </editor-fold>

export default Dialog;
