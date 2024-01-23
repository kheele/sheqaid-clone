import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {Button, ClearableInput, RowOrgs,} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {NewEmployeeListTable} from 'components/FormTableComponents';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';
import {ANewDialog} from 'components/dialogs';

import AuditItemTable from './AuditItemTable';

import style from "./NewAuditDialog.lazy.css";
import {Dates} from "utils/Dates";
import insertAudit from "mutations/all/AuditsAndInspections/Audit/insertAudit";

//<editor-fold desc="NewDialog">
@observer
class NewAuditDialog extends ANewDialog {
	pageKey = "NewAuditDialog";
	title = "Create Audit";
	className = 'ANewTableFormDialog';
	
	constructor(props) {
		super(props, style);
	}
	
	get controls() {
		return Controls;
	}
}

//</editor-fold>

@observer
class Controls extends React.Component {
	path = "plugin_sheq_assist/21_Internal_Audit/audit/";
	
	constructor() {
		super();
		
		this.onNext = this.onNext.bind(this);
		this.onFormChange = this.onFormChange.bind(this);
		
		this.form = new Form();
	}
	
	//<editor-fold desc="onNext">
	onNext(e, btn) {
		const {form} = this;
		const {idx} = btn.props;
		const {isConsultant} = storage.is;
		if (idx === 1) {
			if (isConsultant && !form.isValid('client')) {
				infoDialog.open('Company is required');
				return;
			}
			if (!form.isValid('date')) {
				infoDialog.open('Audit Date is required');
				return;
			}
		}
		if (idx === 2) {
			if (!form.isValid('representative_list')) {
				infoDialog.open('Company Representative(s) is required');
				return;
			}
		}
		if (idx === 3) {
			if (!form.isValid('auditor_list')) {
				infoDialog.open('Auditor(s) is required');
				return;
			}
		}
		
		return true;
	}
	
	//</editor-fold>
	
	//<editor-fold desc="onFormChange">
	onFormChange(idx) {
		const {list} = this.refs;
		if (idx === 5 && list) {
			list.refresh();
		}
	}
	
	//</editor-fold>
	
	//<editor-fold desc="onSubmit">
	onSubmit(e, btn, onSaved) {
		const {form} = this;
		const {isConsultant} = storage.is;
		
		if (isConsultant && !form.isValid('client')) {
			infoDialog.open('Company is required');
			return;
		}
		if (!form.isValid('date')) {
			infoDialog.open('Audit Date is required');
			return;
		}
		
		// if (!form.isValid('representative_list') || form.get('representative_list').isEmpty()) {
		//     infoDialog.open('Company Representative(s) is/are required');
		//     return;
		// }
		// if (!form.isValid('auditor_list') || form.get('auditor_list').isEmpty()) {
		//     infoDialog.open('Auditor(s) is/are required');
		//     return;
		// }
		
		// if (!form.isValid('list') || form.get('list').isEmpty()) {
		//     infoDialog.open('Findings are required');
		//     return;
		// }
		
		const {
			//0
			client, project, site,
			//1
			scope, date, type,
			//2
			representative_list,
			//3
			auditor_list,
			//4
			definition_list,
			//5
			list,
		} = form.data;
		const data = {
			//0
			client_id: client && client.id,
			project_id: project && project.id,
			site_id: site && site.id,
			//1
			scope,
			date: Dates.formatDateSQL(date),
			type,
			//2
			representative_list: {
				data: (representative_list || []).map((v) => {
					const {other_person, employee} = v;
					if (other_person) {
						const {job_position} = other_person;
						if (job_position) {
							other_person.job_position_id = job_position.id;
							delete other_person.job_position;
						}
						return {other_person: {data: other_person}};
					} else if (employee) {
						const {id} = employee;
						return {employee_id: id};
					} else {
						return {employee_id: v.id};
					}
				})
			},
			//3
			auditor_list: {
				data: (auditor_list || []).map((v) => {
					const {other_person, employee} = v;
					if (other_person) {
						const {job_position} = other_person;
						if (job_position) {
							other_person.job_position_id = job_position.id;
							delete other_person.job_position;
						}
						return {other_person: {data: other_person}};
					} else if (employee) {
						const {id} = employee;
						return {employee_id: id};
					} else {
						return {employee_id: v.id};
					}
				})
			},
			//4
			definition_list: {data: (definition_list || [])},//[{title, desc}]
			//5
			list: {
				data: (list || []).map((
					{
						element, sub_element,
						responsible_person, target_date, due_date,
						audit_findings, audit_summary,
						possible_score, achieved_score,
						comments, compliance,
					}
				) => ({
					achieved_score,//
					audit_findings,//
					audit_summary,//
					comments,//
					compliance,//
					due_date: Dates.formatDateSQL(due_date),//
					element,//
					possible_score,//
					target_date: Dates.formatDateSQL(target_date),//
					responsible_person_id: responsible_person && responsible_person.id,//
					sub_element,//
				}))
			},//[{element, sub_element, audit_findings, audit_summary, possible_score, achieved_score, comments}]
		};
		
		console.log(data)
		
		btn.text("Saving...").disabled();
		progressDialog.open();
		insertAudit(data).then(res => {
			console.log("res", res)
			onSaved && onSaved(res);
			infoDialog.open("Record successfully saved.");
			infoDialog.close(2000);
			this.props.close();
		}).finally(() => {
			btn.text("Save").enabled();
			setTimeout(() => progressDialog.close());
		});
	}
	
	//</editor-fold>
	
	get item() {
		return this.props.state.item;
	}
	
	//<editor-fold desc="render">
	render() {
		const {item} = this;
		const {onFormNext, onFormBack, onFormOpen} = this.props;
		let _client, _project, _site, _scope, _date, _type, _representative_list, _auditor_list, _definition_list,
			_list;
		if (item) {
			const {
				client,
				project,
				site,
				scope,
				date,
				type,
				representative_list,
				auditor_list,
				definition_list,
				list
			} = item.data;
			_client = client;
			_project = project;
			_site = site;
			_scope = scope;
			_date = date;
			_type = type;
			_representative_list = representative_list;
			_auditor_list = auditor_list;
			_definition_list = definition_list;
			_list = list;
		}
		
		return (<FormControls>
			<RowOrgs
				onChange={this.form.onChange}
				client={_client}
				project={_project}
				site={_site}
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<Row
					rendered
					idx={1}
					title="1. General Details"
				>
					<ClearableInput name="scope" type="text" placeholder="Scope Of Audit" defaultValue={_scope}
					                className="col-lg-4 form-control"
					                onChange={this.form.onChange}/>
					<ClearableInput name="date" type="date" placeholder="Audit Date..."
					                defaultValue={_date || new Date()} required
					                className="col-lg-4 form-control"
					                onChange={this.form.onChange}/>
					<ClearableInput name="type" type="text" placeholder="Audit Type" defaultValue={_type}
					                className="col-lg-4 form-control"
					                onChange={this.form.onChange}/>
				</Row>
			</RowOrgs>
			<Row
				rendered
				idx={2}
				title="2. Company Representative(s)"
				className="row-representatives"
				sectionClassName="min-h-140"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
			>
				<NewEmployeeListTable
					name="representative_list"
					defaultValue={_representative_list ? [..._representative_list, null] : [null]}
					onChange={this.form.onChange}
				/>
			</Row>
			<Row
				rendered
				idx={3}
				title="3. Auditor(s)"
				className="row-auditors"
				sectionClassName="min-h-140"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
			>
				<NewEmployeeListTable name="auditor_list"
				                      defaultValue={_auditor_list ? [..._auditor_list, null] : [null]}
				                      onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={4}
				title="4. Definitions"
				className="row-definitions"
				sectionClassName="min-h-140"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
			>
				<DefinitionsTable name="definition_list"
				                  defaultValue={_definition_list ? [..._definition_list, null] : [null]}
				                  onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={5}
				title="5. Findings"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				className="row-table"
				sectionClassName="row-findings"
			>
				<AuditItemTable ref="list" name="list" defaultValue={_list} isNew={!item}
				                onChange={this.form.onChange}/>
			</Row>
		</FormControls>);
	}
	
	//</editor-fold>
}

//<editor-fold desc="DefinitionsTable">
@observer
class DefinitionsTable extends ATableSavable {
	
	@observable
	selfState = {};
	
	constructor(props) {
		super(props);
		this.insertAt = this.insertAt.bind(this);
	}
	
	insertAt(list, form) {
		list.insertAt(list.length - 1, form);
	}
	
	renderItem(n, onClick) {
		const item = this.state.list[n];
		if (item) {
			return <TRow key={"item-" + n} className="tr-readonly">
				<div className="td fixed-flex min-w-300">{item.title}</div>
				<div className="td">{item.desc}</div>
				<div className="td fixed-flex">
					<Button idx={n} action="delete" className="btn btn-primary pull-right" onClick={onClick}>
						<i className="fa fa-times-circle"/>
					</Button>
				</div>
			</TRow>;
		} else {
			return <TRow key="item-new" className="w-full">
				<div className="td fixed-flex min-w-300">
					<ClearableInput ref={this.onSetRef} name="title" type="text" className="form-control"
					                onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={this.onSetRef} name="desc" type="text" className="form-control"
					                onChange={this.onChange}/>
				</div>
				<div className="td fixed-flex w-70">
					<Button idx={n} action="save" className="btn btn-primary pull-right" onClick={onClick}>
						<i className="fa fa-check"/>
					</Button>
				</div>
			</TRow>;
		}
	}
	
	render() {
		return (<Table className="DefinitionsTable">
			<THead className="align-left">
				<div className="td fixed-flex min-w-300">Title</div>
				<div className="td">Description</div>
				<div className="td fixed-flex"></div>
			</THead>
			<TBody ref="body" title="Definitions" renderItem={this.renderItem} onClick={this.onClick} state={this.state}
			       onLoadList={this.onLoadList} disablePullToRefresh={true}/>
		</Table>);
	}
}

//</editor-fold>

export default NewAuditDialog;
