// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable, observable} from 'mobx';

import {Dates, execWhen, getRandomRolor} from 'utils/Utils';
import {renderLeftButtonsForExpiryOnly} from 'utils/ComponentUtils';
import ADialogList from "views/ADialogList";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {Button, ClearableInput, DateRangeInput, SelectEmployeeInput, SelectJobPositionInput} from 'components/inputs';
import {THead} from 'components/tables';

import {NewNCRDialog, EditNCRDialog, ProfileNCRDialog} from '../forms';

import ProfileSiteDialog from 'views/plugins/plugin_general/Sites/ProfileDialog.js';
import ProfileAuditDialog
	from 'views/plugins/plugin_sheq_assist/21_Internal_Audit/AuditTab/forms/ProfileAuditDialog.js';
import ProfileIncidentDialog
	from 'views/plugins/plugin_sheq_assist/17_Incident_Investigation/dialogs/ProfileIncidentDialog.js';

import NCRRenderRow from "./NCRRenderRow";
import ExportNCRDialog from "./ExportNCRDialog";

import style from "./NCRItemListDialog.lazy.css";
import byLogged from "../NCRTab/Query/List/listAllNCRByLogged";
import updateNCR from "mutations/all/NCR/updateNCR";

// </editor-fold>

@observer
class NCRItemListDialog extends ADialogList {
	// <editor-fold defaultstate="collapsed" desc="fields">
	pageKey = "NCRItemListDialog";
	title = "Non-Conformances";

	@observable
	selfState = {
		lists: {
			type: ['Corrective Action', 'Preventative Action', 'Opportunity For Improver'],
			priority: ['Low', 'Medium', 'High', 'Critical'],
			allocation: ['NCR', 'Finding', 'Observation', 'Deviation'],
			status_progress: ['Pending', 'Progressed', 'Approved', 'Rejected', 'Completed'],
			status_acceptance: ['Pending', 'Approved', 'Rejected'],
			responsible_party_list: ['Consultant', 'Client', 'External'],
			result: ['Pass', 'Fail'].map(text => {
				return {text, value: text, checked: false}
			}),
			source: ['Site Audit', 'Compliance Audit', 'Inspection', 'Incident Investigation']
		},
		source: null,
		expiry_date: 'ALL',
	};
	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);
		
		this.onRemoved = this.onRemoved.bind(this);
		
		this.setView = this.setView.bind(this);

		this.onApprove = this.onApprove.bind(this);
		this.onReject = this.onReject.bind(this);
		this.onProgress = this.onProgress.bind(this);
		this.onComplete = this.onComplete.bind(this);

		this.onExport = this.onExport.bind(this);
		this.onViewItemSource = this.onViewItemSource.bind(this);

		this.renderFilterNode = this.renderFilterNode.bind(this);
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="mounts">
	componentWillMount() {
		style.use();
	}

	componentWillUnmount() {
		style.unuse();
	}

	// </editor-fold>

	//<editor-fold desc="onApprove">
	onApprove(e, el) {
		const {idx} = el.props;
		const item = this.refs.root.list[idx];
		confirmDialog.open("Are you sure you want to approve the non-conformance?").then(res => {
			if (res === 1) {
				progressDialog.open("Approving the non-conformance...");
				updateNCR({id: item.id, status_acceptance: "Approved"}).then(res => {
					progressDialog.close();
					console.log("res", res)
					setTimeout(() => {
						extendObservable(item.data, {status_acceptance: 'Approved'});
					});
					infoDialog.open("Non-Conformance successfully approved.");
					infoDialog.close(2000);
				});
			}
		})
	}

	//</editor-fold>

	//<editor-fold desc="onReject">
	onReject(e, el) {
		const {idx} = el.props;
		const item = this.refs.root.list[idx];
		confirmDialog.open("Are you sure you want to reject the non-conformance?").then(res => {
			if (res === 1) {
				progressDialog.open("Rejecting the non-conformance...");
				updateNCR({id: item.id, status_acceptance: "Rejected"}).then(res => {
					progressDialog.close();
					console.log("res", res)
					setTimeout(() => {
						extendObservable(item.data, {status_acceptance: 'Rejected'});
					});
					infoDialog.open("Non-Conformance successfully rejected.");
					infoDialog.close(2000);
				});
			}
		});
	}

	//</editor-fold>

	//<editor-fold desc="onProgress">
	onProgress(e, el) {
		const {idx} = el.props;
		const item = this.refs.root.list[idx];
		confirmDialog.open("Are you sure you want to progress the non-conformance?").then(res => {
			if (res === 1) {
				const {getDialogByRef} = this.refs.root;
				const profileDialog = getDialogByRef("profileDialog");
				profileDialog && profileDialog.extraProp('view', "Progressed").open(item);
			}
		});
	}

	//</editor-fold>

	//<editor-fold desc="onComplete">
	onComplete(e, el) {
		const {idx} = el.props;
		const item = this.refs.root.list[idx];
		confirmDialog.open("Are you sure you want to close the non-conformance?").then(res => {
			if (res === 1) {
				const {getDialogByRef} = this.refs.root;
				const profileDialog = getDialogByRef("profileDialog");
				profileDialog && profileDialog.extraProp('view', "Completed").open(item);
			}
		});
	}

	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onExport">
	onExport(evt, btn) {
		const {getDialogByRef} = this.refs.root;
		const {source} = this.selfState;
		const exportNCRDialog = getDialogByRef('exportNCRDialog');
		exportNCRDialog.extraProp('source', source).open();
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onViewItemSource">
	onViewItemSource(evt, btn) {
		const {idx} = btn.props;
		const item = this.refs.root.list[idx];

		const {source} = this.selfState;

		const {getDialogByRef} = this.refs.root;

		let name;
		if (source === "Site Audit") {
			name = "profileSiteDialog";
		} else if (source === "Compliance Audit") {
			name = "profileAuditDialog";
		} else if (source === "Inspection") {
//            name = "";
		} else if (source === "Incident Investigation") {
			name = "profileIncidentDialog";
		}

		const {selected_source_ref} = item.data;
		if (!selected_source_ref) {
			infoDialog.open(`Selected item is not attached to any ${source} from the system.`);
			return;
		}

		const profileDialog = getDialogByRef(name);
		profileDialog && profileDialog.open(selected_source_ref);
	}

	// </editor-fold>

	//<editor-fold desc="onLoadList">
	onLoadList(params = {}) {
		const {selfState: {expiry_date}} = this;
		const source = this.extraProp('source');
		this.selfState.source = source;

		const {page, lastItem, filterData, filtered, isNew} = params;
		const {
			responsible_party_list,
			assigned_job_position_list,
			assigned_person_list,
			approving_person_list,
			type,
			priority,
			allocation,
			status_progress,
			status_acceptance,
			result,
			due_date_range,
			progress_date_range,
			completed_date_range,
		} = filterData || {};

		const mon = Dates.formatDateSQL(new Date().addMonths(1));
		const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
		const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

		const limit = 50;

		const args = {
			removed: false,
			expiry_date,
			mon, mon2, mon3,
			source,
			responsible_party_list,
			assigned_job_position_list: assigned_job_position_list && assigned_job_position_list.map(({id}) => id),
			assigned_person_list: assigned_person_list && assigned_person_list.map(({id}) => id),
			approving_person_list: approving_person_list && approving_person_list.map(({id}) => id),
			type,
			priority,
			allocation,
			status_progress,
			status_acceptance,
			result,
			due_date_range,
			progress_date_range,
			completed_date_range,
			//
			limit,
			//
			exact_orgs: true,
		};

		if (!isNew) {
			args.offset = this.refs.root.list.length;
		} else {
			args.offset = 0;
		}

		return byLogged(args).then((res) => {
			console.log('onLoadList res', res)
			return res;
		});
	}

	//</editor-fold>
	onRemoved(item) {
		this.refs.root.list.removeIf((v, n) => v.id === item.id);
	}

	//<editor-fold desc="setView">
	async setView({expiry_date = 'ALL', load = true}) {
		this.selfState.expiry_date = expiry_date;

		if (load) {
			this.refs.root.load();
		}
	}

	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
	renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
		const {permissionKey} = this.props;
		const item = this.refs.root.list[idx];
		const {
			selected_source_ref,
			assigned_job_position_list,
			assigned_person_list,
			approving_person,
			status_progress,
			status_acceptance
		} = item.data;

		const {id: user_uid, data: {linked_employee}} = storage.loggedUser.user;

		const isResponsible = () => {
			if (assigned_job_position_list || assigned_person_list) {
				if (
					linked_employee &&
					linked_employee.job_position &&
					assigned_job_position_list &&
					assigned_job_position_list.anyMatch(({job_position_id}) => linked_employee.job_position.id === job_position_id)
				) {
					return true;
				}
				if (assigned_person_list.anyMatch(({employee: {linked_user_id}}) => linked_user_id === user_uid)) {
					return true;
				}
			}
			return false;
		};

		const isApproving = () => {
			return approving_person && user_uid === approving_person.id;
		};

		return <Options idx={idx} permissionModKey={permissionKey}>
			<NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
			<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
			<NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
			{isResponsible() && <>
				<hr/>
				{
					status_progress !== 'Progressed' && status_progress !== 'Completed' && (
						<NavItem idx={idx} onClick={this.onProgress} faIconLeft="check" title="Progressed"/>
					)
				}
				{
					status_progress !== 'Completed' && (
						<NavItem idx={idx} onClick={this.onComplete} faIconLeft="check" title="Complete"/>
					)
				}
			</>}
			{isApproving() && <>
				<hr/>
				{
					status_acceptance !== 'Approved' && (
						<NavItem idx={idx} onClick={this.onApprove} faIconLeft="check" title="Approve"/>
					)
				}
				{
					status_acceptance !== 'Rejected' && (
						<NavItem idx={idx} onClick={this.onReject} faIconLeft="check" title="Reject"/>
					)
				}
			</>}
			{selected_source_ref &&
				<NavItem idx={idx} action="view" onClick={this.onViewItemSource} faIconLeft="eye" title="View NCR Source"/>}
			{selected_source_ref && <hr/>}
		</Options>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderFilterNode">
	renderFilterNode(onChange) {
		const {
			responsible_party_list,
			type,
			priority,
			allocation,
			source,
			status_progress,
			status_acceptance,
			result,
		} = this.selfState.lists;
		return <div className="col-lg-12 controls">
			<DateRangeInput name="due_date_range" className="col-lg-4 h-105 grid-6 margin-b-10 form-control"
			                placeholder="Due Date" onChange={onChange}>
				<label className="min-w-60">From</label>
				<label className="min-w-50">To</label>
			</DateRangeInput>
			<DateRangeInput ref="progress_date_range" name="progress_date_range"
			                className="col-lg-4 h-105 grid-6 margin-b-10 form-control"
			                placeholder="Progress Date" onChange={onChange}>
				<label className="min-w-65">From</label>
				<label className="min-w-50">To</label>
			</DateRangeInput>
			<DateRangeInput name="completed_date_range" className="col-lg-4 h-105 grid-6 margin-b-10 form-control"
			                placeholder="Date Completed" onChange={onChange}>
				<label className="min-w-60">From</label>
				<label className="min-w-50">To</label>
			</DateRangeInput>

			<ClearableInput name="priority" type="select" placeholder="Priority..."
			                className="col-lg-2 margin-b-10 form-control" onChange={onChange}
			                values={priority} returnValue/>
			<ClearableInput name="allocation" type="select" placeholder="Allocation..."
			                className="col-lg-2 margin-b-10 form-control" onChange={onChange}
			                values={allocation} returnValue/>
			<ClearableInput name="status_progress" type="select" placeholder="Progress Status..."
			                className="col-lg-2 margin-b-10 form-control" onChange={onChange}
			                values={status_progress} returnValue/>

			<ClearableInput name="status_acceptance" type="select" placeholder="Acceptance Status..."
			                className="col-lg-3 margin-b-10 form-control" onChange={onChange}
			                values={status_acceptance} returnValue/>
			<ClearableInput ref="result" name="result" type="radio" placeholder="Result"
			                className="col-lg-3 margin-b-10 form-control" onChange={onChange}
			                values={result} returnValue/>

			<ClearableInput name="responsible_party_list" type="select_multi" placeholder="Responsible Party..."
			                className="col-lg-4 margin-b-10 form-control" onChange={onChange}
			                values={responsible_party_list} returnValue add/>
			<SelectJobPositionInput name="assigned_job_position_list" placeholder="Assigned Job Position..."
			                        type="select_multi"
			                        className="col-lg-4 form-control" onChange={onChange} add={false}/>
			<SelectEmployeeInput name="assigned_person_list" placeholder="Assigned Person..."
			                     type="select_multi"
			                     className="col-lg-4 margin-b-10 form-control" onChange={onChange}/>

			<SelectEmployeeInput name="approving_person_list" placeholder="Approving Person..." type="select_multi"
			                     className="col-lg-4 form-control" onChange={onChange}/>
			<ClearableInput ref="source" name="source" type="select" placeholder="Source..."
			                className="col-lg-4 form-control" onChange={onChange} values={source} returnValue/>
			<ClearableInput name="type" type="select" placeholder="Type..."
			                className="col-lg-4 form-control" onChange={onChange} values={type} returnValue/>
		</div>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderDefaultLeftButtons">
	renderDefaultLeftButtons() {
		const {isEmployee, isContractorView} = storage.is;
		const isReadonly = isEmployee;// || isContractorView;
		return !isReadonly && <div className="left-buttons pull-left padding-l-10">
			<Button className="btn btn-primary pull-right" onClick={this.onExport}>
				Export
			</Button>
		</div>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderTHead">
	renderTHead() {
		return <THead>
			<div className="td fixed-flex min-w-20">#</div>
			<div className="td fixed-flex min-w-100">Due Date</div>
			<div className="td fixed-flex min-w-130">Date Completed</div>
			<div className="td fixed-flex min-w-70">Priority</div>
			<div className="td fixed-flex min-w-180">Type</div>
			<div className="td fixed-flex min-w-120">Allocation</div>
			<div className="td">Finding/NCR Description</div>
			<div className="td fixed-flex min-w-180">Responsible Party</div>
			<div className="td fixed-flex min-w-180">Assigned To</div>
			<div className="td fixed-flex min-w-140">Progress Status</div>
			<div className="td fixed-flex min-w-60">Result</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
		</THead>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderItem">
	renderItem(n, onClick) {
		const item = this.refs.root.list[n];
		const {source} = this.selfState;
		return <NCRRenderRow key={item.id} idx={n} item={item} source={source} onClick={onClick}/>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderPage">
	renderPage() {
		return <APageListReadWrite
			ref="root"
			page={this}
			createBtnTitle="Create"
			pageId={this.pageKey + '-page'}
			listCountTopTitle="non-conformance"
			pageTitleSingular="non-conformance"
			noAnimation={true}
			onLoadList={this.onLoadList}
			renderDefaultLeftButtons={renderLeftButtonsForExpiryOnly.bind(this)}
			renderLeftButtons={this.renderDefaultLeftButtons}
			renderPopoverOptions={this.renderPopoverOptions}
			renderFilterNode={this.renderFilterNode}
			renderTHead={this.renderTHead}
			renderItem={this.renderItem}>
			<TitlePanel state={this.selfState}/>

			<ConfirmDialog ref="removeDialog" onSoftDelete={updateNCR}/>

			<NewNCRDialog ref="newDialog"/>
			<EditNCRDialog ref="editDialog" onRemoved={this.onRemoved}/>
			<ProfileNCRDialog ref="profileDialog" onRemoved={this.onRemoved}/>

			<ProfileSiteDialog ref="profileSiteDialog"/>
			<ProfileAuditDialog ref="profileAuditDialog"/>
			<ProfileIncidentDialog ref="profileIncidentDialog"/>

			<ExportNCRDialog ref="exportNCRDialog"/>
		</APageListReadWrite>;
	}

	// </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="TitlePanel">
@observer
class TitlePanel extends React.Component {

	render() {
		const {state: {source}} = this.props;
		if (!source) return null;
		const style = {background: getRandomRolor()};
		return <>
			<div style={style} className="TitlePanel flex margin-10 padding-20 color_white b">
				{source} Non-Comformances
			</div>
			<div className="TitlePanel-message text-center">
				Non-Conformances below are are listed per <b>{source}</b>
			</div>
		</>;
	}
}

// </editor-fold>

export default NCRItemListDialog;
