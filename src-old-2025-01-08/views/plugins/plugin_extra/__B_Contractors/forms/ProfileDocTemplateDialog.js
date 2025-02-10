// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Button, Clickable, ProfileField, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AProfileDialog} from 'components/dialogs';

import EditDocTemplateDialog from './EditDocTemplateDialog.js';

import style from "./ProfileDocTemplateDialog.lazy.css";
import findByIdContractorsQuestionnaireTemplate
	from "mutations/all/Questionnaires/ContractorsQuestionnaireTemplate/findByIdContractorsQuestionnaireTemplate";
import {CircularProgress} from "@mui/material";
import updateContractorsQuestionnaireTemplate
	from "mutations/all/Questionnaires/ContractorsQuestionnaireTemplate/updateContractorsQuestionnaireTemplate";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
	pageKey = "ProfileDocTemplateDialog";
	findById = findByIdContractorsQuestionnaireTemplate;
	removeById = updateContractorsQuestionnaireTemplate;

	constructor(props) {
		super(props, style);
	}

	open(item) {
		this.execWhen(() => this.refs.dialog).then(dialog => {
			dialog.setTopButtons(this.topButtons);
		});
		return super.open(item);
	}

	onEdit(evt, el) {
		this.refs.controls.onEdit(evt, el);
	}

	onDownload(e, btn) {
		this.refs.controls.onDownload(e, btn);
	}

	title() {
		return "Questionnaire Template";
	}

	@computed get topButtons() {
		const {item} = this.state;
		if (!item) return null;

		const {isContractor} = storage.is;
//        if(isContractor) {
//            return null;
//        }

		const permissionKey = !isContractor && "Contractor Documents";

		return <React.Fragment>
			<Clickable ref={ref => this.refs.downloadB = ref} onClick={this.onDownload}>
				<a className="btn btn-primary margin-r-10" target="__blank" type="application/pdf">
					<i className="fa fa-download icon-left"/> Download
				</a>
			</Clickable>
			{!isContractor && <Button className="btn btn-primary" onClick={this.onDelete}>
				<i className="fa fa-ban icon-left"/> Delete
			</Button>}
			{!isContractor && <Button className="btn btn-primary" onClick={this.onEdit}>
				<i className="fa fa-pen icon-left"/> Edit
			</Button>}
		</React.Fragment>;
	}

	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends React.Component {

	// <editor-fold defaultstate="collapsed" desc="state">
	@observable
	state = {
	};
	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);
	}

	// </editor-fold>

	onEdit(evt, el) {
		this.refs.editDialog.open(this.item);
	}

	get dlFileName() {
		return 'Questionnaire-Template';
	}

	// <editor-fold defaultstate="collapsed" desc="onDownload">
	async onDownload(e, btn) {
		let filePath = this.src;
		if (!filePath) {
			return infoDialog.open('No document available');
		}

		let type;
		if (filePath.contains('.docx')) {
			type = 'application/pdf';
		} else if (filePath.contains('.doc')) {
			type = 'application/pdf';
		} else {
			type = 'application/pdf';
		}

		const jqEl = $(btn.getDOMNode());
		jqEl.attr('download', this.dlFileName).attr('href', filePath).attr('type', type).click();
//        document.location = filePath;
	}

	// </editor-fold>

	get src() {
		const {item: {id, data: {doc}}} = this;
		if (doc) {
			const url = doc.dlUrls && doc.dlUrls[0];
			if (url) {
				return url;
//                return `https://docs.google.com/gview?url=${url}&embedded=true`;
			}
		}
		return null;
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
				onFormNext, onFormBack, onFormOpen
			},
			item: {
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

		return <FormControls lazyLoad>
			{!isNoProjects && <Row
				rendered
				active
				idx={0}
				title="Company / Project / Site"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
			>
				{isConsultant && <ProfileField name="client" title="Company" value={client}
				                               renderer={val => isString(val) ? val : (val.name || val.data.name)}
				                               className="col-lg-12"/>}
				<ProfileField name="project" title="Project" value={project}
				              renderer={val => isString(val) ? val : (val.name || val.data.name)} className="col-lg-12"/>
				<ProfileField name="site" title="Site" value={site}
				              renderer={val => isString(val) ? val : (val.name || val.data.name)} className="col-lg-12"/>
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
				<ProfileField name="name" placeholder="Document Title" value={name} className="col-lg-12"/>
				<ProfileField name="doc_num" placeholder="Document No." value={doc_num} className="col-lg-3"/>
				<ProfileField name="review_date" type="date" placeholder="Review Date" value={review_date}
				              className="col-lg-3"/>
				<ProfileField name="category" placeholder="Category" value={category} className="col-lg-6"/>
				<ProfileField name="desc" placeholder="Description" value={desc} className="col-lg-12"/>
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
					readonly
					showDownload
					fileName={this.dlFileName}
					className="hor-center col-lg-8"
				/>
			</Row>

			<EditDocTemplateDialog ref="editDialog"/>
		</FormControls>;
	}

	// </editor-fold>

}

export default ProfileDialog;
