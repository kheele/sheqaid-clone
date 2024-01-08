//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, computed, extendObservable} from 'mobx';

import {Dates, execWhen} from 'utils/Utils';
import APageListReadWrite from "../../../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import {ConfirmDialog} from 'components/dialogs';
import {
	ActionsButton,
	Button,
	ClearableInput,
	SelectJobPositionInput,
} from 'components/inputs';
import {TData, THead, TRow} from 'components/tables';

import NewToolboxTalkDialog from './forms/NewToolboxTalkDialog';
import EditToolboxTalkDialog from './forms/EditToolboxTalkDialog';
import ProfileToolboxTalkDialog from './forms/ProfileToolboxTalkDialog';

import ToolboxTalkSubjectDialog from "./forms/ToolboxTalkDialogs/ToolboxTalkSubjectDialog";
import ExportToolboxTalksDialog from "./forms/ExportToolboxTalksDialog";

import style from "./ToolboxTalksTab.lazy.css";
import ToolboxTalkAttendanceRegisterDialog from "./forms/ToolboxTalkDialogs/ToolboxTalkAttendanceRegisterDialog";
import SelectToolboxTalkSubjectInput from "components/inputs/SelectToolboxTalkSubjectInput";
import SelectToolboxTalkSubjectCategoryInput
	from "components/inputs/SelectToolboxTalkSubjectCategoryInput";
import SelectEmployeeInput from "components/inputs/SelectEmployeeInput";
import MKBox from "components/MK/MKBox";
import ViewByButtons from "components/ViewByButtons";

//</editor-fold>

@observer
class ToolboxTalksTab extends React.Component {
	//<editor-fold desc="fields">
	pageKey = "ToolboxTalksTab";
	
	@observable
	state = {
		lists: {
			frequency: ['5 Years', '4 Years', '3 Years', '2 Years', 'Annually', 'Bi-Annually', 'Quarterly'],
		},
		loadedSelectLists: false,
		view: 'Toolbox Talk / Safety Meeting',
	};
	//</editor-fold>
	
	//<editor-fold desc="constructor">
	constructor(props) {
		super(props);
		
		this.onLoadList = this.onLoadList.bind(this);
		
		this.setView = this.setView.bind(this);
		this.onView && (this.onView = this.onView.bind(this));
		
		this.onNewItem = this.onNewItem.bind(this);
		this.onAdd && (this.onAdd = this.onAdd.bind(this));
		this.onEdit && (this.onEdit = this.onEdit.bind(this));
		
		this.onExportAll = this.onExportAll.bind(this);
		this.onViewSubjects = this.onViewSubjects.bind(this);
		this.onCreateAttendanceRegister = this.onCreateAttendanceRegister.bind(this);
		
		this.renderItem = this.renderItem.bind(this);
		this.renderLeftButtons = this.renderLeftButtons.bind(this);
		this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
		this.renderFilterNode = this.renderFilterNode.bind(this);
	}
	
	//</editor-fold>
	
	componentWillMount() {
		style.use();
	}
	
	componentWillUnmount() {
		style.unuse();
	}
	
	// <editor-fold defaultstate="collapsed" desc="onAdd">
	onAdd(e, el) {
		const {idx} = el.props;
		const mainItem = this.refs.root.list[idx];
		const dialog = this.refs.root.getDialogByRef('newDialog');
		dialog && dialog.open(mainItem).then(data => {
//            extendObservable(item.data, data);
		});
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onEdit">
	onEdit(e, el) {
		const {idx} = el.props;
		const docItem = this.refs.root.list[idx];
		const dialog = this.refs.root.getDialogByRef('editDialog');
		dialog && dialog.open(docItem).then(data => {
			extendObservable(docItem.data, data);
		});
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onNewItem">
	onNewItem(item) {
		const {list} = this.refs.root;
		const existingItem = list.find(v => v.id === item.id);
		if (existingItem) {
			setTimeout(() => {
				extendObservable(existingItem.data, item.data);
				const idx = list.indexOf(existingItem);
				list.removeIf((item, _idx) => _idx === idx);
				list.insertAt(idx, item);
			}, 0);
		} else {
			list.pushFirst(item);
		}
	}
	
	// </editor-fold>
	
	@computed get isToolboxTalk() {
		return this.state.view === "Toolbox Talk / Safety Meeting";
	}
	
	//<editor-fold desc="onLoadList">
	onLoadList(params = {}) {
		const {state: {view}} = this;
		
		const {page, lastItem, filterData, filtered, isNew} = params;
		const {
			training_frequency,
			date,
			subject_list,
			subject_category_list,
			trainer_list,
			job_position_list,
			employee_list,
		} = filterData || {};
		
		const listByLogged = sockets.of('trainings/toolbox-talks').fn('listByLogged');
		
		return listByLogged({
			view,
			//
			training_frequency,
			date,
			subject_list,
			subject_category_list,
			trainer_list,
			job_position_list,
			employee_list,
			//
			exact_orgs: true,
			//
			offset: isNew ? 0 : this.refs.root.list.length,
		}).then((res) => {
			console.log('onLoadList res', res)
			return res;
		});
	}
	
	//</editor-fold>
	
	//<editor-fold desc="setView">
	async setView({view = 'Toolbox Talk / Safety Meeting', load = true}) {
		let ref;
		if (this.refs.viewButtonsRefBox) {
			ref = this.refs.viewButtonsRefBox;
		} else {
			ref = await execWhen(() => this.refs.viewButtonsRefBox);
		}
		
		const {view: old_view} = this.state;
		
		console.log('setView', this);
		console.log('setView view', old_view, view);
		
		if(old_view !== view) {
			const filterWrapper = await execWhen(() => this.refs.root.refs.filterWrapper);
			if (filterWrapper.isOpen) {
				await filterWrapper.close();
			}
		}
		
		ref.setView(view);
		this.state.view = view;
		
		if (load) {
			this.refs.root.load();
		}
	}
	
	//</editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onView">
	onView(e, el) {
		const {idx} = el.props;
		const {list} = this.refs.root;
		const item = list[idx];
		console.log("list", this.isToolboxTalk, list.slice())
		const dialog = this.refs.root.getDialogByRef('profileDialog');
		if (dialog) {
			if (this.isToolboxTalk) {
				dialog.open(item);
			} else {
				const {data: {employee: mainItem}} = item;
				dialog.extraProp('activeId', item.id).open(mainItem);
			}
		}
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onExportAll">
	onExportAll(e, btn) {
		const {getDialogByRef} = this.refs.root;
		const exportDialog = getDialogByRef('exportDialog');
		exportDialog.open();
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onViewSubjects">
	onViewSubjects(e, btn) {
		const {getDialogByRef} = this.refs.root;
		const toolboxTalkSubjectDialog = getDialogByRef('toolboxTalkSubjectDialog');
		toolboxTalkSubjectDialog.open();
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onCreateAttendanceRegister">
	onCreateAttendanceRegister(e, btn) {
		const {getDialogByRef} = this.refs.root;
		const toolboxTalkAttendanceRegisterDialog = getDialogByRef('toolboxTalkAttendanceRegisterDialog');
		toolboxTalkAttendanceRegisterDialog.open();
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
	renderLeftButtons() {
		const {isEmployee, isContractorView} = storage.is;
		const isReadonly = isEmployee;// || isContractorView;
		return <div className="left-buttons pull-left">
			{this.props.onRenderCompetenciesBtb()}
			{!isReadonly && <Button className="btn btn-primary pull-right" onClick={this.onExportAll}>
				Export
			</Button>}
			<Button className="btn btn-primary pull-right" onClick={this.onViewSubjects}>
				Subjects
			</Button>
			<Button className="btn btn-primary pull-right" onClick={this.onCreateAttendanceRegister}>
				Attendance Registers
			</Button>
		</div>;
	}
	
	// </editor-fold>
	
	renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}, evt, btn) {
		const {isEmployee} = this;
		const isEditable = !isEmployee;
		return <Options idx={idx} permissionModKey={this.props.permissionKey}>
			<NavItem action="view" isEmployee={isEmployee} onClick={onView} faIconLeft="eye" title="View"/>
			{isEmployee && <NavItem action="add" btn={btn} onClick={this.onAdd} faIconLeft="plus"
			                        title={`Add Toolbox Talk / Safety Meeting`}/>}
			{isEditable && <NavItem action="edit" btn={btn} onClick={this.onEdit} faIconLeft="edit" title="Edit"/>}
			{isEditable && <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>}
			
			{/*<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>*/}
			{/*<NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>*/}
		</Options>;
	}
	
	renderFilterNode(onChange) {
		return <div className="col-lg-12 controls grid-4 grid-gap-5 -margin-b-35">
			<SelectEmployeeInput name="trainer_list" type="select_multi" placeholder="Trainer(s)..."
			                     className="form-control" onChange={onChange}/>
			<SelectEmployeeInput name="employee_list" type="select_multi" placeholder="Employee(s)..."
			                     className="form-control" onChange={onChange}/>
			<SelectJobPositionInput name="job_position_list" type="select_multi" placeholder="Toolbox Talk Job Position(s)..."
			                        className="form-control" onChange={onChange}/>
			<SelectToolboxTalkSubjectInput name="subject_list" type="select_multi" placeholder="Subject(s)..."
			                               className="form-control" onChange={onChange}/>
			<SelectToolboxTalkSubjectCategoryInput name="subject_category_list" type="select_multi"
			                                       placeholder="Subject Categories..."
			                                       className="form-control" onChange={onChange}/>
			<ClearableInput name="training_frequency" type="select" placeholder="Frequency..." className="form-control"
			                onChange={onChange} values={this.state.lists.frequency} returnValue/>
			<ClearableInput name="date" type="date" placeholder="Date..."
			                className="form-control fixed-flex min-w-185" onChange={onChange}/>
		</div>;
	}
	
	renderTHead() {
		return <THead>
			<div className="td fixed-flex min-w-30">ID</div>
			<div className="td">Toolbox Talk / Training Meeting Subject</div>
			<div className="td">Subject Category</div>
			<div className="td">Institution Conducting Training</div>
			<div className="td">Training Conductor</div>
			<div className="td">Trainer Job Position</div>
			<div className="td fixed-flex min-w-140">Training Frequency</div>
			<div className="td fixed-flex min-w-120">Date</div>
			<div className="td fixed-flex min-w-80">Time From</div>
			<div className="td fixed-flex min-w-80">Time To</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
		</THead>;
	}
	
	renderItem(n, onClick) {
		const item = this.refs.root.list[n];
		const {
			id,
			data: {
				created_at,
				
				subject,
				subject_category,
				training_frequency,
			}
		} = item;
		console.log(item)
		return <TRow key={"item-" + n}>
			<div className="td fixed-flex min-w-30">{id}</div>
			<TData flex={100}>{status || 'N/A'}</TData>
			<TData flex={120}>{training_provider_requirement || 'N/A'}</TData>
			<TData>{hr ? ((hr.fname || hr.data.fname) + ' ' + (hr.lname || hr.data.lname)) : 'N/A'}</TData>
			<TData>{job_title ? job_title.name : 'N/A'}</TData>
			<TData>{subject}</TData>
			<TData flex={100}>{requirement || 'N/A'}</TData>
			<TData flex={50} className="padding-l-10 padding-r-0">
				<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
			</TData>
		</TRow>;
	}
	
	//<editor-fold desc="render">
	render() {
		const {state} = this;
		return <>
			<ViewByButtonsBox
				ref="viewButtonsRefBox"
				state={state}
				titleSingular="Toolbox Talk / Safety Meeting"
				onChange={this.setView}
			/>
			<APageListReadWrite
				hasBackBtn={false}
				ref="root"
				page={this}
				createBtnTitle="Create"
				pageId={this.pageKey + "-tab"}
				pageTitle="Toolbox Talks"
				pageTitleSingular="toolbox talk"
				onLoadList={this.onLoadList}
				noAnimation={true}
				renderLeftButtons={this.renderLeftButtons}
				renderPopoverOptions={this.renderPopoverOptions}
				renderFilterNode={this.renderFilterNode}
				renderTHead={this.renderTHead}
				renderItem={this.renderItem}>
				<ConfirmDialog ref="removeDialog"/>
				
				<NewToolboxTalkDialog ref="newDialog"/>
				<EditToolboxTalkDialog ref="editDialog"/>
				<ProfileToolboxTalkDialog ref="profileDialog"/>
				
				<ToolboxTalkSubjectDialog ref="toolboxTalkSubjectDialog"/>
				<ToolboxTalkAttendanceRegisterDialog ref="toolboxTalkAttendanceRegisterDialog"/>
				<ExportToolboxTalksDialog ref="exportDialog"/>
			</APageListReadWrite>
		</>;
	}
	
	//</editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="ViewByButtonsBox">
@observer
class ViewByButtonsBox extends React.Component {
	
	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);
		
		this.setView = this.setView.bind(this);
	}
	
	// </editor-fold>
	
	setView(value) {
		execWhen(() => this.viewButtonsRef).then(ref => {
			ref.setView(value);
		});
	}
	
	render() {
		const {state: {view}, titleSingular, onChange} = this.props;
		return <MKBox
			width="100%"
			display="flex"
			alignItems="center"
			justifyContent="center"
			margin='10px 0 0px'
			padding="0 0 10px"
			borderBottom="2px solid #ebebeb"
		>
			<ViewByButtons ref={ref => {
				this.viewButtonsRef = ref;
			}} text="Toolbox Talk / Safety Meeting" value={view} name={titleSingular} onChange={onChange}/>
		</MKBox>
	}
}

// </editor-fold>

export default ToolboxTalksTab;
