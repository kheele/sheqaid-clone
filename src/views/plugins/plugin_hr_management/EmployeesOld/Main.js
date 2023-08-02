// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import style from "./Main.lazy.css";

import {calculateRightPos, Permissions} from 'utils/Utils';
import {Button} from 'components/inputs';
import NavItem from 'components/navs/NavItem';
import Popover from 'components/popovers/Popover';
import {TabledTopPanel} from 'components/tables';

import APage from "../../../APage";
import EmployeesActiveTab from './EmployeesActiveTab.js';
import EmployeesRemovedTab from './EmployeesRemovedTab.js';

import {DepartmentsDialog, JobPositionsDialog, TeamsDialog, TransferEmployeesDialog} from "./dialogs";

import {ContactsDialog} from '../external_modules/Contacts';
import {KPIDialog} from '../external_modules/KPI';
import {MeetingsDialog} from '../external_modules/Meetings';
import {TrainingDialog} from '../external_modules/Trainings';

import {AttendanceDialog} from '../other_modules/Attendances';
import {PPEDialog} from '../other_modules/PPE';
import {TasksDialog} from '../other_modules/Tasks';

import {CompetenciesDialog} from '../Competencies';
import {ContractsDialog} from '../Contracts';
import {CounselingsDialog} from '../Counselings';
import {LeavesDialog} from '../Leaves';
import {LicensesDialog} from '../Licenses';
import {MedicalsDialog} from '../Medicals';
import {WarningsDialog} from '../Warnings';
import {WorkPermitsDialog} from '../WorkPermits';

import ImportDialog from './ImportDialog';
import NewDialog from './NewDialog';

import Tabs from 'components/tabs/Tabs';

// </editor-fold>

@observer
class Main extends APage {
    // <editor-fold defaultstate="collapsed" desc="fields">
    static key = 'Employees';
    static title = 'Employees';
    static faIconLeft = 'users';

    path = "plugin_sheq_assist/employees/";
    @observable
    state = {index: 0, isLoaded: false};
    compRefs = {};
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onNew = this.onNew.bind(this);
        this.onFilter = this.onFilter.bind(this);

        this.onViewActiveTab = this.onViewActiveTab.bind(this);
        this.onViewRemovedTab = this.onViewRemovedTab.bind(this);

        this.onViewDialog = this.onViewDialog.bind(this);

        this.onViewTeams = this.onViewTeams.bind(this);
        this.onViewJobPositions = this.onViewJobPositions.bind(this);
        this.onViewDepartments = this.onViewDepartments.bind(this);

        this.onImport = this.onImport.bind(this);
        this.onExport = this.onExport.bind(this);
        this.onPrintCards = this.onPrintCards.bind(this);
        this.onTransfer = this.onTransfer.bind(this);
        this.onBulkDelete = this.onBulkDelete.bind(this);

        this.onChangeMoreOptions = this.onChangeMoreOptions.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount, componentDidMount, componentWillUnmount">
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
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange, onNew, onFilter">
    onChange(index) {
        const {state, refs: {buttonFilter, buttonCreate}} = this;
//        if (index === 0) {
//            buttonFilter.hide();
//        } else {
//            buttonFilter.show();
//        }
        if (index === 1) {
            buttonCreate.hide();
        } else {
            buttonCreate.show();
        }
        state.index = index;
    }

    onNew(evt, elem, item) {
        const {state: {index}, refs: {newDialog, mainTabs: {refs: {tabContent: {activeTab}}}}} = this;
//        if (index === 0) {
//            if (newDialog) {
////                const {props: {promise}, onNewItem} = this.props.page;
//                newDialog.open(item).then(item => {
////                    if(!onNewItem) {
////                        this.state.list.pushFirst(item);
////                    } else {
////                        onNewItem(item);
////                    }
////                    promise && promise.resolve && promise.resolve(item);
//                }).catch(e => {
////                    promise && promise.reject && promise.reject(e);
//                    throw e;
//                });
//            } else {
//                infoDialog.open(<p className='action-prohibited'>The action is prohibited</p>);
//            }
//        } else {
            activeTab.refs.root.onNew();
//        }
    }

    onFilter() {
        const {state: {index}, refs: {mainTabs: {refs: {tabContent: {activeTab}}}}} = this;
//        if (index !== 0) {
            activeTab.refs.root.onFilter();
//        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="view more...">
    onViewTeams() {
        this.refs.teamsDialog.open();
    }

    onViewJobPositions() {
        this.refs.jobPositionsDialog.open();
    }

    onViewDepartments() {
        this.refs.departmentsDialog.open();
    }

    onImport(e, btn) {
        this.refs.importDialog.open().then(list => {
            this.refs.root.list.push(...list);
        });
    }

    onExport(e, btn) {
        this.refs.transferEmployeesDialog.extraProp('role', 'export').open();
    }

    onPrintCards(e, btn) {
        this.refs.transferEmployeesDialog.extraProp('role', 'print-cards').open();
    }

    onTransfer() {
        this.refs.transferEmployeesDialog.extraProp('role', 'transfer').open().then(list => {
            this.refs.root.list.forEach(item => {
                const itemUpdate = list.find(v => v.id === item.id);
                if (itemUpdate) {
                    extendObservable(item.data, itemUpdate.data);
                }
            });
        });
    }

    onBulkDelete() {
        this.refs.transferEmployeesDialog.extraProp('role', 'bulk-delete').open().then(ids => {
            this.refs.root.list.removeIf((item, n) => ids.contains(item.id));
        });
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

    // <editor-fold defaultstate="collapsed" desc="onViewDialog, onChangeMoreOptions">
    onViewDialog(evt, el) {
        const {compRef} = el.props;
        this.compRefs[compRef].open();
    }

    onChangeMoreOptions(e, el) {
        const {isConsultant, isHasProjects, isContractor} = storage.is;
        
        const {permissions_modules, permissions_other} = storage.loggedUser.user.data;
        const permissions_mod_Employees = (permissions_modules || []).find(v => v.key === "Employees");
        //
        const permissions_other_JobPositions = (permissions_other || []).find(v => v.key === "Job Positions");
        const permissions_other_Departments = (permissions_other || []).find(v => v.key === "Departments");
        const permissions_other_Teams = (permissions_other || []).find(v => v.key === "Teams");

        const jqElem = $(el.getDOMNode());
        const offset = jqElem.offset();
        this.refs.popover.settings({
            style: {left: "auto", right: calculateRightPos(jqElem[0], true), top: offset.top + jqElem.height() + 20, width: 'auto', minWidth: 200},
            isDialog: true,
            className: "EmployeeDialogActionsPopover",
            contentNode: <div>
                <p className="padding-t-10 text-center">--- Select ---</p>
                <div className="main-actions">
                    <hr className="margin-t-0 margin-b-0"/>   
                    {this.navItems}     
                </div>
                <hr className="margin-t-0 margin-b-0"/>
                {Permissions.allow(permissions_other_Teams) && <NavItem faIconLeft="group" onClick={this.onViewTeams} title="Teams"/>}
                {Permissions.allow(permissions_other_JobPositions) && <NavItem faIconLeft="map-marker" onClick={this.onViewJobPositions} title="Job Positions"/>}
                {Permissions.allow(permissions_other_Departments) && <NavItem faIconLeft="building" onClick={this.onViewDepartments} title="Departments"/>}
                <hr className="margin-t-0 margin-b-0"/>
                {Permissions.allowCreate(permissions_mod_Employees) && <NavItem faIconLeft="file-import" onClick={this.onImport} title="Import"/>}
                <NavItem faIconLeft="download" onClick={this.onExport} title="Export"/>
                <NavItem faIconLeft="clipboard-list" onClick={this.onPrintCards} title="Print Cards"/>
                {isContractor && !isContractor && isHasProjects && <NavItem faIconLeft="send" onClick={this.onTransfer} title="Transfer"/>}
                <hr className="margin-t-0 margin-b-0"/>
                {Permissions.allowRemove(permissions_mod_Employees) && <NavItem faIconLeft="trash" onClick={this.onBulkDelete} title="Bulk Delete"/>}
            </div>
        }).open();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="elements, navItems, buttons, dialogs">
    @computed
    get elements() {
        const w = $(window).width();
        const fontSizeClass = w < 1100 ? "font-size-12 " : "";

        const {permissions_modules, permissions_other} = storage.loggedUser.user.data;
        const permissions_mod_Employees = (permissions_modules || []).find(v => v.key === "Employees");

        //--upcoming
        //Payroll
        //Planning
        //Approvals
        //Compliance
        //Expenses
        //
        //--added
        //Employees
        //Attendances.
        //Competencies.
        //Contracts.
        //Leaves.
        //Medicals.
        //Warnings.
        //
        //--to add
        //PPE. - added
        //Counselings. - added
        //Work Permits. - added ...
        //Licenses. - added ...
        //Contacts. - ...
        //KPI. - ...
        //Meetings. - ...
        //Tasks. - 
        //Training. - ...
        //
        //Teams
        //Job Positions
        //Departments

        const {path} = this;
        return [
            {key: 'Competencies', text: 'Competencies', titleBG: 'bg-7a7a7a', Comp: CompetenciesDialog, path},
            {key: 'Contracts', text: 'Contracts', titleBG: 'bg-8b5d5d', Comp: ContractsDialog, path},
            {key: 'Counseling', text: 'Counseling', titleBG: 'bg-645d8b', Comp: CounselingsDialog, path},
            {key: 'Leaves', text: 'Leaves', titleBG: 'bg-b9a519', Comp: LeavesDialog, path},
            {key: 'Licenses', text: 'Licenses', titleBG: 'bg-7a7a7a', Comp: LicensesDialog, path},
            {key: 'Medicals', text: 'Medicals', titleBG: 'bg-8b5d5d', Comp: MedicalsDialog, path},
            {key: 'Warnings', text: 'Warnings', titleBG: 'bg-8b5d5d', Comp: WarningsDialog, path},
            {key: 'WorkPermits', text: 'Work Permits', titleBG: 'bg-645d8b', Comp: WorkPermitsDialog, path},
            
            {key: 'Attendances', text: 'Attendance', titleBG: 'bg-b9a519', Comp: AttendanceDialog, noExpiry: true}, //no path
            {key: 'Contacts', text: 'Contacts', titleBG: 'bg-8b5d5d', Comp: ContactsDialog, noExpiry: true},//no path
            {key: 'KPI', text: 'KPI', titleBG: 'bg-5d8b63', Comp: KPIDialog, noExpiry: true}, //no path
            {key: 'Meetings', text: 'Meetings', titleBG: 'bg-645d8b', Comp: MeetingsDialog, noExpiry: true, path},///
            {key: 'PPE', text: 'PPE', titleBG: 'bg-5d8b63', Comp: PPEDialog, noExpiry: true}, //no path
            {key: 'Tasks', text: 'Tasks', titleBG: 'bg-b9a519', Comp: TasksDialog, noExpiry: true}, //no path///
            {key: 'Trainings', text: 'Training', titleBG: 'bg-7a7a7a', Comp: TrainingDialog, noExpiry: true} //no path///
        ].map(({key, text, Comp, titleBG, noExpiry, path}) => {
            const permissions_mod = (permissions_modules || []).find(v => v.key === key);
            const c = Permissions.allow(permissions_mod) ? "allowed" : "disallowed";
            const className = fontSizeClass + c + " btn btn-primary pull-right _888";
            const compRef = `ref${key}Dialog`;
            return {
                btn: <Button compRef={compRef} text={text} className={className} onClick={this.onViewDialog}/>,
                navItem: <NavItem compRef={compRef} className={c} onClick={this.onViewDialog} title={text}/>,
                key, c, compRef, titleBG, text, Comp, noExpiry, path
            };
        });
    }

    @computed
    get navItems() {
        return this.elements.map(({navItem}) => navItem);
    }

    @computed
    get buttons() {
        return this.elements.map(({btn}) => btn).reverse();
    }

    @computed
    get dialogs() {
        return this.elements.map(({compRef, Comp, path}) => <Comp ref={ref => this.compRefs[compRef] = ref} path={path}/>);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
    renderLeftButtons() {
        const {loggedUser} = storage;
        const {isContractor, isContractorView} = storage.is;

        const {permissions_modules, permissions_other} = loggedUser.user.data;
        const permissions_mod_Employees = (permissions_modules || []).find(v => v.key === "Employees");

        const w = $(window).width();
        const fontSizeClass = w < 1100 ? "font-size-12 " : "";

        const writable = isContractor || !isContractorView;
        return <div className="left-buttons pull-left">
            {writable && <Button className={fontSizeClass + "btn btn-primary fixed-flex pull-right"} onClick={this.onChangeMoreOptions}>
                <i className="fa fa-angle-down icon-left"/> More...
            </Button>}
            {this.buttons}
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {permissionKey} = this.props;
        return (<div key="Employees-page" id="Employees-page" className={this.classNames}>
            <div key="pageTitle" className="page-title">
                {this.renderBackBtn()}
                <h3 key="title">Employees</h3>
                <TabledTopPanel ref="tabledTopPanel">
                    <Button ref="buttonCreate" key="buttonCreate" className="btn btn-primary pull-right top-btn-nav__create" onClick={this.onNew}>
                        <i key="buttonCreateIcon" className="fa fa-plus icon-left"/>Create
                    </Button>
                    <Button ref="buttonFilter" shouldRender={true} className="btn btn-primary pull-right top-btn-nav__filter" onClick={this.onFilter}>
                        <i key="buttonFilterIcon" className="fa fa-search icon-left"/>Filter
                        <i ref="buttonFilterIconDrop" key="buttonFilterIconDrop" className="fa fa-angle-down icon-right"/>
                    </Button>
                    {this.renderLeftButtons()}
                </TabledTopPanel>
            </div>
            <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onChange={this.onChange}>
                {/*<DashboardTab 
                    ref="dashboard" 
                    title="Dashboard" 
                    path={this.path}
                    onViewActiveTab={this.onViewActiveTab}
                    onViewRemovedTab={this.onViewRemovedTab}
                    onViewTeams={this.onViewTeams}
                    onViewDepartments={this.onViewDepartments}
                    onViewJobPositions={this.onViewJobPositions}
                    onViewDialog={this.onViewDialog}
                    elements={this.elements}
                />*/}
                <EmployeesActiveTab ref="employeesActiveTab" title="Active" path={this.path}/>
                <EmployeesRemovedTab ref="employeesRemovedTab" title="Removed" path={this.path}/>
            </Tabs>
        
            <ImportDialog ref="importDialog" path={this.path}/>
            <NewDialog ref="newDialog" path={this.path}/>
        
            {this.dialogs}
        
            <TeamsDialog ref="teamsDialog" path={this.path}/>
            <JobPositionsDialog ref="jobPositionsDialog" path={this.path}/>
            <DepartmentsDialog ref="departmentsDialog" path={this.path}/>
        
            <TransferEmployeesDialog ref="transferEmployeesDialog" path={this.path}/>
        
            <Popover ref="popover"/>
        </div>);
    }
    // </editor-fold>
}

export default Main;
//630