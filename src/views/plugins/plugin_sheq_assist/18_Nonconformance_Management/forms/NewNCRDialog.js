// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {isObservableArray, observable} from 'mobx';

import Form from 'utils/Form';
import {
	AddFilesGridViewInput,
	ClearableInput,
	SelectClientInput,
	SelectEmployeeInput, SelectProjectInput, SelectSiteInput, SelectUserInput
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {NewEmployeeListTable, NewJobPositionListTable, NewUserListTable, NewNCRResponsiblePartyListTable} from 'components/FormTableComponents';
import {ANewDialog} from 'components/dialogs';

import {toDataURI} from "utils/Utils";
import {SelectSourceItemTable, SelectSourceTable, SourceBtnWrapper, NewDocumentTable} from '../dialogs/NCRComponents';

import style from "./NewNCRDialog.lazy.css";
import NewNCRProgressListTable from "components/FormTableComponents/NewNCRProgressListTable";
import {Dates} from "utils/Dates";
import insertNCR from "mutations/all/NCR/insertNCR";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewNCRDialog">
@observer
class NewNCRDialog extends ANewDialog {
	pageKey = "NewNCRDialog";
	title = "Create NCR";
	className = 'ANewTableFormDialog';
	
	constructor(props) {
		super(props, style);
	}
	
	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends React.Component {
	path = "plugin_sheq_assist/ncr/";
	
	// <editor-fold defaultstate="collapsed" desc="state">
	@observable
	state = {
		lists: {
			type: ['Corrective Action', 'Preventative Action', 'Opportunity For Improver'],
			priority: ['Low', 'Medium', 'High', 'Critical'],
			allocation: ['NCR', 'Finding', 'Observation', 'Deviation'],
			status_progress: ['Pending', 'Progressed', 'Approved', 'Rejected', 'Completed'].map(text => {
				return {text, value: text, checked: false}
			}),
			status_acceptance: ['Pending', 'Approved', 'Rejected'].map(text => {
				return {text, value: text, checked: false}
			}),
			responsible_party_list: ['Consultant', 'Client', 'External', 'Internal'],
			result: ['Pass', 'Fail'].map(text => {
				return {text, value: text, checked: false}
			}),
			selected_source: [],
			source: [
				{label: "Site Audit", value: 'N/A'},
				{label: 'Compliance Audit', value: sockets.of('audits').fn('listByLogged')},
				{label: 'Inspection', value: sockets.of('inspections').fn('listCompletedByLogged')},
				{label: 'Incident Investigation', value: sockets.of('incidents/investigations').fn('listByLogged')}
			]
		},
	};
	// </editor-fold>
	source = null;
	
	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor() {
		super();
		
		this.onNext = this.onNext.bind(this);
		
		this.onSelectSite = this.onSelectSite.bind(this);
		this.onSelectSource = this.onSelectSource.bind(this);
		this.onSelectSourceItem = this.onSelectSourceItem.bind(this);
		
		this.onChangeSelectedSource = this.onChangeSelectedSource.bind(this);
		
		this.form = new Form();
		this.form.addChangeOne("source", this.onChangeSource.bind(this));
		this.form.addChangeOne("selected_source", this.onChangeSelectedSource);
		this.form.addChangeOne("selected_source_item", this.onChangeSelectedSourceItem.bind(this));
	}
	
	// </editor-fold>
	
	//<editor-fold desc="componentDidMount">
	componentDidMount() {
		const {dialog} = this.props;
		const selected_source = dialog.extraProp('selected_source');
		if (selected_source) {
			this.onChangeSelectedSource(null, selected_source);
		}
	}
	
	//</editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onSelectSite, onSelectSource, onChangeSource, onChangeSelectedSource, onChangeSelectedSourceItem">
	onSelectSite(val, el) {
		const {execWhen} = this.props;
		execWhen(() => this.refs.selectSourceTable).then(selectSourceTable => {
			selectSourceTable.selected_source = val;
		});
	}
	
	onSelectSource(evt, btn) {
		const {selectSourceTable} = this.refs;
		selectSourceTable.open();
	}
	
	onSelectSourceItem(evt, btn) {
		const {execWhen, dialog} = this.props;
		execWhen(() => this.refs.selectSourceTable && this.refs.selectSourceListTable && this.refs.desc).then(() => {
			const {selectSourceTable, selectSourceListTable} = this.refs;
			const {selected_source} = selectSourceTable;
			const is_array = isArray(selected_source) || isObservableArray(selected_source);
			if (selected_source && ((is_array && !selected_source.isEmpty()) || !is_array)) {
				let list;
				switch (this.source.label) {
					case "Site Audit":
						break;
					case "Compliance Audit": {
						const search = ['Major NCR', 'Minor NCR', 'Complaint', 'Observation'];
						list = selected_source.data.list.filter(({audit_summary}) => search.contains(audit_summary));
						selectSourceListTable && selectSourceListTable.setOnCancel(() => {
							selectSourceTable.clearSelection();
						}).open(list);
						break;
					}
					case "Inspection": {
						// const search = ['Major NCR', 'Minor NCR', 'Complaint', 'Observation'];
						list = selected_source.data.question_list;//.filter(({audit_summary}) => search.contains(audit_summary));
						selectSourceListTable && selectSourceListTable.setOnCancel(() => {
							selectSourceTable.clearSelection();
						}).open(list);
						break;
					}
					case "Incident Investigation": {
						// const search = ['Major NCR', 'Minor NCR', 'Complaint', 'Observation'];
						const {id, data:{investigation:{cause_analysis:{immediate_analysis, root_analysis}}}} = selected_source;
						list = immediate_analysis.cause_analysis_cause_list;
						list = root_analysis.cause_analysis_cause_list;
						selectSourceListTable && selectSourceListTable.setOnCancel(() => {
							selectSourceTable.clearSelection();
						}).open(list);
						break;
					}
				}
			} else {
//                selectSourceTable.clearSelection();
//                selectSourceTable.setSelectedList([]);
//                delete this.preventSourceChange;
			}
		});
	}
	
	onChangeSource(el, val) {
		this.source = val;
		const {execWhen} = this.props;
		execWhen(() => this.refs.sourceBtn).then(ref => {
			ref.source = val;
		});
		execWhen(() => this.refs.selectSourceTable).then(ref => {
			ref.source = val;
		});
		execWhen(() => this.refs.selectSourceListTable).then(ref => {
			ref.source = val;
		});
	}
	
	onChangeSelectedSource(el, val) {
		const {execWhen} = this.props;
		execWhen(() => this.refs.selectSourceTable).then(selectSourceTable => {
			selectSourceTable.selected_source = val;
			selectSourceTable.close();
		});
	}
	
	onChangeSelectedSourceItem(el, val) {
		const {execWhen, dialog} = this.props;
		execWhen(() => this.refs.selectSourceTable && this.refs.selectSourceListTable && this.refs.desc).then(() => {
			const {selectSourceTable, selectSourceListTable, desc} = this.refs;
			selectSourceListTable.selected_source_item = val;
			if (val) {
				switch (this.source.label) {
					case "Site Audit":
						break;
					case "Compliance Audit": {
						desc.onChange(val.audit_findings);
						break;
					}
					case "Inspection": {
						//                    list = ;
						break;
					}
					case "Incident Investigation": {
						//                    list = ;
						break;
					}
				}
			}
			selectSourceTable.close();
		});
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onNext">
	onNext(e, btn) {
		const {form} = this;
		const {idx} = btn.props;
		if (idx === 1) {
			if (!form.isValid('source')) {
				infoDialog.open('Source is required');
				return;
			}
		}
		if (idx === 2) {
			if (!form.isValid('desc')) {
				infoDialog.open('Finding / NCR Description is required');
				return;
			}
		}
		
		return true;
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	async onSubmit(e, btn, onSaved) {
		const {form} = this;
		
		if (!form.isValid('source')) {
			infoDialog.open('Source is required');
			return;
		}
		
		if (!form.isValid('desc')) {
			infoDialog.open('Finding / NCR Description is required');
			return;
		}
		
		const {selected_source} = this.refs.selectSourceTable;
		const {selected_source_item} = this.refs.selectSourceListTable;
		
		const source = this.source.label;
		const sources = {
			"Site Audit": "selected_source_site_id",
			'Compliance Audit': "selected_source_compliance_audit_id",
			'Inspection': "selected_source_inspection_id",
			'Incident Investigation': "selected_source_incident_id",
		};
		const sourceItems = {
			// "Site Audit": "selected_source_site_id",
			'Compliance Audit': "selected_source_item_compliance_audit_finding_id",
			'Inspection': "selected_source_item_inspection_ques_id",
			'Incident Investigation': "selected_source_item_incident_id",
		};
		
		const {
			//0
			site,
			project,
			client,
			//1
			type,
			priority,
			allocation,
			//2
			desc, process,
			//3
			due_date,
			responsible_party_list,
			assigned_job_position_list,
			assigned_person_list,
			assigned_user_list,
			approving_person_list,
			//4
			document_list, document_proof_list,
			//5
			comments, remarks,
			//6
			progress_list,
			//7
			status_acceptance, status_progress, result, completed_date, additional_notes
		} = form.data;
		const data = {
			//0
			site_id: site && site.id,
			project_id: project && project.id,
			client_id: client && client.id,
			//1
			type,
			priority,
			allocation,
			source,
			[sources[source]]: selected_source && selected_source.id,
			//2
			desc,
			process,
			//3
			due_date: Dates.formatTimestampSQL(due_date),
			responsible_party_list: {
				data: [
					...(responsible_party_list || []).map((value) => ({value})),
				],
			},
			assigned_job_position_list: {
				data: [
					...(assigned_job_position_list || []).map(({id: job_position_id}) => ({job_position_id})),
				],
			},
			assigned_person_list: {
				data: [
					...(assigned_person_list || []).map(({id: employee_id}) => ({employee_id})),
				],
			},
			assigned_user_list: {
				data: [
					...(assigned_user_list || []).map(({id: user_id}) => ({user_id})),
				],
			},
			approving_person_list: {
				data: [
					...(approving_person_list || []).map(({id: employee_id}) => ({employee_id})),
				]
			},
			//4
			document_list: {
				data: await Promise.all([
					...(document_list || []).map(async ({path}) => ({
						type: 'Document Incident',
						doc: {path: await toDataURI(path)},
					})),
					...(document_proof_list || []).map(async ({path}) => ({
						type: 'Document Proof',
						doc: {path: await toDataURI(path)},
					})),
				]),
			},
			//5
			comments,
			remarks,
			//6
			progress_list: {
				data: (progress_list || []).map(({date, ...others}) => ({
					...others,
					date: Dates.formatTimestampSQL(date),
				})),
			},
			//7
			status_acceptance,
			status_progress,
			result,
			completed_date: Dates.formatTimestampSQL(completed_date),
			additional_notes
		};
		
		if ([sourceItems[source]] && selected_source_item) {
			data[[sourceItems[source]]] = selected_source_item.id;
		}
		
		console.log(data)
		
		btn.text("Saving...").disabled();
		progressDialog.open();
		insertNCR(data).then(res => {
			console.log("res", res)
			if (isString(res)) {
				infoDialog.open("An error occurred. Please try again.");
			} else if (!!res) {
				onSaved && onSaved(res);
				infoDialog.open("Record successfully saved.");
				infoDialog.close(2000);
				this.props.close();
			} else {
				infoDialog.open("An error occurred. Please try again.");
				infoDialog.close(2000);
			}
		}).finally(() => {
			btn.text("Save").enabled();
			progressDialog.close();
		});
	}
	
	// </editor-fold>
	
	//<editor-fold desc="defaultSource">
	get defaultSource() {
		const {dialog, dialog: {props: {source: sourceProp}}} = this.props;
		const source = dialog.extraProp('source') || sourceProp;
		let defaultSource;
		const {source: state_source} = this;
		if (state_source) {
			defaultSource = state_source;
		} else if (source) {
			defaultSource = this.state.lists.source.find(({label}) => label === source);
		}
		return defaultSource;
	}
	
	//</editor-fold>
	
	/// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		const {onFormNext, onFormBack, onFormOpen} = this.props;
		
		const {isConsultant} = storage.is;
		
		return (<FormControls>
			<Row
				rendered
				active
				idx={0}
				title="Company / Project / Site"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
			>
				{isConsultant && <SelectClientInput name="client" placeholder="Company..." required
				                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>}
				
				<SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control"
				                    onChange={this.form.onChange}/>
				<SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control"
				                 onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={1}
				title="1. Non-Conformance Details"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<ClearableInput name="type" type="select" placeholder="Type..."
				                className="col-lg-6 form-control margin-b-10" onChange={this.form.onChange}
				                values={this.state.lists.type} returnValue/>
				<ClearableInput name="priority" type="select" placeholder="Priority..."
				                className="col-lg-6 form-control margin-b-10" onChange={this.form.onChange}
				                values={this.state.lists.priority} returnValue/>
				<ClearableInput name="allocation" type="select" placeholder="Allocation..."
				                className="col-lg-12 form-control margin-b-10" onChange={this.form.onChange}
				                values={this.state.lists.allocation} returnValue/>
				
				<hr className="pull-left margin-0 margin-t-0 margin-b-15"/>
				
				<ClearableInput name="source" type="select" placeholder="Source..." defaultValue={this.defaultSource}
				                required className="col-lg-12 form-control margin-b-10" onChange={this.form.onChange}
				                values={this.state.lists.source}/>
				<SourceBtnWrapper ref="sourceBtn" onClick={this.onSelectSource} onSelectSite={this.onSelectSite}/>
				<SelectSourceTable ref="selectSourceTable" onSelectSourceItem={this.onSelectSourceItem}
				                   onChange={this.form.onChange}/>
				<SelectSourceItemTable ref="selectSourceListTable" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={2}
				title="2. Finding / NCR Description & Process"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<ClearableInput ref="desc" name="desc" type="textarea" placeholder="Finding / NCR Description" required
				                className="col-lg-12 form-control min-h-60" onChange={this.form.onChange}/>
				<ClearableInput name="process" type="textarea" placeholder="Process"
				                className="col-lg-12 form-control min-h-60" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={3}
				title="3. Due Date & Persons Responsible"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<ClearableInput name="due_date" type="date" placeholder="Due Date..."
				                className="col-lg-8 pull-left-2 form-control" onChange={this.form.onChange}/>
				
				<hr className="pull-left margin-0 margin-t-5 margin-b-10"/>
				
				{/* <ClearableInput name="responsible_party_list" type="select_multi" placeholder="Responsible Parties..."
				                className="col-lg-12 form-control" onChange={this.form.onChange}
				                values={this.state.lists.responsible_party_list} returnValue add/> */}
				<NewNCRResponsiblePartyListTable
					name="responsible_party_list"
					title="Responsible Parties"
					onChange={this.form.onChange}
				    className="w-full-calc-add-10 -margin-l-10"
				/>

				<hr className="pull-left margin-0 margin-t-5 margin-b-10"/>
				
				<NewJobPositionListTable 
					name="assigned_job_position_list"
					title="Responsible Job Positions"
					onChange={this.form.onChange}
				    className="w-full-calc-add-10 -margin-l-10"
				/>

				<hr className="pull-left margin-0 margin-t-5 margin-b-10"/>
				
				<NewEmployeeListTable 
					name="assigned_person_list"
					title="Responsible Persons"
				    className="w-full-calc-add-10 -margin-l-10"
				    onChange={this.form.onChange}
					showOtherPerson
				/>

				<hr className="pull-left margin-0 margin-t-5 margin-b-10"/>
				
				<NewUserListTable 
					name="assigned_user_list"
					title="Responsible Users"
				    className="w-full-calc-add-10 -margin-l-10"
				    onChange={this.form.onChange}
				/>

				<hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

				<NewEmployeeListTable 
					name="approving_person_list"
					title="Approving Persons"
				    className="w-full-calc-add-10 -margin-l-10"
				    onChange={this.form.onChange}
					disableOtherPerson
				/>
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
						<NewDocumentTable 
							ref="document_list" 
							name="document_list" 
							title="Documents/Photos"
							onChange={this.form.onChange}
						/>
					</Row>
					<Row
						rendered
						idx={4.2}
						title="4.2. Document(s) (Proof of Correction)"
						onFormOpen={onFormOpen}
						onFormBack={onFormBack}
					>
						<NewDocumentTable 
							ref="document_proof_list" 
							name="document_proof_list" 
							title="Documents/Photos"
							onChange={this.form.onChange}
						/>
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
				<ClearableInput ref="comments" name="comments" type="textarea" placeholder="Comments" required
				                className="col-lg-12 form-control" onChange={this.form.onChange}/>
				<ClearableInput ref="remarks" name="remarks" type="textarea" placeholder="Remarks"
				                className="col-lg-12 form-control" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={6}
				title="6. Progress"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<NewNCRProgressListTable ref="progress_list" name="progress_list" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={7}
				title="7. Status / Result / Closed Out"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				<ClearableInput ref="status_acceptance" name="status_acceptance" type="radio" placeholder="Acceptance Status"
				                vertical={2}
				                className="col-lg-6 form-control" onChange={this.form.onChange}
				                values={this.state.lists.status_acceptance} returnValue/>
				<ClearableInput ref="status_progress" name="status_progress" type="radio" placeholder="Progress Status"
				                vertical={2}
				                className="col-lg-6 form-control" onChange={this.form.onChange}
				                values={this.state.lists.status_progress} returnValue/>
				<ClearableInput ref="result" name="result" type="radio" placeholder="Result"
				                className="col-lg-6 form-control" onChange={this.form.onChange}
				                values={this.state.lists.result} returnValue/>
				<ClearableInput name="completed_date" type="date" placeholder="Completed Date..."
				                className="col-lg-6 form-control" onChange={this.form.onChange}/>
				
				<hr className="pull-left margin-0 margin-t-5 margin-b-10"/>
				
				<ClearableInput ref="additional_notes" name="additional_notes" type="textarea"
				                placeholder="Additional Notes" className="col-lg-12 form-control"
				                onChange={this.form.onChange}/>
			</Row>
		</FormControls>);
	}
	
	// </editor-fold>
}

export default NewNCRDialog;
