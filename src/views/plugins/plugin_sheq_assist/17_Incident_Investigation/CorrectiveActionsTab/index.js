import React from "react";
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';

import {Dates, execWhen} from "utils/Utils";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import {ActionsButton, Button} from 'components/inputs';
import {Table, TBody, THead, TRow} from 'components/tables';

//import NewFormDialog from './dialogs/NewFormDialog.js';
//import EditFormDialog from './dialogs/EditFormDialog.js';
//import ProfileFormDialog from './dialogs/ProfileFormDialog.js';
import style from "./CorrectiveActionsTab.lazy.css";
import StateLists from "../dialogs/IncidentForms/StateLists";
import {IncidentCorrectiveActionsTableRow} from "../dialogs/IncidentComponentRows";
import MKBox from "../../../../../components/MK/MKBox";
import ViewByButtons from "../../../../../components/ViewByButtons";

@observer
class CorrectiveActionsTab extends React.Component {
	pageKey = "CorrectiveActionsTab";
	
	@observable
	state = {
		lists: StateLists,
		view: 'Incident Investigation',
	}
	
	//<editor-fold desc="constructor">
	constructor(props) {
		super(props);
		
		this.onLoadList = this.onLoadList.bind(this);
		
		this.setView = this.setView.bind(this);
		this.onView && (this.onView = this.onView.bind(this));
		
		this.renderItem = this.renderItem.bind(this);
		this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
	}
	
	//</editor-fold>
	
	//<editor-fold desc="componentWillMount, componentWillUnmount">
	componentWillMount() {
		style.use();
	}
	
	componentDidMount() {
		const {view} = this.state;
		this.setView({view, load: false});
	}
	
	componentWillUnmount() {
		style.unuse();
	}
	
	//</editor-fold>
	
	//<editor-fold desc="onLoadList">
	onLoadList(params = {}) {
		const {page, lastItem, filterData, filtered, isNew} = params;
		const {} = filterData || {};
		
		const listByLogged = sockets.of('corrective-actions').fn('listByLogged');
		
		return listByLogged({
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
	async setView({view = 'Incident Investigation', load = true}) {
		let ref;
		if (this.refs.viewButtonsRefBox) {
			ref = this.refs.viewButtonsRefBox;
		} else {
			ref = await execWhen(() => this.refs.viewButtonsRefBox);
		}
		
		const {view: old_view,} = this.state;
		
		console.log('setView', this);
		console.log('setView view', old_view, view);
		
		if (old_view !== view) {
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
		console.log("list", this.isIncidentInvestigation, list.slice())
		const dialog = this.refs.root.getDialogByRef('profileDialog');
		if (dialog) {
			if (this.isIncidentInvestigation) {
				dialog.open(item);
			} else {
				const {data: {employee: employeeItem}} = item;
				dialog.extraProp('activeId', item.id).open(employeeItem);
			}
		}
	}
	
	// </editor-fold>
	
	@computed get isIncidentInvestigation() {
		return this.state.view === "Incident Investigation";
	}
	
	onClick(e, btn) {
		$(btn.getDOMNode()).closest('.tr-table').find('.table').toggleClass("active");
	}
	
	//<editor-fold desc="renderPopoverOptions">
	renderPopoverOptions(_idx, _actions, e, btn) {
		const {idx, corrective_actions} = btn.props;
		const item = corrective_actions[idx];
		let {group, sub_group, cause_name, text, cost, responsible_person, date_completed, status = []} = item;
		status = isArray(status) || isObservableArray(status) ? status : [];
		const onView = (e, el) => {
		
		};
		const onEdit = (e, el) => {
		
		};
		const onRemove = (e, el) => {
		
		};
		
		const onProgressNotes = (e, el) => {
			const {idx} = el.props;
			const item = this.refs.root.list[idx];
			//        this.refs.newInvestigationDialog.open(item);
		};
		
		const onCloseCorrectiveAction = (e, el) => {
			const {idx} = el.props;
			const item = this.refs.root.list[idx];
			//        const {investigation} = item.data;
			confirmDialog.open("Are you sure you want to close the corrective action?").then(res => {
				if (res === 1) {
					//                progressDialog.open("Closing the corrective action...");
					//                neonBinding.events.emit(this.path + "add-status", item.id, "ClosedCorrectiveAction").then(res => {
					//                    progressDialog.close();
					//                    console.log("res", res)
					//                    if(!investigation.status) {
					//                        extendObservable(investigation, {status: ['ClosedCorrectiveAction']});
					//                    }
					//                    setTimeout(() => {
					//                        investigation.status.push('ClosedCorrectiveAction');
					//                    }, 2000);
					//                    infoDialog.open("Corrective Action successfully closed.");
					//                    infoDialog.close(2000);
					//                });
				}
			});
		};
		
		const onReOpen = (e, el) => {
			//        const {investigation} = item.data;
			confirmDialog.open("Are you sure you want to re-open the corrective action?").then(res => {
				if (res === 1) {
					//                progressDialog.open("Re-opening the corrective action...");
					//                neonBinding.events.emit(this.path + "remove-status", item.id, "ClosedCorrectiveAction").then(res => {
					//                    progressDialog.close();
					//                    console.log("res", res)
					//                    setTimeout(() => {
					//                        investigation.status.remove('ClosedCorrectiveAction');
					//                    });
					//                    infoDialog.open("Corrective Action successfully re-opened.");
					//                    infoDialog.close(2000);
					//                });
				}
			})
		};
		
		const {Options} = _actions;
		
		return <Options idx={idx} permissionModKey={this.props.permissionKey}>
			<NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
			<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
			<NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
			<hr action="writable"/>
			{!status.contains('ClosedCorrectiveAction') && <React.Fragment>
				<NavItem action="writable" idx={idx} onClick={onProgressNotes} faIconLeft="edit" title="Progress Notes"/>
			</React.Fragment>}
			
			{!status.contains('ClosedCorrectiveAction') &&
				<NavItem action="writable" idx={idx} onClick={onCloseCorrectiveAction} faIconLeft="ban"
				         title="Close Corrective Action"/>}
			{status.contains('ClosedCorrectiveAction') &&
				<NavItem action="writable" idx={idx} onClick={onReOpen} faIconLeft="edit" title="Re-Open Corrective Action"/>}
		</Options>;
	}
	
	//</editor-fold>
	
	//<editor-fold desc="renderFilterNode">
	renderFilterNode(onChange) {
		return <div className="col-lg-12 controls flex">
			{/*<ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
            <ClearableInput name="type" type="radio" placeholder="Type" className="form-control" onChange={onChange} values={this.state.lists.type}/>
            <ClearableInput name="scheduled" type="radio" placeholder="Scheduled" className="form-control" onChange={onChange} values={this.state.lists.scheduled}/>*/}
		</div>;
	}
	
	//</editor-fold>
	
	//<editor-fold desc="renderTHead">
	renderTHead() {
		const {isIncidentInvestigation} = this;
		if(isIncidentInvestigation) {
			return <THead>
				<div className="td fixed-flex min-w-120">Incident Date</div>
				<div className="td fixed-flex min-w-140">Investigation Date</div>
				<div className="td">Group</div>
				<div className="td">Category</div>
				<div className="td">Sub-Category</div>
				<div className="td">Activities</div>
				<div className="td">Description</div>
				<div className="td">Location</div>
				<div className="td fixed-flex min-w-170 padding-l-0 padding-r-0"></div>
			</THead>;
		}
		
		return <THead>
			<div className="td fixed-flex min-w-120">Incident Date</div>
			<div className="td fixed-flex min-w-140">Investigation Date</div>
			<div className="td">Incident Group</div>
			<div className="td">Incident Category</div>
			<div className="td">Incident Description</div>
			<div className="td fixed-flex min-w-120">Cause Type</div>
			<div className="td">Cause Sub-Type</div>
			<div className="td">Cause</div>
			<div className="td">Corrective Action</div>
			<div className="td fixed-flex min-w-80">Cost</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
		</THead>;
	}
	
	//</editor-fold>
	
	//<editor-fold desc="renderItem">
	renderItem(n, onClick) {
		const {view} = this.state;
		const item = this.refs.root.list[n];
		return <IncidentCorrectiveActionsTableRow key={item.id} idx={n} item={item} view={view} onClick={onClick}/>;
	}
	
	//</editor-fold>
	
	//<editor-fold desc="render">
	render() {
		const {state} = this;
//        const {permissions_other} = storage.loggedUser.user.data;
//        const permissions_other_ContractorForms = (permissions_other || []).find(v => v.key === "Contractor Forms");
		return <>
			<ViewByButtonsBox
				ref="viewButtonsRefBox"
				state={state}
				titleSingular="Incident Investigation"
				onChange={this.setView}
			/>
			<APageListReadWrite
				hasBackBtn={false}
				ref="root"
				page={this}
				createBtnTitle="Create"
				pageId={this.pageKey + "-tab"}
				pageTitle="Corrective Actions"
				pageTitleSingular="corrective action"
				onLoadList={this.onLoadList}
				noAnimation={true}
				renderPopoverOptions={this.renderPopoverOptions}
				renderFilterNode={this.renderFilterNode}
				renderTHead={this.renderTHead}
				renderItem={this.renderItem}>
				{/*Permissions.allowRemove(permissions_other_ContractorForms) && !storage.is.isEmployee && <ConfirmDialog ref="removeDialog"/>*/}
				{/*Permissions.allowCreate(permissions_other_ContractorForms) && !storage.is.isEmployee && <NewFormDialog ref="newDialog"/>*/}
				{/*Permissions.allowView(permissions_other_ContractorForms) && <ProfileFormDialog ref="profileDialog"/>*/}
				{/*<ConfirmDialog ref="removeDialog"/>
            <NewFormDialog ref="newDialog"/>
            <EditFormDialog ref="editDialog"/>
            <ProfileFormDialog ref="profileDialog"/>*/}
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
			}} text="Incident Investigation" value={view} name={titleSingular} onChange={onChange}/>
		</MKBox>
	}
}

// </editor-fold>

export default CorrectiveActionsTab;
