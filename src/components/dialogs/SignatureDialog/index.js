//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';
import {CircularProgress} from "@mui/material";
import {DocusealBuilder} from '@docuseal/react'

import Form from 'utils/Form';

import {ANewDialog} from '../../dialogs';
import {execWhen} from 'utils/Utils';

import style from "./SignatureDialog.lazy.css";
import {FormControls, Row} from "../../FormComponents";
import {NewSignatureSettingsListTable} from "../../FormTableComponents";
import {
	ClearableInput, SelectEmployeeInput,
	SelectModuleClaimsInput,
	SelectModuleExtraInput,
	SelectModuleHRInput,
	SelectModuleSHEQInput
} from "../../inputs";
import pluginManager from "app/PluginManager";
import insertSignatureSetting from "mutations/all/SignatureSetting/insertSignatureSetting";
import {findDOMNode} from "react-dom";
//</editor-fold>

//<editor-fold desc="Dialog">
@observer
class Dialog extends ANewDialog {
	pageKey = "SignatureDialog";
	title = "Signature Settings";
	
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
	path = 'plugin_sheq_assist/signature-settings/';
	
	@observable
	state = {
		lists: {
			plugin: [],
			doc_name: [],
			is_employee_owning: [
				{text: 'Yes', value: true, checked: false},
				{text: 'No', value: false, checked: false},
			],
		},
		plugin: null,
	};
	
	//<editor-fold desc="constructor">
	constructor() {
		super();
		
		this.onFormChange = this.onFormChange.bind(this);
		this.onNext = this.onNext.bind(this);
		
		this.form = new Form();
		this.form.addChangeOne("plugin", this.onChangePlugin.bind(this));
	}
	
	//</editor-fold>
	
	componentWillMount() {
		this.state.lists.plugin = pluginManager.listAll.filter(({data: {status}}) => status === "Installed").map((value) => ({
			label: value.data.title, value,
		}));
	}
	
	//<editor-fold desc="onChanges">
	onChangePlugin(el, val) {
		this.state.plugin = val;
	}
	
	//</editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onFormChange">
	onFormChange(idx) {
		const {dialog} = this.props;
		switch (idx - 1) {
			case 3:
				dialog.cssWidth = 'calc(100% - 30px)';
				dialog.cssHeight = '100%';
				dialog.addClass('no-border-radius');
				break;
			default:
				dialog.cssWidth = '900px';
				dialog.cssHeight = 'calc(100% - 30px)';
				dialog.removeClass('no-border-radius');
				break;
		}
		return true;
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onNext">
	onNext(e, btn) {
		const {form} = this;
		const {idx} = btn.props;
		if (idx === 0) {
		
		}
		if (idx === 2) {
			const {docusealBuilderWrapper} = this.refs;
			docusealBuilderWrapper.load(form.data);
		}
		
		return true;
	}
	
	// </editor-fold>
	
	//<editor-fold desc="onSubmit">
	onSubmit(e, btn, onSaved) {
		const {form} = this;
		
		if (!form.isValid('plugin')) {
			infoDialog.open('Plugin is required');
			return;
		}
		if (!form.isValid('module')) {
			infoDialog.open('Module is required');
			return;
		}
		if (!form.isValid('is_employee_owning')) {
			infoDialog.open('Select "Requires Employee Owning The Form" option');
			return;
		}
		if (!form.get('is_employee_owning') && !form.isValid('signature_settings_list')) {
			infoDialog.open('Other Employee(s) To Sign is/are required');
			return;
		}
		
		const {
			plugin, module,
			is_employee_owning,
			signature_settings_list
		} = form.data;
		
		const data = {
			is_employee_owning,
			plugin_id: plugin.id,
			module_id: module.module.id,
			signature_settings_list: {
				data: (signature_settings_list || []).map(({job_position, employee,}) => ({
					job_position_id: job_position && job_position.id,
					employee_id: employee && employee.id,
				})),
			}
		};
		
		console.log(data)
		
		btn.text("Saving...").disabled();
		insertSignatureSetting(data).then(res => {
			console.log("res", res)
			onSaved && onSaved(res);
			infoDialog.open("Record successfully saved.");
			infoDialog.close(2000);
			this.props.close();
		}).finally(() => {
			btn.text("Save").enabled();
		});
	}
	
	//</editor-fold>
	
	//<editor-fold desc="defaultValue">
	@computed
	get defaultValue() {
		let value;
		if (this.state.plugin) {
			value = this.state.plugin;
		} else {
			const {plugin, module} = this.props.dialog.props;
			const p = this.state.lists.plugin.find(({value: {data: {key}}}) => key === plugin);
			if (p) {
				value = p.value;
			}
		}
		
		if (value) {
			return {label: value.data.title, value};
		}
	}
	
	//</editor-fold>
	
	//<editor-fold desc="render">
	render() {
		if (this.state.lists.plugin.isEmpty()) {
			return <CircularProgress className="fixed-center"/>;
		}
		
		const {onFormNext, onFormBack, onFormOpen, onFormChange} = this.props;
		
		const {module} = this.props.dialog.props;
		return <FormControls>
			<Row
				activeAlways
				rendered
				idx={0}
				title="Plugin & Module"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormChange={onFormChange}
			>
				<ClearableInput name="plugin" type="select" placeholder="Plugin" defaultValue={this.defaultValue} vertical
				                className="col-lg-12 form-control" onChange={this.form.onChange}
				                values={this.state.lists.plugin} returnValue/>
				<SelectModule state={this.state} defaultValue={module} onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={1}
				title="Employee(s) To Sign"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
				onFormChange={onFormChange}
			>
				<ClearableInput
					name="is_employee_owning"
					type="radio"
					placeholder="Requires Employee Owning The Form?"
					vertical
					className="col-lg-12 form-control"
					onChange={this.form.onChange}
					values={this.state.lists.is_employee_owning}
					returnValue
				/>
				<hr/>
				<label className="margin-0 margin-t-10 col-lg-12">Other Employee(s) To Sign</label>
				<NewSignatureSettingsListTable name="signature_settings_list" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={2}
				title="Document Template"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
				onFormChange={onFormChange}
			>
				<ClearableInput
					name="doc_name"
					type="select"
					placeholder="Document Name"
					className="col-lg-12 form-control"
					onChange={this.form.onChange}
					values={this.state.lists.doc_name}
					returnValue
					add
				/>
			</Row>
			<Row
				rendered
				idx={3}
				title="Document Template Builder"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormChange={onFormChange}
			>
				<DocusealBuilderWrapper ref="docusealBuilderWrapper" state={this.state}/>
			</Row>
		</FormControls>;
	}
	
	//</editor-fold>
}

//<editor-fold desc="DocusealBuilderWrapper">
@observer
class DocusealBuilderWrapper extends React.Component {
	@observable state = {
		token: null,
		roles: [],
	};
	
	load(data) {
		const {roles} = this;
		
		let {
			plugin, //
			module,//
			doc,
			doc_name,//
			is_employee_owning,
			signature_settings_list,
		} = data;
		
		signature_settings_list = (signature_settings_list || []).map(({job_position, employee,}) => ({
			job_position: job_position && {id: job_position.id, name: job_position.data.name},
			employee: employee && {id: employee.id, full_name: employee.data.full_name, email: employee.data.email},
		}));
		
		if (is_employee_owning) {
			roles.push("Employee");
		}
		
		const job_position_list = signature_settings_list.filter(v => !!v.job_position && !v.employee).map(v => v.job_position.name);
		roles.push(...job_position_list);
		
		const employee_list = signature_settings_list.filter(v => !v.job_position && !!v.employee).map(v => v.employee.full_name);
		roles.push(...employee_list);
		
		this.state.token = null;
		const buildToken = sockets.of('doc-signing-settings/api/docuseal').fn('builder_token');
		buildToken({
			plugin_key: plugin.data.key,
			module_key: module.module.key,
			doc,
			doc_name,
			is_employee_owning,
		}).then(res => {
			this.state.token = res;
			
			execWhen(() => findDOMNode(this)).then(ref => {
				console.log('ref', ref)
				console.log('ref.shadowRoot', ref.shadowRoot)
				const style = document.createElement('style');
				style.innerHTML = `
					docuseal-builder .sticky{
					    display: none;
					}
					
					.main_container{
					    margin-top: 5px;
					    margin-bottom: 5px;
					}
					#pages_container{
					    /* border: 5px solid #eee; */
					    box-shadow: 0 0 16px #b9b9b9;
					    padding: 0;
					    margin-right: 10px;
					    border-radius: 8px 8px 0 0;
					}
				`;
				ref.shadowRoot.appendChild(style);
			});
		});
	}
	
	@computed get token() {
		return this.state.token;
	}
	
	@computed get roles() {
		return this.state.roles;
	}
	
	render() {
		const {token, roles} = this;
		if (token === null) return null;
		
		return <DocusealBuilder
			ref="docusealBuilder"
			token={token}
			roles={roles}
		/>;
	}
}

//</editor-fold>

//<editor-fold desc="SelectModule">
@observer
class SelectModule extends React.Component {
	render() {
		const {state: {plugin}, defaultValue, onChange} = this.props;
		
		if (!plugin) {
			return null;
		}
		
		const {data: {key}} = plugin;
		
		console.log('plugin', plugin, defaultValue)
		
		let node = [<hr/>];
		if (key === 'plugin_sheq_assist') {
			node.push(<SelectModuleSHEQInput name="module" defaultValue={defaultValue} className="col-lg-12"
			                                 onChange={onChange}/>);
		} else if (key === 'plugin_hr_management') {
			node.push(<SelectModuleHRInput name="module" defaultValue={defaultValue} className="col-lg-12"
			                               onChange={onChange}/>);
		} else if (key === 'plugin_extra') {
			node.push(<SelectModuleExtraInput name="module" defaultValue={defaultValue} className="col-lg-12"
			                                  onChange={onChange}/>);
		} else if (key === 'plugin_claim_management') {
			node.push(<SelectModuleClaimsInput name="module" defaultValue={defaultValue} className="col-lg-12"
			                                   onChange={onChange}/>);
		} else {
			return null;
		}
		
		return <>{node}</>;
	}
}

//</editor-fold>

export default Dialog;
