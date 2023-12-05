//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates} from 'utils/Utils';
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
import SelectToolboxTalkSubjectInput from "../../../../../components/inputs/SelectToolboxTalkSubjectInput";
import SelectToolboxTalkSubjectCategoryInput
	from "../../../../../components/inputs/SelectToolboxTalkSubjectCategoryInput";
import SelectEmployeeInput from "../../../../../components/inputs/SelectEmployeeInput";
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
		loadedSelectLists: false
	};
	//</editor-fold>
	
	//<editor-fold desc="constructor">
	constructor(props) {
		super(props);

		this.onLoadList = this.onLoadList.bind(this);

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

	//<editor-fold desc="onLoadList">
	onLoadList(params = {}) {
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
	
	renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
		return <Options idx={idx} permissionModKey={this.props.permissionKey}>
			<NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
			<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
			<NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
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
			<SelectToolboxTalkSubjectCategoryInput name="subject_category_list" type="select_multi" placeholder="Subject Categories..."
												   className="form-control" onChange={onChange}/>
			<ClearableInput name="training_frequency" type="select" placeholder="Frequency..." className="form-control"
							onChange={onChange} values={this.state.lists.frequency} returnValue/>
			<ClearableInput name="date" type="date" placeholder="Date..."
							className="form-control fixed-flex min-w-185" onChange={onChange}/>
		</div>;
	}
	
	renderTHead() {
		return <THead>
			<TData flex={110}>Date Created</TData>
			<TData flex={100}>Status</TData>
			<TData flex={120}>Accreditation</TData>
			<TData>Training Conductor</TData>
			<TData>Job Title</TData>
			<TData>Subject</TData>
			<TData flex={100}>Requirement</TData>
			<TData flex={60} className="padding-l-0 padding-r-0"/>
		</THead>;
	}
	
	renderItem(n, onClick) {
		const item = this.refs.root.list[n];
		const {
			id,
			data: {
				created_at,
				status,
				training_provider_requirement,
				institution_conducting_training,
				hr,
				job_title,
				subject,
				requirement,
				certificate_expiration
			}
		} = item;
		console.log(item)
		return <TRow key={"item-" + n}>
			<TData flex={110}>{Dates.formatDate(created_at)}</TData>
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
		return <APageListReadWrite
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
		</APageListReadWrite>;
	}
	
	//</editor-fold>
}

export default ToolboxTalksTab;
