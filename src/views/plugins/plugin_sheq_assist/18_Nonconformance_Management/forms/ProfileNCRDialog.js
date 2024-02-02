// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable, observable} from 'mobx';

import {AProfileDialog} from 'components/dialogs';
import {TRow} from 'components/tables';
import {
	ActionsButton,
	AddFilesGridViewInput,
	Button,
	ClearableInput,
	ProfileField
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import InspectionTableRow from 'views/plugins/plugin_sheq_assist/Inspections/InspectionTab/InspectionTableRow';

import AuditTableRow from 'views/plugins/plugin_sheq_assist/21_Internal_Audit/AuditTab/AuditTableRow';
import {IncidentTableRow} from 'views/plugins/plugin_sheq_assist/17_Incident_Investigation/dialogs/IncidentComponentRows';

import ProfileSiteDialog from 'views/plugins/plugin_general/Sites/ProfileDialog.js';
import ProfileAuditDialog from 'views/plugins/plugin_sheq_assist/21_Internal_Audit/AuditTab/forms/ProfileAuditDialog.js';
import ProfileIncidentDialog from 'views/plugins/plugin_sheq_assist/17_Incident_Investigation/dialogs/ProfileIncidentDialog.js';

import style from "./ProfileNCRDialog.lazy.css";
import NewNCRProgressListTable from "components/FormTableComponents/NewNCRProgressListTable";
import {Dates, execWhen, ShouldUpdate} from "utils/Utils";
import Form from "utils/Form";
import EditNCRDialog from "./EditNCRDialog";
import {CircularProgress} from "@mui/material";
import findByIdNCR from "mutations/all/NCR/findByIdNCR";
import updateNCR from "mutations/all/NCR/updateNCR";
import findByIdAudit from "mutations/all/AuditsAndInspections/Audit/findByIdAudit";
import findByIdIncident from "mutations/all/Incident/findByIdIncident";
import findByIdInspectionsQuestionnaire
	from "mutations/all/Questionnaires/InspectionsQuestionnaires/findByIdInspectionsQuestionnaire";
import findByIdSite from "mutations/all/Site/findByIdSite";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog, DialogTitle, DialogTopButtons">
// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
	pageKey = "ProfileNCRDialog";
	className = 'ANewTableFormDialog';
	findById = findByIdNCR;
	removeById = updateNCR;
	
	//<editor-fold desc="constructor">
	constructor(props) {
		super(props, style);
		
		this.onApprove = this.onApprove.bind(this);
		this.onReject = this.onReject.bind(this);
		this.onProgress = this.onProgress.bind(this);
		this.onComplete = this.onComplete.bind(this);
	}
	
	//</editor-fold>
	
	//<editor-fold desc="title">
	get title() {
		const {controls} = this.refs;
		if (!controls) {
			return execWhen(() => this.refs.controls).then(controls => {
				const {state} = controls;
				return <DialogTitle state={state}/>;
			});
		} else {
			const {state} = controls;
			return <DialogTitle state={state}/>;
		}
	}
	
	//</editor-fold>
	
	//<editor-fold desc="controls">
	get controls() {
		return Controls;
	}
	
	//</editor-fold>
	
	//<editor-fold desc="onEdit">
	onEdit(evt, btn) {
		const {editDialog} = this.refs.controls.refs;
		editDialog && editDialog.open(this.state.item);
	}
	
	//</editor-fold>
	
	//<editor-fold desc="onApprove">
	onApprove(e, el) {
		const {item} = this.state;
		confirmDialog.open("Are you sure you want to approve the non-conformance?").then(res => {
			if (res === 1) {
				progressDialog.open("Approving the non-conformance...");
				updateNCR({id: item.id, status_acceptance: 'Approved'}).then(res => {
					console.log("res", res)
					setTimeout(() => {
						extendObservable(item.data, {status_acceptance: 'Approved'});
					});
					infoDialog.open("Non-Conformance successfully approved.");
					infoDialog.close(2000);
				}).finally(() => {
					progressDialog.close();
				});
			}
		})
	}
	
	//</editor-fold>
	
	//<editor-fold desc="onReject">
	onReject(e, el) {
		const {item} = this.state;
		confirmDialog.open("Are you sure you want to reject the non-conformance?").then(res => {
			if (res === 1) {
				progressDialog.open("Rejecting the non-conformance...");
				updateNCR({id: item.id, status_acceptance: 'Rejected'}).then(res => {
					console.log("res", res)
					setTimeout(() => {
						extendObservable(item.data, {status_acceptance: 'Rejected'});
					});
					infoDialog.open("Non-Conformance successfully rejected.");
					infoDialog.close(2000);
				}).finally(() => {
					progressDialog.close();
				});
			}
		});
	}
	
	//</editor-fold>
	
	//<editor-fold desc="onProgress">
	onProgress(e, el) {
		const {item} = this.state;
		confirmDialog.open("Are you sure you want to progress the non-conformance?").then(res => {
			if (res === 1) {
				this.refs.controls.state.view = "Progressed";
			}
		});
	}
	
	//</editor-fold>
	
	//<editor-fold desc="onComplete">
	onComplete(e, el) {
		const {item} = this.state;
		confirmDialog.open("Are you sure you want to close the non-conformance?").then(res => {
			if (res === 1) {
				this.refs.controls.state.view = "Completed";
			}
		});
	}
	
	//</editor-fold>
	
	//<editor-fold desc="topButtons">
	get topButtons() {
		const {controls} = this.refs;
		const onRender = controls => {
			return <DialogTopButtons
				state={controls.state}
				mainState={this.state}
				onProgress={this.onProgress}
				onComplete={this.onComplete}
				onApprove={this.onApprove}
				onReject={this.onReject}
				onEdit={this.onEdit}
				onCancel={this.onCancel}
			/>;
		};
		if (controls) {
			return onRender(controls);
		} else {
			return execWhen(() => this.refs.controls).then(onRender);
		}
	}
	
	//</editor-fold>
}

// </editor-fold>

//<editor-fold desc="DialogTitle">
const DialogTitle = observer(({state}) => {
	const {view} = state;
	let t = "NCR Profile";
	if (view !== 'Profile') {
		t += view ? ` (${view})` : "";
	}
	return t;
});
//</editor-fold>

//<editor-fold desc="DialogTopButtons">
const DialogTopButtons = observer((
	{
		state,
		mainState,
		onProgress,
		onComplete,
		onApprove,
		onReject,
		onEdit,
		onCancel
	}
) => {
	const {item} = mainState;
	if (!item) return null;
	
	const {
		id, data: {
			selected_source,
			assigned_job_position_list,
			assigned_person_list,
			approving_person,
			status_progress,
			status_acceptance
		}
	} = item;
	
	const {view} = state;
	
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
	
	return <>
		{isResponsible() && <>
			{status_progress !== 'Progressed' && status_progress !== 'Completed' && view !== "Progressed" &&
				<Button className="btn btn-primary" onClick={onProgress}>
					<i className="fa fa-check icon-left"/>Progress
				</Button>}
			{status_progress !== 'Completed' && view !== "Completed" &&
				<Button className="btn btn-primary" onClick={onComplete}>
					<i className="fa fa-check icon-left"/>Complete
				</Button>}
			{status_progress !== 'Progressed' && status_progress !== 'Completed' &&
				view !== "Progressed" && view !== "Completed" && <hr/>}
		</>}
		{isApproving() && <>
			{status_acceptance !== 'Approved' && <Button className="btn btn-primary" onClick={onApprove}>
				<i className="fa fa-check icon-left"/>Approve
			</Button>}
			{status_acceptance !== 'Rejected' && <Button className="btn btn-primary" onClick={onReject}>
				<i className="fa fa-check icon-left"/>Reject
			</Button>}
			{status_acceptance !== 'Approved' && status_acceptance !== 'Rejected' && <hr/>}
		</>}
		{onEdit && <Button className="btn btn-primary" onClick={onEdit}>
			<i className="fa fa-pen icon-left"/>Edit
		</Button>}
		<hr/>
		<Button className="btn btn-primary cancel" onClick={onCancel}>Cancel</Button>
	</>;
});
//</editor-fold>
// </editor-fold>

@observer
class Controls extends React.Component {
	
	// <editor-fold defaultstate="collapsed" desc="fields">
	@observable
	state = {
		lists: {
			status_progress: ['Pending', 'Progressed', 'Completed'].map(text => {
				return {text, value: text, checked: false}
			}),
			status_acceptance: ['Pending', 'Approved', 'Rejected'].map(text => {
				return {text, value: text, checked: false}
			}),
			result: ['Pass', 'Fail'].map(text => {
				return {text, value: text, checked: false}
			}),
		},
		view: 'Profile',
		
	};
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);
		
		this.onView = this.onView.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		
		this.form = new Form();
	}
	
	// </editor-fold>
	
	//<editor-fold desc="componentDidMount">
	async componentDidMount() {
		const view = await execWhen(() => this.props.dialog && this.props.dialog.extraProp('view'));
		this.state.view = view || "Profile";
	}
	
	//</editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onView">
	onView(evt, btn) {
		const {source, selected_source} = this.selfState;
		
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
		
		const profileDialog = this.refs[name];
		profileDialog && profileDialog.open(selected_source);
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	onSubmit(val, name, el) {
		const {form, item: {data: old_data}, viewProfile, viewProgress, viewComplete,} = this;
		
		if (viewProgress) {
			let {
				//6
				progress_list,
			} = form.data;
			const data = {};
			
			//6
			progress_list = (progress_list || []).map(({progress_date, ...others}) => ({
				...others,
				progress_date: Dates.formatDateSQL(progress_date),
			}));
			
			console.log(data)
			
			progressDialog.open("Progressing the non-conformance...");
			updateNCR({id: this.item.id, progress_list, status_progress: 'Progressed'}).then(res => {
				console.log("res", res)
				if (!res) {
					infoDialog.open("An error occurred. Please try again.");
				} else {
					const data_updated = {...res.data, status_progress: 'Progressed'};
					// onSaved && onSaved(data_updated);
					
					extendObservable(this.item.data, data_updated);
					infoDialog.open("Non-Conformance successfully progressed.");
					infoDialog.close(2000);
					this.props.close();
				}
			}).finally(() => {
				progressDialog.close();
			});
			return;
		}
		
		if (viewComplete) {
			const {
				//7
				status_acceptance, status_progress, result, completed_date, additional_notes
			} = form.data;
			const data = {};
			
			//7
			ShouldUpdate.check(data, old_data, status_acceptance, 'status_acceptance');
			// ShouldUpdate.check(data, old_data, status_progress, 'status_progress');
			ShouldUpdate.check(data, old_data, result, 'result');
			ShouldUpdate.checkDate(data, old_data, completed_date, 'completed_date');
			ShouldUpdate.check(data, old_data, additional_notes, 'additional_notes');
			
			console.log(data)
			
			progressDialog.open("Closing the non-conformance...");
			updateNCR({id: this.item.id, ...data, status_progress: 'Completed'}).then(res => {
				console.log("res", res)
				if (!res) {
					infoDialog.open("An error occurred. Please try again.");
				} else {
					const data_updated = {...data, status_progress: 'Completed'};
					// onSaved && onSaved(data_updated);
					
					extendObservable(this.item.data, data_updated);
					infoDialog.open("Non-Conformance successfully closed.");
					infoDialog.close(2000);
					this.props.close();
				}
			}).finally(() => {
				progressDialog.close();
			});
		}
	}
	
	// </editor-fold>
	
	//<editor-fold desc="viewProfile">
	@computed get viewProfile() {
		const {view} = this.state;
		return !view || view === "Profile";
	}
	
	//</editor-fold>
	
	//<editor-fold desc="viewProgress">
	@computed get viewProgress() {
		const {view} = this.state;
		return view === "Progressed";
	}
	
	//</editor-fold>
	
	//<editor-fold desc="viewComplete">
	@computed get viewComplete() {
		const {view} = this.state;
		return view === "Completed";
	}
	
	//</editor-fold>
	
	@computed get item() {
		return this.props.state.item;
	}
	
	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		if (!this.item) {
			return <CircularProgress className="fixed-center"/>;
		}
		const {
			props: {
				onFormNext, onFormBack, onFormOpen,
				dialog: {renderProfileCover}
			},
			item, item: {
				id, data: {
					created_at,
					client,
					project,
					site,
					//1
					type,
					priority,
					allocation,
					source,
					selected_source_compliance_audit,
					selected_source_incident,
					selected_source_inspection,
					selected_source_site,
					//2
					desc,
					process,
					//3
					due_date,
					responsible_party_list,
					assigned_job_position_list,
					assigned_person_list,
					approving_person,
					//4
					document_list,
					document_proof_list,
					//5
					comments,
					remarks,
					//6
					progress_list,
					//7
					status_acceptance,
					status_progress,
					result,
					completed_date,
					additional_notes
				}
			},
			viewProfile, viewProgress, viewComplete,
		} = this;
		
		const {isConsultant} = storage.is;
		
		return <FormControls>
			<Row
				rendered
				active={viewProfile || (!viewProgress && !viewComplete)}
				idx={0}
				title="Company / Project / Site"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
			>
				{isConsultant && <ProfileField name="client" value={client} renderer={v => v.name || v.data.name}
				                               placeholder="Company" className="col-lg-12"/>}
				<ProfileField name="project" value={project} renderer={v => v.name || v.data.name}
				              placeholder="Project"
				              className="col-lg-6"/>
				<ProfileField name="site" value={site} renderer={v => v.name || v.data.name} placeholder="Site"
				              className="col-lg-6"/>
			</Row>
			<Row
				rendered
				idx={1}
				title="1. Non-Conformance Details"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<ProfileField name="type" placeholder="Type" value={type} className="col-lg-12"/>
				<ProfileField name="priority" placeholder="Priority" value={priority} className="col-lg-12"/>
				<ProfileField name="allocation" placeholder="Allocation" value={allocation} className="col-lg-12"/>
				
				<hr className="pull-left margin-0 margin-t-5 margin-b-10"/>
				
				<ProfileField name="source" placeholder="Source" value={source} className="col-lg-12"/>
				<TitlePanel
					source={source}
					selected_source_compliance_audit={selected_source_compliance_audit}
					selected_source_incident={selected_source_incident}
					selected_source_inspection={selected_source_inspection}
					selected_source_site={selected_source_site}
					onView={this.onView}
				/>
			</Row>
			<Row
				rendered
				idx={2}
				title="2. Finding / NCR Description & Process"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<ProfileField name="desc" placeholder="Finding / NCR Description" value={desc}
				              className="col-lg-12"/>
				<ProfileField name="process" placeholder="Process" value={process} className="col-lg-12"/>
			</Row>
			<Row
				rendered
				idx={3}
				title="3. Due Date & Persons Assigned"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<ProfileField name="due_date" type="date" placeholder="Due Date" value={due_date}
				              className="col-lg-12"/>
				
				<hr className="pull-left margin-0 margin-t-5 margin-b-10"/>
				
				<ProfileField
					name="responsible_party_list"
					placeholder="Responsible Parties"
					value={responsible_party_list && responsible_party_list.map(({value}) => value).join(', ')}
					className="col-lg-12"
				/>
				<ProfileField
					name="assigned_job_position_list"
					placeholder="Assigned Job Position(s)"
					value={assigned_job_position_list && assigned_job_position_list.map(({job_position: {name}}) => name).join(', ')}
					className="col-lg-12"
				/>
				<ProfileField
					name="assigned_person_list"
					placeholder="Assigned Person(s)"
					value={assigned_person_list && assigned_person_list.map(({employee: {full_name}}) => full_name).join(', ')}
					className="col-lg-12"
				/>
				
				<ProfileField name="approving_person" placeholder="Approving Person" value={approving_person}
				              renderer={v => v.full_name} className="col-lg-12"/>
			</Row>
			<Row
				rendered
				idx={4}
				title="4. Document(s) / Media"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<FormControls>
					<Row
						rendered
						active
						idx={4.1}
						title="4.1. Document(s)"
						onFormOpen={onFormOpen}
						onFormNext={onFormNext}
					>
						<AddFilesGridViewInput name="document_list" defaultValue={document_list} readonly/>
					</Row>
					<Row
						rendered
						idx={4.2}
						title="4.2. Document(s) (Proof of Correction)"
						onFormOpen={onFormOpen}
						onFormNext={onFormBack}
					>
						<AddFilesGridViewInput name="document_proof_list" defaultValue={document_proof_list} readonly/>
					</Row>
				</FormControls>
			</Row>
			<Row
				rendered
				idx={5}
				title="5. Comments & Remarks"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<ProfileField name="comments" placeholder="Comments" value={comments} className="col-lg-12"/>
				<ProfileField name="remarks" placeholder="Remarks" value={remarks} className="col-lg-12"/>
			</Row>
			<Row
				rendered
				active={viewProgress}
				idx={6}
				title="6. Progress"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				{viewProgress && <NewNCRProgressListTable ref="progress_list" name="progress_list"
				                                          defaultValue={[...(progress_list || []), null]}
				                                          onChange={this.onSubmit} preventInitialChange/>}
				{!viewProgress &&
					<NewNCRProgressListTable ref="progress_list" name="progress_list" defaultValue={progress_list || []}
					                         readonly/>}
			</Row>
			<Row
				rendered
				active={viewComplete}
				idx={7}
				title="7. Status / Result / Closed Out"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				{viewComplete && <>
					<ClearableInput ref="status_acceptance" name="status_acceptance" type="radio"
					                placeholder="Acceptance Status" defaultValue={status_acceptance}
					                vertical={2}
					                className="col-lg-6 form-control" onChange={this.form.onChange}
					                values={this.state.lists.status_acceptance} returnValue/>
					<ClearableInput ref="status_progress" name="status_progress" type="radio"
					                placeholder="Progress Status" defaultValue={"Completed"}
					                vertical={2}
					                className="col-lg-6 form-control" onChange={this.form.onChange}
					                values={this.state.lists.status_progress} returnValue readonly/>
					<ClearableInput ref="result" name="result" type="radio" placeholder="Result" defaultValue={result}
					                className="col-lg-6 form-control" onChange={this.form.onChange}
					                values={this.state.lists.result} returnValue/>
					<ClearableInput name="completed_date" type="date" placeholder="Completed Date..."
					                defaultValue={completed_date || new Date()} className="col-lg-6 form-control"
					                onChange={this.form.onChange}/>
					
					<hr className="pull-left margin-0 margin-t-5 margin-b-10"/>
					
					<ClearableInput ref="additional_notes" name="additional_notes" type="textarea"
					                placeholder="Additional Notes" defaultValue={additional_notes}
					                className="col-lg-12 form-control" onChange={this.form.onChange}/>
					
					<hr className="pull-left margin-0 margin-t-5 margin-b-10"/>
					
					<Button className="btn btn-primary hor-center w-120 border-radius-20 margin-0"
					        onClick={this.onSubmit}>
						<i className="fa fa-check"/> Submit
					</Button>
				</>}
				{!viewComplete && <>
					<ProfileField name="status_acceptance" type="radio" placeholder="Acceptance Status"
					              defaultValue={status_acceptance}
					              className="col-lg-12"/>
					<ProfileField name="status_progress" type="radio" placeholder="Status" defaultValue={status_progress}
					              className="col-lg-12"/>
					<ProfileField name="result" type="radio" placeholder="Result" defaultValue={result}
					              className="col-lg-12"/>
					
					<hr className="pull-left margin-0 margin-t-5 margin-b-10"/>
					
					<ProfileField name="completed_date" type="date" placeholder="Completed Date"
					              defaultValue={completed_date} className="col-lg-12"/>
					
					<hr className="pull-left margin-0 margin-t-5 margin-b-10"/>
					
					<ProfileField name="additional_notes" placeholder="Additional Notes" defaultValue={additional_notes}
					              className="col-lg-12"/>
				</>}
			</Row>
			
			<EditNCRDialog ref="editDialog"/>
			
			<ProfileSiteDialog ref="profileSiteDialog"/>
			<ProfileAuditDialog ref="profileAuditDialog"/>
			<ProfileIncidentDialog ref="profileIncidentDialog"/>
		</FormControls>;
	}
	
	// </editor-fold>
	
}

// <editor-fold defaultstate="collapsed" desc="TitlePanel">
@observer
class TitlePanel extends React.Component {
	
	@observable state = {
		selected_source: null,
		is_loaded: true,
		is_error: false,
	};
	
	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);
		
		this.onRenderActionCell = this.onRenderActionCell.bind(this);
	}
	
	// </editor-fold>
	
	async componentDidMount() {
		const {
			selected_source_compliance_audit,
			selected_source_incident,
			selected_source_inspection,
			selected_source_site
		} = this.props;
		
		this.state.is_loaded = true;
		this.state.is_error = false;
		
		try {
			if (selected_source_compliance_audit) {
				this.state.selected_source = await findByIdAudit(selected_source_compliance_audit.id);
			} else if (selected_source_incident) {
				this.state.selected_source = await findByIdIncident(selected_source_incident.id);
			} else if (selected_source_inspection) {
				this.state.selected_source = await findByIdInspectionsQuestionnaire(selected_source_inspection.id);
			} else if (selected_source_site) {
				this.state.selected_source = await findByIdSite(selected_source_site.id);
			}
		} catch (e) {
			this.state.is_error = true;
		} finally {
			this.state.is_loaded = false;
		}
	}
	
	onRenderActionCell(selected_source, idx) {
		const {onView} = this.props;
		return <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60">
			<ActionsButton className="btn btn-primary pull-right min-w-40" icon="eye" onClick={onView}/>
		</div>;
	}
	
	@computed get selected_source() {
		return this.state.selected_source;
	}
	
	@computed get isLoading() {
		return this.state.is_loaded;
	}
	
	@computed get isError() {
		return this.state.is_error;
	}
	
	get renderSite() {
		let {selected_source} = this;
		const {id, data:{name, address, client, project}} = selected_source;
		return <div className="SiteTableRow">
			<TRow>
				{RenderUtils.renderOrgTD(client, null, 'Company Name')}
				{RenderUtils.renderOrgTD(project, null, 'Project Name')}
				<div className="td">
					<h6 className="xs-shown font-size-13">Site Name</h6>
					{name}
				</div>
				{this.onRenderActionCell(selected_source)}
			</TRow>
		</div>;
	}
	
	get renderAudit() {
		let {selected_source} = this;
		return <div className="AuditTableRow">
			<AuditTableRow item={selected_source} onRenderActionCell={this.onRenderActionCell}/>
		</div>;
	}
	
	get renderInspection() {
		let {selected_source} = this;
		return <div className="InspectionTableRow">
			<InspectionTableRow item={selected_source} onRenderActionCell={this.onRenderActionCell}/>
		</div>;
	}
	
	get renderIncident() {
		let {selected_source} = this;
		return <div className="IncidentTableRow">
			<IncidentTableRow item={selected_source} onRenderActionCell={this.onRenderActionCell}/>
		</div>;
	}
	
	render() {
		const {isLoading, isError} = this;
		if (isLoading) {
			return <div className="TitlePanel">
				<hr className="w-full margin-0 margin-t-5"/>
				<CircularProgress className="fixed-center"/>
			</div>;
		}
		if (isError) {
			return <div className="TitlePanel">
				<hr className="w-full margin-0 margin-t-5"/>
				<p>Couldn't load results. Please try again later.</p>
			</div>;
		}
		
		const {
			selected_source_compliance_audit,
			selected_source_incident,
			selected_source_inspection,
			selected_source_site
		} = this.props;
		
		return <div className="TitlePanel">
			<hr className="w-full margin-0 margin-t-5"/>
			{selected_source_site && this.renderSite}
			{selected_source_compliance_audit && this.renderAudit}
			{selected_source_inspection && this.renderInspection}
			{selected_source_incident && this.renderIncident}
		</div>;
	}
}

// </editor-fold>

export default ProfileDialog;
