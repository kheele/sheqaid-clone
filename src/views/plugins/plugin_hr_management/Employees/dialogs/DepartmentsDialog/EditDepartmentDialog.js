import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';
import {
	ClearableInput,
	SelectClientInput,
	SelectEmployeeInput,
	SelectProjectInput,
	SelectSiteInput
} from 'components/inputs';

import {AEditDialog} from 'components/dialogs';
import style from "./EditDepartmentDialog.lazy.css";
import {FormControls, Row} from "components/FormComponents";
import {CircularProgress} from "@mui/material";
import findByIdDepartment from "mutations/all/Department/findByIdDepartment";
import updateDepartment from "mutations/all/Department/updateDepartment";

@observer
class EditDialog extends AEditDialog {
	pageKey = "DepartmentDialog";
	className = 'ANewTableFormDialog';
	findById = findByIdDepartment;
	removeById = updateDepartment;

	constructor(props) {
		super(props, style);
	}

	get title() {
		return "Edit Department";
	}

	get controls() {
		return Controls;
	}
}

@observer
class Controls extends React.Component {
	path = 'plugin_sheq_assist/employees/departments/';
	@observable
	state = {
	};

	constructor(props) {
		super(props);

		this.form = new Form();
	}

	onSubmit(e, btn, onSaved) {
		const {form, item: {data: old_data}} = this;

		if (!form.isValid('name')) {
			infoDialog.open('Department Name is required');
			return;
		}

		const {name, client} = form.data;
		const data = {};

		ShouldUpdate.check(data, old_data, name, 'name');
		ShouldUpdate.checkClient(data, old_data, client);

		console.log(data)

		if (Object.keys(data).isEmpty()) {
			infoDialog.open("Nothing changed!");
			return;
		}

		console.log(data)

		btn.text("Saving...").disabled();
		progressDialog.open();
		updateDepartment({id: this.item.id, ...data}).then(res => {
			console.log("res", res)
			if (res === "NOT_FOUND") {
				infoDialog.open("Sorry! The record no longer exist.");
			} else if (res) {
				onSaved && onSaved(res.data);
				infoDialog.open("Record successfully updated.");
				infoDialog.close(2000);
				this.props.close();
			} else {
				infoDialog.open("Could not save the record. Please try again.");
			}
		}).finally(() => {
			btn.text("Save").enabled();
			setTimeout(() => progressDialog.close());
		});
	}

	@computed get item() {
		return this.props.state.item;
	}

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
					created_at, name
				}
			}
		} = this;

		console.log(this.item)

		const {isConsultant, isNoProjects} = storage.is;

		return (<FormControls>
			{!isNoProjects && <Row
				activeAlways
				rendered
				idx={0}
				title="Company"
			>
				<SelectClientInput name="client" placeholder="Company..."
				                   defaultValue={RenderUtils.selectedClient.call(this)} showAll required
				                   className="form-control" onChange={this.form.onChange}/>
			</Row>}
			<Row
				activeAlways
				rendered
				idx={1}
				title="1. Department Details"
			>
				<ClearableInput name="name" type="text" placeholder="Department Name" defaultValue={name} required
				                className="form-control" onChange={this.form.onChange}/>
			</Row>
		</FormControls>);
	}
}

export default EditDialog;
