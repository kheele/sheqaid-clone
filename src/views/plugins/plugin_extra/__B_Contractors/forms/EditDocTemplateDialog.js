// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {
	ClearableInput,
	SelectClientInput,
	SelectContractorQuestionnaireTemplateCategoryInput,
	SelectProjectInput,
	SelectSiteInput,
	UploadButton
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import style from "./EditDocTemplateDialog.lazy.css";
import updateContractorsQuestionnaireTemplate
	from "mutations/all/Questionnaires/ContractorsQuestionnaireTemplate/updateContractorsQuestionnaireTemplate";
import findByIdContractorsQuestionnaireTemplate
	from "mutations/all/Questionnaires/ContractorsQuestionnaireTemplate/findByIdContractorsQuestionnaireTemplate";
import {CircularProgress} from "@mui/material";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
	pageKey = "EditDocTemplateDialog";
	findById = findByIdContractorsQuestionnaireTemplate;
	removeById = updateContractorsQuestionnaireTemplate;

	constructor(props) {
		super(props, style);
	}

	get title() {
		return "Edit Questionnaire Template";
	}

	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends React.Component {
	path = "plugin_sheq_assist/contractors/questionnaires/templates/";

	// <editor-fold defaultstate="collapsed" desc="state">
	@observable
	state = {
	};
	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor() {
		super();

		this.onNext = this.onNext.bind(this);

		this.form = new Form();
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onNext">
	onNext(e, btn) {
		const {form, refs: {questions}} = this;
		const {idx} = btn.props;

		const {isConsultant} = storage.is;

		if (idx === 0) {
			if (isConsultant && !form.isValid('client')) {
				infoDialog.open('Company is required');
				return;
			}
		}
		if (idx === 1) {
			if (!form.isValid('name')) {
				infoDialog.open('Document Title is required');
				return;
			}
		}

		return true;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	async onSubmit(e, btn, onSaved) {
		const {form, item: {data: old_data}} = this;

		const {isConsultant} = storage.is;

		//0
		if (isConsultant && !form.isValid('client')) {
			infoDialog.open('Company is required');
			return;
		}
		//
		if (!form.isValid('name')) {
			infoDialog.open('Document Title is required');
			return;
		}
		if (!form.isValid('doc')) {
			infoDialog.open('Please upload the Document');
			return;
		}

		const {
			//0
			client, project, site,
			//
			name, desc, category, review_date, doc_num, doc
		} = form.data;
		const data = {};

		//0
		if (isConsultant) {
			ShouldUpdate.checkClient(data, old_data, client);
		}
		ShouldUpdate.checkProject(data, old_data, project);
		ShouldUpdate.checkSite(data, old_data, site);

		//
		ShouldUpdate.check(data, old_data, name, 'name');
		ShouldUpdate.check(data, old_data, desc, 'desc');
		ShouldUpdate.check(data, old_data, category, 'category');
		ShouldUpdate.checkDate_deprecated(data, old_data, review_date, 'review_date');
		ShouldUpdate.check(data, old_data, doc_num, 'doc_num');
		ShouldUpdate.checkFile(data, old_data, doc, 'doc');

		console.log(data)

		btn.text("Saving...").disabled();
		progressDialog.open();
		updateContractorsQuestionnaireTemplate({id: this.item.id, ...data}).then(res => {
			console.log("res", res)
			onSaved && onSaved(res);
			infoDialog.open("Record successfully updated.");
			infoDialog.close(2000);
			this.props.close();
		}).finally(() => {
			btn.text("Save").enabled();
			progressDialog.close();
		});
	}

	// </editor-fold>

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
				dialog, dialog: {renderProfileCover}
			},
			item, item: {
				id, data: {
					created_at,
					//0
					client, project, site,
					//
					name, desc, category, review_date, doc_num, doc
				}
			}
		} = this;

		const {isConsultant, isNoProjects} = storage.is;

		console.log(this.item)

		return <FormControls>
			{!isNoProjects && <Row
				rendered
				active
				idx={0}
				title="Company / Project / Site"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
			>
				{isConsultant &&
					<SelectClientInput name="client" placeholder="Company..." defaultValue={RenderUtils.selectedClient.call(this)}
					                   required className="col-lg-12 form-control" onChange={this.form.onChange}/>}
				<SelectProjectInput name="project" placeholder="Project..."
				                    defaultValue={RenderUtils.selectedProject.call(this)} required
				                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
				<SelectSiteInput name="site" placeholder="Site..." defaultValue={RenderUtils.selectedSite.call(this)} required
				                 className="col-lg-12 form-control" onChange={this.form.onChange}/>
			</Row>}
			<Row
				rendered
				active={isNoProjects}
				idx={1}
				title="1. Document Details"
				onFormOpen={onFormOpen}
				onFormBack={!isNoProjects && onFormBack}
				onFormNext={onFormNext}
			>
				<ClearableInput name="name" placeholder="Document Title" defaultValue={name} required
				                className="col-lg-12 form-control" onChange={this.form.onChange}/>
				<ClearableInput name="doc_num" placeholder="Document No." defaultValue={doc_num} required
				                className="col-lg-12 form-control" onChange={this.form.onChange}/>
				<SelectContractorQuestionnaireTemplateCategoryInput name="category" placeholder="Category..."
				                                                    defaultValue={category} required
				                                                    className="col-lg-12 form-control"
				                                                    onChange={this.form.onChange}/>
				<ClearableInput name="desc" placeholder="Description" defaultValue={desc} required
				                className="col-lg-12 form-control" onChange={this.form.onChange}/>
				<ClearableInput name="review_date" type="date" placeholder="Review Date" defaultValue={review_date} required
				                className="col-lg-12 form-control" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={2}
				title="2. Document Attachment"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				<UploadButton
					name="doc"
					buttonTitle="Document (PDF, Word, Excel)"
					defaultValue={doc}
					type={['Word', 'PDF', 'Excel']}
					showOnlyIcon
					className="hor-center col-lg-8"
					onChange={this.form.onChange}
				/>
			</Row>
		</FormControls>;
	}

	// </editor-fold>
}

export default EditDialog;
