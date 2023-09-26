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

import APage from "views/APage";
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
import NewDialog from './forms/NewDialog';

import Tabs from 'components/tabs/Tabs';
import DashboardTab from "./DashboardTab";
import JobCategoriesDialog from "./dialogs/JobCategoriesDialog";
import {JobAppointmentsDialog} from "../../plugin_extra/__C_Structure_And_Responsibility/JobAppointments";
import {PlannedJobObservationsDialog} from "../PlannedJobObservations";

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
		this.onViewJobCategories = this.onViewJobCategories.bind(this);
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
		const {state, refs: {buttonFilter}} = this;
		if (index === 0) {
			buttonFilter.hide();
		} else {
			buttonFilter.show();
		}

		state.index = index;
	}

	onNew(evt, elem, item) {
		const {state: {index}, refs: {newDialog, mainTabs: {refs: {tabContent: {activeTab}}}}} = this;
		if (index === 0) {
			if (newDialog) {
//                const {props: {promise}, onNewItem} = this.props.page;
				newDialog.open(item).then(item => {
//                    if(!onNewItem) {
//                        this.state.list.pushFirst(item);
//                    } else {
//                        onNewItem(item);
//                    }
//                    promise && promise.resolve && promise.resolve(item);
				}).catch(e => {
//                    promise && promise.reject && promise.reject(e);
// 					throw e;
				});
			}
		} else {
			activeTab.refs.root.onNew();
		}
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

	onViewJobCategories() {
		this.refs.jobCategoriesDialog.open();
	}

	onViewJobPositions() {
		this.refs.jobPositionsDialog.open();
	}

	onViewDepartments() {
		this.refs.departmentsDialog.open();
	}

	onImport(e, btn) {
		this.refs.importDialog.open();
	}

	onExport(e, btn) {
		this.refs.transferEmployeesDialog.extraProp('role', 'export').open();
	}

	onPrintCards(e, btn) {
		this.refs.transferEmployeesDialog.extraProp('role', 'print-cards').open();
	}

	onTransfer() {
		this.refs.transferEmployeesDialog.extraProp('role', 'transfer').open();
	}

	onBulkDelete() {
		this.refs.transferEmployeesDialog.extraProp('role', 'bulk-delete').open();
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
		const {isConsultant, hasProjects, isContractor} = storage.is;

		const jqElem = $(el.getDOMNode());
		const offset = jqElem.offset();
		this.refs.popover.settings({
			style: {
				left: "auto",
				right: calculateRightPos(jqElem[0], true),
				top: offset.top + jqElem.height() + 20,
				width: 'auto',
				minWidth: 200
			},
			isDialog: true,
			className: "EmployeeDialogActionsPopover",
			contentNode: <div>
				<p className="padding-t-10 text-center">--- Select ---</p>
				<div className="main-actions">
					<hr className="margin-t-0 margin-b-0"/>
					{this.navItems}
				</div>
				<hr className="margin-t-0 margin-b-0"/>
				{Permissions.allowOther("Teams") && <NavItem onClick={this.onViewTeams} title="Teams"/>}
				{Permissions.allowOther("Job Categories") &&
					<NavItem onClick={this.onViewJobCategories} title="Job Categories"/>}
				{Permissions.allowOther("Job Positions") && <NavItem onClick={this.onViewJobPositions} title="Job Positions"/>}
				{Permissions.allowOther("Departments") && <NavItem onClick={this.onViewDepartments} title="Departments"/>}
				<hr className="margin-t-0 margin-b-0"/>
				{Permissions.allowCreateMod("Employees") && <NavItem onClick={this.onImport} title="Import"/>}
				<NavItem onClick={this.onExport} title="Export"/>
				<NavItem onClick={this.onPrintCards} title="Print Cards"/>
				{isContractor && !isContractor && hasProjects && <NavItem onClick={this.onTransfer} title="Transfer"/>}
				<hr className="margin-t-0 margin-b-0"/>
				{Permissions.allowRemoveMod("Employees") && <NavItem onClick={this.onBulkDelete} title="Bulk Delete"/>}
			</div>
		}).open();
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="elements, navItems, buttons, dialogs">
	@computed
	get elements() {
		const w = $(window).width();
		const fontSizeClass = w < 1100 ? "font-size-12 " : "";

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
			{key: 'Competencies', listName: 'competency_list', text: 'Competencies', Comp: CompetenciesDialog, path},
			{key: 'Contracts', listName: 'contract_list', text: 'Contracts', Comp: ContractsDialog, path},
			{key: 'Counseling', listName: 'counselling_list', text: 'Counseling', Comp: CounselingsDialog, path},
			{
				key: 'Job Appointments',
				listName: 'job_appointment_list',
				text: 'Job Appointments',
				Comp: JobAppointmentsDialog,
				path
			},
			{
				key: 'PlannedJobObservations',
				listName: 'job_observation_list',
				text: 'Job Observations',
				Comp: PlannedJobObservationsDialog,
				path
			},
			{key: 'Leaves', listName: 'leave_list', text: 'Leaves', Comp: LeavesDialog, path},
			{key: 'Licenses', listName: 'license_list', text: 'Licenses', Comp: LicensesDialog, path},
			{key: 'Medicals', listName: 'medical_list', text: 'Medicals', Comp: MedicalsDialog, path},
			{key: 'Warnings', listName: 'warning_list', text: 'Warnings', Comp: WarningsDialog, path},
			{key: 'WorkPermits', listName: 'work_permit_list', text: 'Work Permits', Comp: WorkPermitsDialog, path},

			// {key: 'Attendances', listName: '', text: 'Attendance', Comp: AttendanceDialog, noExpiry: true}, //no path
			// {key: 'Contacts', listName: '', text: 'Contacts', Comp: ContactsDialog, noExpiry: true},//no path
			// {key: 'KPI', listName: '', text: 'KPI', Comp: KPIDialog, noExpiry: true}, //no path
			// {key: 'Meetings', listName: '', text: 'Meetings', Comp: MeetingsDialog, noExpiry: true, path},///
			{key: 'PPE', listName: '', text: 'PPE', Comp: PPEDialog, noExpiry: true}, //no path
			// {key: 'Tasks', listName: '', text: 'Tasks', Comp: TasksDialog, noExpiry: true}, //no path///
			// {key: 'Trainings', listName: '', text: 'Training', Comp: TrainingDialog, noExpiry: true} //no path///
		].map(({key, text, listName, Comp, titleBG, noExpiry, path}) => {
			const c = Permissions.allowMod(key) ? "allowed" : "disallowed";
			const className = fontSizeClass + c + " btn btn-primary pull-right _888";
			const compRef = `ref${key.replaceAll(" ", "")}Dialog`;
			return {
				btn: <Button compRef={compRef} text={text} className={className} onClick={this.onViewDialog}/>,
				navItem: <NavItem compRef={compRef} className={c} onClick={this.onViewDialog} title={text}/>,
				key, c, compRef, titleBG, text, Comp, noExpiry, path,
				listName
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
		const {isContractor, isContractorView} = storage.is;

		const w = $(window).width();
		const fontSizeClass = w < 1100 ? "font-size-12 " : "";

		const writable = isContractor || !isContractorView;
		return <div className="left-buttons pull-left">
			{writable &&
				<Button className={fontSizeClass + "btn btn-primary fixed-flex pull-right"} onClick={this.onChangeMoreOptions}>
					<i className="fa fa-angle-down icon-left"/> More...
				</Button>}
			{this.buttons}
		</div>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		const {permissionKey, excludeDashboard, excludeRemoved, params} = this.props;
		const {isContractorViewVisited, isEmployee} = storage.is;
		const tabs = [];
		if (!excludeDashboard) {
			tabs.push(<DashboardTab
				ref="dashboard"
				title="Dashboard"
				path={this.path}
				onViewActiveTab={this.onViewActiveTab}
				onViewRemovedTab={this.onViewRemovedTab}
				onViewTeams={this.onViewTeams}
				onViewDepartments={this.onViewDepartments}
				onViewJobCategories={this.onViewJobCategories}
				onViewJobPositions={this.onViewJobPositions}
				onViewDialog={this.onViewDialog}
				elements={this.elements}
			/>);
		}
		tabs.push(<EmployeesActiveTab ref="employeesActiveTab" title="Active" params={params}/>);
		if (!excludeRemoved) {
			tabs.push(<EmployeesRemovedTab ref="employeesRemovedTab" title="Removed" params={params}/>);
		}
		return (<div key="Employees-page" id="Employees-page" className={this.classNames}>
			<div key="pageTitle" className="page-title">
				{this.renderBackBtn()}
				<h3 key="title">Employees</h3>
				<TabledTopPanel ref="tabledTopPanel">
					<Button ref="buttonCreate" key="buttonCreate" shouldRender={!isEmployee && !isContractorViewVisited} className="btn btn-primary pull-right top-btn-nav__create"
					        onClick={this.onNew}>
						<i key="buttonCreateIcon" className="fa fa-plus icon-left"/>Create
					</Button>
					<Button ref="buttonFilter" shouldRender={false} className="btn btn-primary pull-right top-btn-nav__filter"
					        onClick={this.onFilter}>
						<i key="buttonFilterIcon" className="fa fa-search icon-left"/>Filter
						<i ref="buttonFilterIconDrop" key="buttonFilterIconDrop" className="fa fa-angle-down icon-right"/>
					</Button>
					{this.renderLeftButtons()}
				</TabledTopPanel>
			</div>

			{tabs.length > 1 &&
				<Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onChange={this.onChange}>
					{tabs}
				</Tabs>}

			{tabs.length === 1 && tabs}

			<ImportDialog ref="importDialog" path={this.path}/>
			<NewDialog ref="newDialog" path={this.path}/>

			{this.dialogs}

			<TeamsDialog ref="teamsDialog" path={this.path}/>
			<JobCategoriesDialog ref="jobCategoriesDialog" path={this.path}/>
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