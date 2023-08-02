// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ShouldUpdate} from 'utils/Utils';
import {GDocEditor} from 'components/documents';

import {
	ClearableInput,
	SelectClientInput,
	SelectDepartmentInput, SelectDocumentCategoryInput,
	SelectEmployeeInput,
	SelectProjectInput,
	SelectSiteInput
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import style from "./EditDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
	pageKey = "ADocumentEdit";

	constructor(props) {
		super(props, style);
	}

	get title() {
		return "Edit " + this.props.title;
	}

	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends React.Component {

	// <editor-fold defaultstate="collapsed" desc="fields">
	@observable
	state = {
		lists: {
			types: [{value: "Upload", text: "Uploaded", checked: false}, {value: "Type", text: "Typed", checked: false}],
			internal_or_external: [{value: "Internal", text: "Internal", checked: false}, {
				value: "External",
				text: "External",
				checked: false
			}],
			category: ['Company Certificate', 'Company Insurance', 'Company Registration', 'Company Regulatory Body']
		},
		title: null,

		last_doc_num: null,
		showDoc: false,
		selectedClient: null
	};
	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor() {
		super();

		this.onNext = this.onNext.bind(this);

		this.form = new Form();
		this.onChangeType = this.onChangeType.bind(this);
		this.onChangeClient = this.onChangeClient.bind(this);
		this.form.addChangeOne("type", this.onChangeType);
		this.form.addChangeOne("company", this.onChangeClient);
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onChanges">
	onChangeType(el, val) {
		if (val) {
			if (val === 'Upload') {
				this.state.showDoc = true;
				this.state.showTinyMCE = false;
			} else if (val === 'Type') {
				console.log('here')
				this.state.showTinyMCE = true;
				this.state.showDoc = false;
			}
		} else {
			this.state.showTinyMCE = false;
			this.state.showDoc = false;
		}
	}

	onChangeClient(el, val) {
		this.state.selectedClient = val;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="componentDidMount">
	componentDidMount() {
//        neonBinding.events.emit(this.props.path + "get_last_doc_num").then(res => {
//            console.log('t:', res)
//            this.state.last_doc_num = (res || 0) + 1;
//            execWhen(() => this.refs.doc_num).then(doc_num => {
//                doc_num.onChange(this.state.last_doc_num);
//            });
//        });
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onNext">
	onNext(e, btn) {
		const {form, refs: {doc}} = this;
		const {idx} = btn.props;
		if (idx === 0) {
			const {isConsultant} = storage.is;
			if (isConsultant && !form.isValid('company')) {
				infoDialog.open('Company is required');
				return;
			}
		} else if (idx === 1) {
			if (!form.isValid('internal_or_external')) {
				infoDialog.open('Please check if a document is Internal / External');
				return;
			}

			doc.refresh();
		} else if (idx === 2) {
			if (!form.isValid('title')) {
				infoDialog.open('Document Title is required');
				return;
			}
			if (!form.isValid('doc')) {
				infoDialog.open('Document is required (Please upload/type)');
				return;
			}
		}

		return true;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	onSubmit(e, btn, onSaved) {
		const {form, item: {data: old_data}} = this;
		const {isConsultant} = storage.is;

		if (isConsultant && !form.isValid('company')) {
			infoDialog.open('Company is required');
			return;
		}

		if (!form.isValid('internal_or_external')) {
			infoDialog.open('Please check if a document is Internal / External');
			return;
		}

		if (!form.isValid('title')) {
			infoDialog.open('Document Title is required');
			return;
		}
		if (!form.isValid('doc')) {
			infoDialog.open('Document is required (Please upload/type)');
			return;
		}

		const {
			site, project, company,
			responsible_department, responsible_person,
			expiry, internal_or_external, desc,
			category, title, doc,
//            doc_num, doc_rev_num
		} = form.data;
		const data = {};
		if (isConsultant) {
			ShouldUpdate.checkClient(data, old_data, company, "company");
		} else {
//            const {name} = storage.loggedUser.company.data;
//            data.company = {name: name};
		}

		ShouldUpdate.checkProject(data, old_data, project);
		ShouldUpdate.checkSite(data, old_data, site);
		ShouldUpdate.checkDepartment_deprecated(data, old_data, responsible_department, 'responsible_department');

		ShouldUpdate.checkEmployee_deprecated(data, old_data, responsible_person, 'responsible_person');
		ShouldUpdate.checkDate_deprecated(data, old_data, expiry, 'expiry');
		ShouldUpdate.check(data, old_data, internal_or_external, 'internal_or_external');
		ShouldUpdate.check(data, old_data, category, 'category');
		ShouldUpdate.check(data, old_data, desc, 'desc');

		ShouldUpdate.check(data, old_data, title, 'title');

		console.log(data)

		btn.text("Saving...").disabled();
		neonBinding.events.emit(this.props.path + "update", this.item.id, data).then(res => {
			console.log("res", res)
			onSaved && onSaved(res);
			infoDialog.open("Record successfully updated.");
			infoDialog.close(2000);
			this.props.close();
		}).finally(() => {
			btn.text("Save").enabled();
		});
	}

	// </editor-fold>

	get item() {
		return this.props.state.item;
	}

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		if (!this.item)
			return null;
		let {
			props: {
				onFormNext, onFormBack, onFormOpen,
				dialog: {renderProfileCover, props: {showCategory}}
			},
			item, item: {
				id, data: {
					created_at,
					company,
					client,
					project,
					site,
					internal_or_external,
					title,
					desc,
					responsible_department,
					responsible_person,
					contractor,
					contractor_site,
					contractor_user,
					employee,
					doc_type,
					category,
					removed,

					doc_version_list: _doc_version_list,
				}
			}
		} = this;

		const responsible_departmentDefault = responsible_department ? {
			label: responsible_department.name,
			value: responsible_department
		} : null;
		let responsible_personDefault;
		if (responsible_person) {
			const {lname, fname} = responsible_person;
			responsible_personDefault = {label: lname + ' ' + fname, value: responsible_person};
		}

		const {isConsultant, isNoProjects} = storage.is;

		console.log(this.item)
		return <FormControls onChange={this.form.onChange}>
			{!isNoProjects && <Row
				rendered
				active
				idx={0}
				title="Company / Project / Site"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}>
				{isConsultant && <SelectClientInput name="company" placeholder="Company..."
				                                    defaultValue={RenderUtils.selectedClient.call(this, 'company')} required
				                                    className="col-lg-4 col-sm-12 form-control" onChange={this.form.onChange}/>}
				<SelectProjectInput name="project" placeholder="Project..."
				                    defaultValue={RenderUtils.selectedProject.call(this)} required showAll
				                    className="col-lg-4 col-sm-6 col-xs-12 form-control" onChange={this.form.onChange}/>
				<SelectSiteInput name="site" placeholder="Site..." defaultValue={RenderUtils.selectedSite.call(this)} required
				                 showAll className="col-lg-4 col-sm-6 col-xs-12 form-control" onChange={this.form.onChange}/>
			</Row>}
			<Row
				rendered
				active={isNoProjects}
				idx={1}
				title="1. Document Details"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={!isNoProjects && onFormBack}>
				<SelectDepartmentInput name="responsible_department" placeholder="Department..."
				                       defaultValue={responsible_departmentDefault} required
				                       className="col-lg-4 col-sm-6 col-xs-12 form-control" onChange={this.form.onChange}/>
				<SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..."
				                     defaultValue={responsible_personDefault} required
				                     className="col-lg-4 col-sm-6 col-xs-12 form-control" onChange={this.form.onChange}/>
				<ClearableInput name="expiry" type="date" placeholder="Expiry Date..." defaultValue={expiry} required
				                className="col-lg-4 col-sm-6 col-xs-12 form-control" onChange={this.form.onChange}/>
				<ClearableInput name="internal_or_external" type="radio" placeholder="Internal / External Document?"
				                defaultValue={internal_or_external} required className="col-lg-6 col-sm-12 form-control"
				                onChange={this.form.onChange} values={this.state.lists.internal_or_external}/>
				{showCategory && <SelectDocumentCategoryInput ref="category" name="category" placeholder="Document Category..."
				                                              defaultValue={category}
				                                              className="col-lg-6 col-sm-12 form-control"
				                                              onChange={this.form.onChange}/>}
				<ClearableInput name="desc" type="textarea" placeholder="Document Description" defaultValue={desc} required
				                className="col-lg-12 form-control" onChange={this.form.onChange}/>
			</Row>
			{/*<Row
                rendered
                idx={2}
                title="2. Privacy Details" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext} 
                onFormBack={onFormBack}>
                
            </Row>*/}
			<Row
				rendered
				idx={2}
				title="2. Document"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}>
				<GDocEditor ref="doc" name="doc" item={item} onChangeTitle={this.form.onChange} onChange={this.form.onChange}/>
			</Row>
		</FormControls>;
	}

	// </editor-fold>
}

export default EditDialog;
