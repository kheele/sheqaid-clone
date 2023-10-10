import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput, ProfileField, SelectClientInput} from 'components/inputs';
import {ANewDialog} from 'components/dialogs';

import {FormControls, Row} from "components/FormComponents";
import style from "./NewDialog.lazy.css";
import insertTrainingToolboxTalkSubjectCategory
	from "mutations/all/TrainingToolboxTalkSubjectCategory/insertTrainingToolboxTalkSubjectCategory";

@observer
class NewToolboxTalkSubjectCategoryDialog extends ANewDialog {
	pageKey = "NewToolboxTalkSubjectCategoryDialog";
	title = "Create Toolbox Talk Subject Category";
	
	constructor(props) {
		super(props, style);
	}
	
	get controls() {
		return Controls;
	}
}

@observer
class Controls extends React.Component {
	@observable
	state = {};
	
	constructor() {
		super();
		
		this.form = new Form();
	}
	
	componentDidMount() {
	
	}
	
	onSubmit(e, btn, onSaved) {
		const {form} = this;
		
		if (!form.isValid('name')) {
			infoDialog.open('Toolbox Talk Subject Category Name is required');
			return;
		}
		
		const {
			client,
			name,
		} = form.data;
		
		const data = {
			client_id: client && client.id,
			name,
		};
		
		console.log(data)
		
		btn.text("Saving...").disabled();
		progressDialog.open();
		insertTrainingToolboxTalkSubjectCategory(data).then(res => {
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
	
	render() {
		const {isConsultant} = storage.is;
		
		return <FormControls>
			{isConsultant && <Row
				activeAlways
				rendered
				idx={0}
				title="Company"
			>
				<SelectClientInput name="client" placeholder="Company..." showAll className="col-lg-12 form-control"
				                   onChange={this.form.onChange}/>
			</Row>}
			<Row
				activeAlways
				rendered
				idx={1}
				title="Toolbox Talk Subject Category Details"
			>
				<ClearableInput name="name" type="text" placeholder="Toolbox Talk Subject Category Name"
				                className="col-lg-12 form-control" onChange={this.form.onChange}/>
			</Row>
		</FormControls>;
	}
}

export default NewToolboxTalkSubjectCategoryDialog;
