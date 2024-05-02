// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
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
import {ANewDialog} from 'components/dialogs';

import style from "./NewDialog.lazy.css";
import {Dates} from "../../../../utils/Dates";
import insertDocument from "../../../../mutations/all/Document/insertDocument";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
	pageKey = "ADocumentNew";

	constructor(props) {
		super(props, style);
		this.title = "Create " + props.title;
	}

	onCancel(e, btn) {
		this.refs.controls.onRemoveDoc().then(() => {
			super.onCancel(e, btn);
		});
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
			internal_or_external: [{value: "Internal", text: "Internal", checked: false}, {
				value: "External",
				text: "External",
				checked: false
			}],
		},
		title: null,

		last_doc_num: null,
		new_doc_id: null,
	};
	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);

		this.state.title = props.dialog.props.title;

		this.onNext = this.onNext.bind(this);

		this.form = new Form();
	}

	// </editor-fold>

	onRemoveDoc() {
		return this.refs.doc.removeDoc();
	}

	// <editor-fold defaultstate="collapsed" desc="onNext">
	onNext(e, btn) {
		const {form, refs: {doc}} = this;
		const {idx} = btn.props;
		if (idx === 0) {
			const {isConsultant} = storage.is;
			if (isConsultant && !form.isValid('client')) {
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
	async onSubmit(e, btn, onSaved) {
		const {form} = this;
		const {isConsultant} = storage.is;
		const {doc_type} = this.props.dialog.props;

		if (isConsultant && !form.isValid('client')) {
			infoDialog.open('Company is required');
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
			//0
			client,
			project,
			site,
			//1
			responsible_department,
			responsible_person,
			expiry,
			internal_or_external,
			category,
			desc,
//            doc_num, doc_rev_num
			//2
			type,
			title,
			doc,
		} = form.data;
		
		console.log('doc', doc)

		const data = {
			doc_type,
			//0
			client_id: client && client.id,
			project_id: project && project.id,
			site_id: site && site.id,
			//1
			responsible_department_id: responsible_department && responsible_department.id,
			responsible_person_id: responsible_person && responsible_person.id,
			internal_or_external,
			category_id: category && category.id,
			desc,
			//2
			title,
			doc_version_list: {//[{type,expiry,doc,doc_docs_id,doc_num}]
				data: [{
					type,
					expiry: Dates.formatDateSQL(expiry),
					doc: (doc && !isString(doc)) ? doc : null,
					doc_docs_id: (doc && isString(doc)) ? doc : null,
				}]
			},
		};

		console.log(data)

		// doc && indexedStorage.orphanedUploadedDocs.remove(doc);

		btn.text("Saving...").disabled();
		progressDialog.open();
		insertDocument(data).then(res => {
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

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		const {onFormNext, onFormBack, onFormOpen, dialog: {props: {showCategory}}} = this.props;
		const {isConsultant, isNoProjects} = storage.is;

		return <FormControls onChange={this.form.onChange}>
			{!isNoProjects && <Row
				rendered
				active
				idx={0}
				title="Company / Project / Site"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}>
				{isConsultant && <SelectClientInput
					name="client"
					placeholder="Company..."
					className="col-lg-4 col-sm-12 form-control"
					onChange={this.form.onChange}
				/>}
				<SelectProjectInput
					name="project"
					placeholder="Project..."
					showAll
					className="col-lg-4 col-sm-6 col-xs-12 form-control"
					onChange={this.form.onChange}
				/>
				<SelectSiteInput
					name="site"
					placeholder="Site..."
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
				onFormBack={!isNoProjects && onFormBack}>
				<SelectDepartmentInput name="responsible_department" placeholder="Department..." required
				                       className="col-lg-4 col-sm-6 col-xs-12 form-control"
				                       onChange={this.form.onChange}/>
				<SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..." required
				                     className="col-lg-4 col-sm-6 col-xs-12 form-control"
				                     onChange={this.form.onChange}/>
				<ClearableInput name="expiry" type="date" placeholder="Expiry Date..." required
				                className="col-lg-4 col-sm-12 form-control" onChange={this.form.onChange}/>
				<ClearableInput name="internal_or_external" type="radio" placeholder="Internal / External Document?"
				                required className="col-lg-6 col-sm-12 form-control" onChange={this.form.onChange}
				                values={this.state.lists.internal_or_external}/>
				{showCategory &&
					<SelectDocumentCategoryInput ref="category" name="category" placeholder="Document Category..."
					                             className="col-lg-6 col-sm-12 form-control"
					                             onChange={this.form.onChange}/>}
				<ClearableInput name="desc" type="textarea" placeholder="Document Description" required
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
				<GDocEditor
					ref="doc"
					state={this.state}
					name="doc"
					onChangeFileType={this.form.onChange}
					onChangeTitle={this.form.onChange}
					onChange={this.form.onChange}
				/>
			</Row>
		</FormControls>;
	}

	// </editor-fold>
}

export default NewDialog;
