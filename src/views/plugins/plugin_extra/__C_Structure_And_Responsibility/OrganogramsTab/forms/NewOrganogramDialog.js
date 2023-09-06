// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput, SelectClientInput, SelectProjectInput, SelectSiteInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import TypedWrapper from "./TypedWrapper";

import insertOrganogram from "mutations/all/StructureAndResponsibility/Organogram/insertOrganogram"

import style from "./NewOrganogramDialog.lazy.css";
import {toDataURI} from "utils/UtilsFuns";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewOrganogramDialog extends ANewDialog {
	pageKey = "NewOrganogramDialog";
	title = "Create Organogram";

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
	path = "plugin_sheq_assist/StructureAndResponsibility/organograms/";

	// <editor-fold defaultstate="collapsed" desc="fields">
	@observable
	state = {
		lists: {
			target: [{text: 'Company', value: 'Client'}, {text: 'Project', value: 'Project'}, {text: 'Site', value: 'Site'}],
			types: [{value: "Upload", text: "Document (PDF/Spreadsheet)", checked: false}, {
				value: "Type",
				text: "Typed",
				checked: false
			}]
		},
		target: null,
		showDoc: false,
		showTyping: false
	};
	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor() {
		super();

		this.onNext = this.onNext.bind(this);

		this.form = new Form();
		this.onChangeTarget = this.onChangeTarget.bind(this);
		this.onChangeType = this.onChangeType.bind(this);
		this.form.addChangeOne("target", this.onChangeTarget);
		this.form.addChangeOne("type", this.onChangeType);
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onChanges">
	onChangeTarget(el, val) {
		this.state.target = val;
	}

	onChangeType(el, val) {
		if (val) {
			if (val === 'Upload') {
				this.state.showDoc = true;
				this.state.showTyping = false;
			} else if (val === 'Type') {
				this.state.showTyping = true;
				this.state.showDoc = false;
			}
		} else {
			this.state.showTyping = false;
			this.state.showDoc = false;
		}
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onNext">
	onNext(e, btn) {
		const {form} = this;
		const {idx} = btn.props;
		if (idx === 0) {
			if (!form.isValid('target')) {
				infoDialog.open('Organogram For is required');
				return;
			}
			if (!form.isValid('client')) {
				infoDialog.open('Company is required');
				return;
			}
			const target = form.get('target');
			if ((target === 'Project' || target === 'Site') && !form.isValid('project')) {
				infoDialog.open('Project is required');
				return;
			}
			if (target === 'Site' && !form.isValid('site')) {
				infoDialog.open('Site is required');
				return;
			}
		}
		if (idx === 1) {
			if (!form.isValid('type')) {
				infoDialog.open('Organogram Source is required');
				return;
			}
		}
		if (idx === 2) {
			if (form.get("type") === 'Type' && !form.isValid('list')) {
				infoDialog.open('Organogram List is required (Please add)');
				return;
			} else if (form.get("type") === 'Upload' && !form.isValid('doc')) {
				infoDialog.open('Document is required (Please upload)');
				return;
			}
		}

		return true;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	async onSubmit(e, btn, onSaved) {
		const {form} = this;

		const {hasProjects} = storage.is;

		if (hasProjects) {
			if (!form.isValid('target')) {
				infoDialog.open('Organogram For is required');
				return;
			}
			if (!form.isValid('client')) {
				infoDialog.open('Company is required');
				return;
			}
			const target = form.get('target');
			if ((target === 'Project' || target === 'Site') && !form.isValid('project')) {
				infoDialog.open('Project is required');
				return;
			}
			if (target === 'Site' && !form.isValid('site')) {
				infoDialog.open('Site is required');
				return;
			}
		}

		if (!form.isValid('type')) {
			infoDialog.open('Organogram Source is required');
			return;
		}

		if (form.get("type") === 'Type' && !form.isValid('list')) {
			infoDialog.open('Organogram List is required (Please add)');
			return;
		} else if (form.get("type") === 'Upload' && !form.isValid('doc')) {
			infoDialog.open('Document is required (Please upload)');
			return;
		}

		const {
			client, project, site, target, type, doc, employee_list
		} = form.data;
		const data = {
			//0
			client_id: client && client.id,
			project_id: project && project.id,
			site_id: site && site.id,
			target,
			type,
			employee_list: {
				data: (employee_list || []).map(({employee_list, team, employee, employee_reported_to}) => {
					return {
						employee_reported_to_id: employee_reported_to && employee_reported_to.id,
						employee_id: employee && employee.id,
						team_id: team && team.id,
						employee_list: {
							data: (employee_list || []).map(({id: employee_id}) => ({employee_id}))
						}
					};
				})
			},
			doc: doc && doc.path,
		};

		console.log(data)

		btn.text("Saving...").disabled();
		progressDialog.open();
		insertOrganogram(data).then(res => {
			console.log("res", res)
			onSaved && onSaved(res);
			infoDialog.open("Record successfully saved.");
			infoDialog.close(2000);
			this.props.close();
		}).finally(() => {
			btn.text("Save").enabled();
			progressDialog.close();
		});
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		const {props: {onFormNext, onFormBack, onFormOpen}} = this;
		const {isContractor, hasProjects} = storage.is;
		return <FormControls>
			{hasProjects && <Row
				rendered
				active
				idx={0}
				title={(!isContractor && "Company / Project / ") + "Site"}
				onFormOpen={onFormOpen}
				onFormNext={hasProjects && onFormNext}
			>
				<ClearableInput name="target" type="radio" defaultValue={!isContractor && "Site"} placeholder="Organogram For"
				                className="col-lg-7 pull-left-2_5 form-control" onChange={this.form.onChange}
				                values={this.state.lists.target}/>
				{!isContractor && <SelectClientInputWrapper state={this.state} onChange={this.form.onChange}/>}
				{!isContractor && <SelectProjectInputWrapper state={this.state} onChange={this.form.onChange}/>}
				<SelectSiteInputWrapper state={this.state} onChange={this.form.onChange}/>
			</Row>}
			<Row
				rendered
				active={!hasProjects}
				idx={1}
				title="1. Source"
				onFormOpen={onFormOpen}
				onFormBack={hasProjects && onFormBack}
				onFormNext={onFormNext}
			>
				<ClearableInput name="type" type="radio" placeholder="Organogram Source"
				                className="col-lg-8 pull-left-2 form-control" onChange={this.form.onChange}
				                values={this.state.lists.types}/>
			</Row>
			<UploadedWrapper onFormOpen={onFormOpen} onFormBack={onFormBack} state={this.state}
			                 onChange={this.form.onChange}/>
			<TypedWrapper ref="typedWrapper" refName="newDialog" onFormOpen={onFormOpen} onFormBack={onFormBack}
			              state={this.state} onChange={this.form.onChange}/>
		</FormControls>;
	}

	// </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="SelectClientInputWrapper">
@observer
class SelectClientInputWrapper extends React.Component {

	render() {
		const {state: {target}, onChange} = this.props;
		let w, left;
		if (target === "Client") {
			w = 6;
			left = " pull-left-" + 3;
		} else if (target === "Project") {
			w = 4;
			left = " pull-left-" + 2;
		} else if (target === "Site") {
			w = 4;
			left = "";
		} else {
			return null;
		}
		return <SelectClientInput key={new Date().getTime()} name="client" placeholder="Company..." required
		                          className={"col-lg-" + w + left + " form-control"} onChange={onChange}/>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="SelectProjectInputWrapper">
@observer
class SelectProjectInputWrapper extends React.Component {

	render() {
		const {state: {target}, onChange} = this.props;
		return (target === "Project" || target === "Site") &&
			<SelectProjectInput name="project" placeholder="Project..." required className="col-lg-4 form-control"
			                    onChange={onChange}/>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="SelectSiteInputWrapper">
@observer
class SelectSiteInputWrapper extends React.Component {

	render() {
		const {state: {target}, onChange} = this.props;
		return target === "Site" &&
			<SelectSiteInput name="site" placeholder="Site..." required className="col-lg-4 form-control"
			                 onChange={onChange}/>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="UploadedWrapper">
@observer
class UploadedWrapper extends React.Component {

	render() {
		const {onFormOpen, onFormBack, state: {showDoc}, onChange} = this.props;
		return showDoc && <Row
			rendered
			idx={2}
			title="2. Uploaded Organogram Structure"
			className="row-source"
			onFormOpen={onFormOpen}
			onFormBack={onFormBack}>
			<UploadButton
				name="doc"
				buttonTitle="Document (PDF/Excel)"
				type={['PDF', 'Excel']}
				showOnlyIcon
				className="col-lg-6 col-xs-12 hor-center"
				onChange={onChange}
			/>
		</Row>;
	}
}

// </editor-fold>

export default NewOrganogramDialog;
