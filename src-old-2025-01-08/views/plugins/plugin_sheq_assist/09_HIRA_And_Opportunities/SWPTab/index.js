import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./SWPTab.lazy.css";

import {Dates} from "utils/Utils";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, Button, ClearableInput, SelectDepartmentInput, SelectEmployeeInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewSWPDialog from './forms/NewSWPDialog';
import ProfileSWPDialog from './forms/ProfileSWPDialog';
import EditSWPDialog from './forms/EditSWPDialog';
import ExportSWPDialog from "./forms/ExportSWPDialog";
import AList from "views/AList";

@observer
class SWPTab extends AList {
	
	pageKey = "SWPTab";
	@observable
	state = {
		lists: {}
	};
	
	constructor(props) {
		super(props);
	}
	
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
			category,
			work_task,
			location,
			department_list,
			person_approving_procedure_list,
			sign_sheet_employee_list,
			expiry_range,
		} = filterData || {};
		
		const listByLogged = sockets.of('hira-and-opportunities/swp').fn('listByLogged');
		
		return listByLogged({
			category,
			work_task,
			location,
			department_list,
			person_approving_procedure_list,
			sign_sheet_employee_list,
			expiry_range,
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
	
	// <editor-fold defaultstate="collapsed" desc="onExport">
	onExport(e, btn) {
		const {getDialogByRef} = this.refs.root;
		const exportDialog = getDialogByRef('exportDialog');
		exportDialog.open();
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
	renderLeftButtons() {
		const {isEmployee, isContractorView} = storage.is;
		const isReadonly = isEmployee;// || isContractorView;
		return <div className="left-buttons pull-left">
			{!isReadonly && <Button className="btn btn-primary pull-right" onClick={this.onExport}>
				Export
			</Button>}
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
		return <div className="col-lg-12 controls flex">
			<ClearableInput name="category" type="text" placeholder="Category" className="form-control" onChange={onChange}/>
			<ClearableInput name="work_task" type="text" placeholder="Work Task" className="form-control"
			                onChange={onChange}/>
			<ClearableInput name="location" type="text" placeholder="Area activity takes place" className="form-control" onChange={onChange}/>
			<SelectDepartmentInput name="department_list" type="select_multi" placeholder="Department activity takes place..." className="form-control"
			                       onChange={onChange}/>
			<SelectEmployeeInput name="person_approving_procedure_list" type="select_multi" placeholder="Person(s) Approving Procedure..."
			                     className="form-control" onChange={onChange}/>
			<SelectEmployeeInput name="sign_sheet_employee_list" type="select_multi" placeholder="Sign Sheet Name List..."
			                     className="form-control" onChange={onChange}/>
		</div>;
	}
	
	renderTHead() {
		return <THead>
			<div className="td fixed-flex min-w-40">ID</div>
			<div className="td fixed-flex min-w-120">Date Created</div>
			<div className="td">Category</div>
			<div className="td">Work Task</div>
			<div className="td">Location</div>
			<div className="td">Department</div>
			<div className="td">Person Approving</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
		</THead>;
	}
	
	renderItem(n, onClick) {
		const item = this.refs.root.list[n];
		const {id, data: {created_at, category, work_task, location, department, person_approving_procedure, doc}} = item;
		console.log('swp', item)
		return <TRow key={"item-" + n}>
			<div className="td fixed-flex min-w-40">{id}</div>
			<div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
			<div className="td">{category}</div>
			<div className="td">{work_task}</div>
			<div className="td">{location}</div>
			<div className="td">{department ? department.name : "N/A"}</div>
			<div className="td">{person_approving_procedure && person_approving_procedure.full_name || "N/A"}</div>
			<div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
				<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
			</div>
		</TRow>;
	}
	
	render() {
		return <APageListReadWrite
			hasBackBtn={false}
			ref="root"
			page={this}
			createBtnTitle="Create"
			pageId={this.pageKey + "-tab"}
			pageTitle="Safe Work Procedure"
			pageTitleSingular="safe work procedure"
			onLoadList={this.onLoadList}
			noAnimation={true}
			renderLeftButtons={this.renderLeftButtons}
			renderPopoverOptions={this.renderPopoverOptions}
			renderFilterNode={this.renderFilterNode}
			renderTHead={this.renderTHead}
			renderItem={this.renderItem}>
			<ConfirmDialog ref="removeDialog"/>
			
			<ProfileSWPDialog ref="profileDialog"/>
			<NewSWPDialog ref="newDialog"/>
			<EditSWPDialog ref="editDialog"/>
			
			<ExportSWPDialog ref="exportDialog"/>
		</APageListReadWrite>;
	}
}

export default SWPTab;
