// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, isObservableArray, observable} from 'mobx';

import Form from 'utils/Form';
import {Dates, execWhen, ShouldUpdate} from 'utils/Utils';
import {
	AddFilesGridViewInput,
	ClearableInput,
	Clickable,
	SelectClientInput,
	SelectEmployeeInput, SelectJobPositionInput, SelectProjectInput, SelectSiteInput
} from 'components/inputs';
import {FormControls, NavButtons, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import {SelectAuditItemTable, SelectSourceTable, SourceBtnWrapper} from '../dialogs/NCRComponents';

import style from "./EditNCRDialog.lazy.css";
import NewNCRProgressListTable from "components/FormTableComponents/NewNCRProgressListTable";
import updateNCR from "mutations/all/NCR/updateNCR";
import findByIdNCR from "mutations/all/NCR/findByIdNCR";
import {CircularProgress} from "@mui/material";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="EditDialog">
@observer
class EditDialog extends AEditDialog {
	pageKey = "EditNCRDialog";
	title = "Edit NCR";
	className = 'ANewTableFormDialog';
	findById = findByIdNCR;
	removeById = updateNCR ;

	constructor(props) {
		super(props, style);
	}

	get topButtonsHiddenSave() {
		return true;
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
			responsible_party_list: ['Consultant', 'Client', 'External'],
			result: ['Pass', 'Fail'].map(text => {
				return {text, value: text, checked: false}
			}),
			selected_source: [],
			source: [
				{label: 'Site Audit', value: 'N/A'},
				{label: 'Compliance Audit', value: '21_Internal_Audit/audit/'},
				{label: 'Inspection', value: '21_Internal_Audit/inspection/'},
				{label: 'Incident Investigation', value: '17_Incident_Investigation/'}
			]
		},
	};
	// </editor-fold>
	source = null;

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor() {
		super();

		this.onNext = this.onNext.bind(this);
		this.onFormSave = this.onFormSave.bind(this);

		this.onSelectSite = this.onSelectSite.bind(this);
		this.onSelectSource = this.onSelectSource.bind(this);
		this.onSelectSourceItem = this.onSelectSourceItem.bind(this);

		this.form = new Form();
		this.form.addChangeOne("source", this.onChangeSource.bind(this));
		this.form.addChangeOne("selected_source", this.onChangeSelectedSource.bind(this));
		this.form.addChangeOne("selected_source_item", this.onChangeSelectedSourceItem.bind(this));
	}

	// </editor-fold>

	//<editor-fold desc="componentDidMount">
	componentDidMount() {
		execWhen(() => this.item && this.refs.selectSourceTable && this.refs.selectSourceListTable).then(() => {
			const {data: {selected_source_ref, selected_source_item}} = this.item;
			const {selectSourceTable, selectSourceListTable} = this.refs;
			selectSourceTable.selected_source = selected_source_ref;
			selectSourceListTable.selected_source_item = selected_source_item;
		});
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
						//                    list = ;
						break;
					}
					case "Incident Investigation": {
						//                    list = ;
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
			const {selectSourceTable, desc} = this.refs;
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

	//<editor-fold desc="onFormSave">
	onFormSave(e, btn) {
		const {
			form,
			item: {id, data: old_data},
		} = this;

		const onSubmit = (data, onSaved) => {
			if (Object.keys(data).isEmpty()) {
				infoDialog.open("Nothing changed!");
				return;
			}

			console.log(data)

			btn.text("Saving...").disabled();
			progressDialog.open();
			updateNCR({id: this.item.id, ...data}).then(res => {
				console.log("res", res)
				if (isString(res)) {
					infoDialog.open("An error occurred. Please try again.");
				} else if (!!res) {
					onSaved && onSaved(data);
					infoDialog.open("Record successfully updated.");
					infoDialog.close(2000);
					this.props.close();
				} else {
					infoDialog.open("An error occurred. Please try again.");
				}
			}).finally(() => {
				btn.text("Save").enabled();
				setTimeout(() => progressDialog.close());
			});
		};

		const {idx} = btn.props;
		if (idx === 0) {
			// const {isConsultant} = storage.is;
			// if (isConsultant && !form.isValid('client')) {
			//     infoDialog.open('Company is required');
			//     return;
			// }

			const {
				site, project, client,
			} = form.data;

			const data = {};
			ShouldUpdate.checkClient(data, old_data, client);
			ShouldUpdate.checkProject(data, old_data, project);
			ShouldUpdate.checkSite(data, old_data, site);

			onSubmit(data);
			return;
		}

		if (idx === 1) {
			if (!form.isValid('source')) {
				infoDialog.open('Source is required');
				return;
			}

			const {selected_source} = this.refs.selectSourceTable;

			const source = this.source.label;
			const sources = {
				"Site Audit": "selected_source_site_id",
				'Compliance Audit': "selected_source_compliance_audit_id",
				'Inspection': "selected_source_inspection_id",
				'Incident Investigation': "selected_source_incident_id",
			};

			const {
				type,
				priority,
				allocation,
			} = form.data;

			const data = {}
			ShouldUpdate.check(data, old_data, type, 'type');
			ShouldUpdate.check(data, old_data, priority, 'priority');
			ShouldUpdate.check(data, old_data, allocation, 'allocation');
			ShouldUpdate.check(data, old_data, source, 'source');
			ShouldUpdate.check(data, old_data, selected_source && selected_source.id, sources[source]);

			onSubmit(data);
			return;
		}

		if (idx === 2) {
			if (!form.isValid('desc')) {
				infoDialog.open('Finding / NCR Description is required');
				return;
			}

			const {
				desc, process,
			} = form.data;
			const data = {};
			ShouldUpdate.check(data, old_data, desc, 'desc');
			ShouldUpdate.check(data, old_data, process, 'process');

			onSubmit(data);
			return;
		}

		if (idx === 3) {
			const {
				due_date,
				//responsible_person,
				responsible_party_list,
				assigned_job_position_list,
				assigned_person_list,
				approving_person,
			} = form.data;

			const data = {};
			ShouldUpdate.checkDate(data, old_data, due_date, 'due_date');
			// ShouldUpdate.checkEmployee(data, old_data, responsible_person, 'responsible_person_id');
			ShouldUpdate.checkEmployee(data, old_data, approving_person, 'approving_person_id');

			onSubmit(data);
			return;
		}

		if (idx === 4) {
			const {
				document_list,
				document_proof_list,
			} = form.data;

			const data = {};
			ShouldUpdate.checkFileList(data, old_data, document_list, 'document_list');
			ShouldUpdate.checkFileList(data, old_data, document_proof_list, 'document_proof_list');

			onSubmit(data);
			return;
		}

		if (idx === 5) {
			const {
				comments, remarks,
			} = form.data;

			const data = {};
			ShouldUpdate.check(data, old_data, comments, 'comments');
			ShouldUpdate.check(data, old_data, remarks, 'remarks');

			onSubmit(data);
			return;
		}

		if (idx === 6) {
			const {
				progress_list,
			} = form.data;

			const data = {};
			if (progress_list) {
				const __progress_list = progress_list.slice().map(({date, ...others}) => ({
					...others,
					date: Dates.formatTimestampSQL(date),
				}));
				ShouldUpdate.checkListToJS(data, old_data, __progress_list, 'progress_list');
			}

			onSubmit(data);
			return;
		}

		if (idx === 7) {
			const {
				status_acceptance, status_progress, result, completed_date, additional_notes
			} = form.data;

			const data = {};
			ShouldUpdate.check(data, old_data, status_acceptance, 'status_acceptance');
			ShouldUpdate.check(data, old_data, status_progress, 'status_progress');
			ShouldUpdate.check(data, old_data, result, 'result');
			ShouldUpdate.checkDate(data, old_data, completed_date, 'completed_date');
			ShouldUpdate.check(data, old_data, additional_notes, 'additional_notes');

			onSubmit(data);
			return;
		}

		return true;
	}

	//</editor-fold>

	get defaultSource() {
		const {item: {data: {source}}} = this;
		return this.state.lists.source.find(v => v.label === source);
	}

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
					client, project, site,
					//1
					type,
					priority,
					allocation,
					source,
					//2
					desc, process,
					//3
					due_date,
					// responsible_person,
					responsible_party_list,
					assigned_job_position_list,
					assigned_person_list,
					approving_person,
					//4
					document_list, document_proof_list,
					//5
					comments, remarks,
					//6
					progress_list,
					//7
					status_acceptance, status_progress, result, completed_date, additional_notes
				}
			}
		} = this;

		const {isConsultant} = storage.is;

		console.log('item', item)

		return (<FormControls>
			<Row
				rendered
				active
				idx={0}
				title="Company / Project / Site"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormSave={this.onFormSave}
			>
				{isConsultant &&
					<SelectClientInput name="client" placeholder="Company..." defaultValue={client} required
					                   className="col-lg-12 form-control" onChange={this.form.onChange}/>}
				<SelectProjectInput name="project" placeholder="Project..." defaultValue={project} required
				                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
				<SelectSiteInput name="site" placeholder="Site..." defaultValue={site} required
				                 className="col-lg-12 form-control" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={1}
				title="1. Non-Conformance Details"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
				onFormSave={this.onFormSave}
			>
				<ClearableInput name="type" type="select" placeholder="Type..." defaultValue={type}
				                className="col-lg-6 form-control margin-b-10" onChange={this.form.onChange}
				                values={this.state.lists.type} returnValue/>
				<ClearableInput name="priority" type="select" placeholder="Priority..." defaultValue={priority}
				                className="col-lg-6 form-control margin-b-10" onChange={this.form.onChange}
				                values={this.state.lists.priority} returnValue/>
				<ClearableInput name="allocation" type="select" placeholder="Allocation..." defaultValue={allocation}
				                className="col-lg-12 form-control margin-b-10" onChange={this.form.onChange}
				                values={this.state.lists.allocation} returnValue/>

				<hr className="pull-left margin-0 margin-t-0 margin-b-15"/>

				<ClearableInput name="source" type="select" placeholder="Source..." defaultValue={this.defaultSource}
				                required className="col-lg-6 pull-left-3 form-control margin-b-10"
				                onChange={this.form.onChange} values={this.state.lists.source}/>
				<SourceBtnWrapper ref="sourceBtn" onClick={this.onSelectSource} onSelectSite={this.onSelectSite}/>
				<SelectSourceTable ref="selectSourceTable" onSelectSourceItem={this.onSelectSourceItem}
				                   onChange={this.form.onChange}/>
				<SelectAuditItemTable ref="selectSourceListTable" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={2}
				title="2. Finding / NCR Description & Process"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
				onFormSave={this.onFormSave}
			>
				<ClearableInput ref="desc" name="desc" defaultValue={desc} type="textarea"
				                placeholder="Finding / NCR Description" required className="col-lg-12 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput name="process" type="textarea" placeholder="Process" defaultValue={process}
				                className="col-lg-12 form-control min-h-60" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={3}
				title="3. Due Date & Persons Assigned"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
				onFormSave={this.onFormSave}
			>
				<ClearableInput name="due_date" type="date" defaultValue={due_date} placeholder="Due Date..." required
				                className="col-lg-8 pull-left-2 form-control" onChange={this.form.onChange}/>

				<hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

				<ClearableInput name="responsible_party_list" type="select_multi" placeholder="Responsible Parties..."
				                defaultValue={responsible_party_list}
				                className="col-lg-12 form-control" onChange={this.form.onChange}
				                values={this.state.lists.responsible_party_list} returnValue add/>

				<SelectJobPositionInput name="assigned_job_position_list" placeholder="Assigned Job Position(s)..."
				                        type="select_multi" defaultValue={assigned_job_position_list}
				                        required className="col-lg-12 form-control"
				                        onChange={this.form.onChange}/>
				<SelectEmployeeInput name="assigned_person_list" placeholder="Assigned Person(s)..."
				                     type="select_multi" defaultValue={assigned_person_list}
				                     required className="col-lg-12 form-control"
				                     onChange={this.form.onChange}/>

				<SelectEmployeeInput name="approving_person" defaultValue={approving_person} showOtherPerson
				                     placeholder="Approving Person..." required
				                     className="col-lg-12 form-control" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={4}
				title="4. Document(s) / Media"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
				onFormSave={this.onFormSave}
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
						<AddFilesGridViewInput name="document_list" defaultValue={document_list} title="Add Document/Photo"
						                       onChange={this.form.onChange}/>
					</Row>
					<Row
						rendered
						idx={4.2}
						title="4.2. Document(s) (Proof of Correction)"
						onFormOpen={onFormOpen}
						onFormNext={onFormBack}
					>
						<AddFilesGridViewInput name="document_proof_list" defaultValue={document_proof_list}
						                       title="Add Document/Photo" onChange={this.form.onChange}/>
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
				onFormSave={this.onFormSave}
			>
				<ClearableInput ref="comments" name="comments" defaultValue={comments} type="textarea"
				                placeholder="Comments" required className="col-lg-12 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput ref="remarks" name="remarks" defaultValue={remarks} type="textarea"
				                placeholder="Remarks" className="col-lg-12 form-control" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={6}
				title="6. Progress"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
				onFormSave={this.onFormSave}
			>
				<NewNCRProgressListTable ref="progress_list" name="progress_list"
				                         defaultValue={[...(progress_list || []), null]} onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={7}
				title="7. Status / Result / Closed Out"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormSave={this.onFormSave}
			>
				<ClearableInput ref="status_acceptance" name="status_acceptance" type="radio"
				                placeholder="Acceptance Status" defaultValue={status_acceptance}
				                vertical={2}
				                className="col-lg-6 form-control" onChange={this.form.onChange}
				                values={this.state.lists.status_acceptance} returnValue/>
				<ClearableInput ref="status_progress" name="status_progress" type="radio"
				                placeholder="Progress Status" defaultValue={status_progress}
				                vertical={2}
				                className="col-lg-6 form-control" onChange={this.form.onChange}
				                values={this.state.lists.status_progress} returnValue/>
				<ClearableInput ref="result" name="result" type="radio" placeholder="Result" defaultValue={result}
				                className="col-lg-6 form-control" onChange={this.form.onChange}
				                values={this.state.lists.result} returnValue/>
				<ClearableInput name="completed_date" type="date" placeholder="Completed Date..."
				                defaultValue={completed_date} className="col-lg-6 form-control"
				                onChange={this.form.onChange}/>

				<hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

				<ClearableInput ref="additional_notes" name="additional_notes" type="textarea"
				                placeholder="Additional Notes" defaultValue={additional_notes}
				                className="col-lg-12 form-control" onChange={this.form.onChange}/>
			</Row>
		</FormControls>);
	}

	// </editor-fold>
}

export default EditDialog;
