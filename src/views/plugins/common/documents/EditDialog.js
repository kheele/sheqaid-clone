// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

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
import findByIdDocument from "mutations/all/Document/findByIdDocument";
import updateDocument from "mutations/all/Document/updateDocument";
import {CircularProgress} from "@mui/material";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
	pageKey = "ADocumentEdit";
	findById = findByIdDocument;
	removeById = updateDocument;

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

		item: null,
	};
	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor() {
		super();

		this.onNext = this.onNext.bind(this);
		this.onFormSave = this.onFormSave.bind(this);

		this.form = new Form();
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

	//<editor-fold desc="onFormSave">
	onFormSave(e, btn) {
		const {
			form,
			item: {id, data: old_data},
		} = this;
		const {is: {isConsultant, isContractor}, loggedContractor} = storage;

		const onSubmit = (data, onSaved) => {
			if (Object.keys(data).isEmpty()) {
				infoDialog.open("Nothing changed!");
				return;
			}

			console.log(data)

			btn.text("Saving...").disabled();
			progressDialog.open();
			updateDocument({id: this.item.id, ...data}).then(res => {
				console.log("res", res)
				if(res === 'NOT_FOUND') {
					infoDialog.open("This record no longer exist.");
				} else {
					onSaved && onSaved(res);
					infoDialog.open("Record successfully updated.");
					infoDialog.close(2000);
				}
			}).finally(() => {
				btn.text("Save").enabled();
				setTimeout(() => progressDialog.close());
			});
		};

		const {idx} = btn.props;
		if (idx === 0) {
			if (isConsultant && !form.isValid('client')) {
				infoDialog.open('Company is required');
				return;
			}

			const {
				//0
				site, project, client,
			} = form.data;

			const data = {};

			if (isContractor) {
				ShouldUpdate.checkSite(data, old_data, site, 'contractor_site');
			} else {
				ShouldUpdate.checkClient(data, old_data, client);
				ShouldUpdate.checkProject(data, old_data, project);
				ShouldUpdate.checkSite(data, old_data, site);
			}

			onSubmit(data);
			return;
		}

		if (idx === 1) {
			if (!form.isValid('internal_or_external')) {
				infoDialog.open('Please check if a document is Internal / External');
				return;
			}

			const {
				//1
				responsible_department,
				responsible_person,
				expiry,
				internal_or_external,
				category,
				desc,
			} = form.data;

			const data = {};
			ShouldUpdate.checkDepartment(data, old_data, responsible_department, 'responsible_department');
			ShouldUpdate.checkEmployee(data, old_data, responsible_person, 'responsible_person');
			ShouldUpdate.checkDate(data, old_data, expiry, 'expiry');
			ShouldUpdate.check(data, old_data, internal_or_external, 'internal_or_external');
			ShouldUpdate.check(data, old_data, category && category.id, 'category_id');
			ShouldUpdate.check(data, old_data, desc, 'desc');

			onSubmit(data);
			return;
		}

		if (idx === 2) {
			if (!form.isValid('title')) {
				infoDialog.open('Document Title is required');
				return;
			}
			if (!form.isValid('doc')) {
				infoDialog.open('Document is required (Please upload/type)');
				return;
			}

			const {
				//2
				type,
				title,
				doc,
			} = form.data;
			const data = {};
			ShouldUpdate.check(data, old_data, type, 'type');
			ShouldUpdate.check(data, old_data, title, 'title');
			ShouldUpdate.checkFile(data, old_data, doc, 'doc');

			onSubmit(data);
			return;
		}

		return true;
	}

	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onNext">
	onNext(e, btn) {
		const {form, refs: {doc}} = this;
		const {idx} = btn.props;
		if (idx === 1) {
			doc.refresh();
		}

		return true;
	}

	// </editor-fold>

	@computed get item() {
		return this.state.item;
	}

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		if (!this.item) {
			return <CircularProgress className="fixed-center"/>;
		}

		let {
			props: {
				onFormNext, onFormBack, onFormOpen,
				dialog: {props: {showCategory}}
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
					latest_version,
				}
			}
		} = this;

		const {isConsultant, isNoProjects} = storage.is;

		const {expiry} = latest_version || {};

		console.log(this.item)
		return <FormControls onChange={this.form.onChange}>
			{!isNoProjects && <Row
				rendered
				active
				idx={0}
				title="Company / Project / Site"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormSave={this.onFormSave}>
				{isConsultant && <SelectClientInput
					name="client"
					placeholder="Company..."
					defaultValue={RenderUtils.selectedClient.call(this)}
					className="col-lg-4 col-sm-12 form-control"
					onChange={this.form.onChange}
				/>}
				<SelectProjectInput
					name="project"
					placeholder="Project..."
					defaultValue={RenderUtils.selectedProject.call(this)}
					showAll
					className="col-lg-4 col-sm-6 col-xs-12 form-control"
					onChange={this.form.onChange}
				/>
				<SelectSiteInput
					name="site"
					placeholder="Site..."
					defaultValue={RenderUtils.selectedSite.call(this)}
					showAll
					className="col-lg-4 col-sm-6 col-xs-12 form-control"
					onChange={this.form.onChange}
				/>
			</Row>}
			<Row
				rendered
				active={isNoProjects}
				idx={1}
				title="1. Basic Details"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={!isNoProjects && onFormBack}
				onFormSave={this.onFormSave}>
				<SelectDepartmentInput name="responsible_department" placeholder="Department..."
				                       defaultValue={responsible_department} required
				                       className="col-lg-4 col-sm-6 col-xs-12 form-control" onChange={this.form.onChange}/>
				<SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..."
				                     defaultValue={responsible_person} required
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
                onFormBack={onFormBack}
              onFormSave={this.onFormSave}>
                
            </Row>*/}
			<Row
				rendered
				idx={2}
				title="2. Document"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormSave={this.onFormSave}>
				<GDocEditor
					ref="doc"
					name="doc"
					item={item}
					onChangeFileType={this.form.onChange}
					onChangeTitle={this.form.onChange}
					onChange={this.form.onChange}
				/>
			</Row>
		</FormControls>;
	}

	// </editor-fold>
}

export default EditDialog;
