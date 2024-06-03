import React from "react";
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {ClearableInput, SelectEmployeeInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import style from "./EditDialog.lazy.css";
import updateEmployeeDocDocument from "mutations/all/EmployeeDocument/EmployeeDocDocument/updateEmployeeDocDocument";
import findByIdEmployeeDocDocument
	from "mutations/all/EmployeeDocument/EmployeeDocDocument/findByIdEmployeeDocDocument";

@observer
class EditDialog extends AEditDialog {
	pageKey = "EditIDOrPassportDialog";
	className = "AEditEmployeeDocDialog";
	title = "Edit ID/Passport";
	removeById = updateEmployeeDocDocument;

	constructor(props) {
		super(props, style);
	}

	get findById() {
		const {props: {isNewEmployee}} = this;
		if(isNewEmployee) return;
		return findByIdEmployeeDocDocument;
	}

	get topButtonsHiddenDelete() {
		const {props: {isNewEmployee}} = this;
		if (isNewEmployee) return true;
	}

	get controls() {
		return Controls;
	}
}

@observer
class Controls extends React.Component {
	@observable
	state = {};

	constructor(props) {
		super(props);

		this.onNext = this.onNext.bind(this);

		this.form = new Form();
	}

	onNext(e, btn) {
		const {form, isNewEmployee, props: {dialog: {props:{embeddedEmployee}}}} = this;
		const {idx} = btn.props;
		if (idx === 1) {
			if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
				infoDialog.open('Employee is required');
				return;
			}
			if (!form.isValid('expiry_date')) {
				infoDialog.open('Expiry Date is required');
				return;
			}
		}
		if (idx === 2) {
			if (!form.isValid('doc')) {
				infoDialog.open('Please Upload ID/Passport');
				return;
			}
		}

		return true;
	}

	onSubmit(e, btn, onSaved) {
		const {form, isNewEmployee, item: {data: old_data}, props: {dialog: {props:{embeddedEmployee}}}} = this;

		if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
			infoDialog.open('Employee is required');
			return;
		}
		if (!form.isValid('expiry_date')) {
			infoDialog.open('Expiry Date is required');
			return;
		}
		if (!form.isValid('doc')) {
			infoDialog.open('Please Upload ID/Passport');
			return;
		}

		if(isNewEmployee) {
			console.log("res", form.data)
			onSaved && onSaved(form.data);
			infoDialog.open("Record added.");
			infoDialog.close(2000);
			this.props.close();
			return;
		}

		const {employee, expiry_date, doc} = form.data;

		const data = {};

		if(!embeddedEmployee) {
			ShouldUpdate.checkEmployee(data, old_data, employee, 'employee_id');
		}
		ShouldUpdate.checkDate(data, old_data, expiry_date, 'expiry_date');
		ShouldUpdate.checkFile(data, old_data, doc, 'doc');

		if (Object.keys(data).isEmpty()) {
			infoDialog.open("Nothing changed!");
			return;
		}

		console.log(data)

		btn.text("Saving...").disabled();
		updateEmployeeDocDocument({id: this.item.id, ...data}).then(res => {
			console.log("res", res)
			onSaved && onSaved(res);
			infoDialog.open("Record successfully updated.");
			infoDialog.close(2000);
			this.props.close();
		}).finally(() => {
			btn.text("Save").enabled();
			setTimeout(() => progressDialog.close());
		});
	}

	get isNewEmployee() {
		const {props: {dialog: {props: {isNewEmployee}}}} = this;
		return isNewEmployee;
	}

	@computed
	get item() {
		return this.props.state.item;
	}

	render() {
		if (!this.item) {
			return <CircularProgress className="fixed-center"/>;
		}

		let {
			props: {
				onFormNext, onFormBack, onFormOpen,
				dialog: {props: {embeddedEmployee, isNewEmployee,}}
			},
			item, item: {
				id, data: {
					created_at, expiry_date, doc, employee
				}
			}
		} = this;
		console.log('item', item)

		let idx = !isNewEmployee && !embeddedEmployee ? 1 : 0;
		return (<FormControls>
			<Row
				rendered
				active={!isNewEmployee && !embeddedEmployee}
				idx={1}
				title="1. Employee"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
			>
				<SelectEmployeeInput
					name="employee"
					placeholder="Employee..."
					defaultValue={employee}
					className="col-lg-12 form-control"
					onChange={this.form.onChange}
				/>
			</Row>
			<Row
				rendered
				active={isNewEmployee || embeddedEmployee}
				idx={2}
				title={`${++idx}. ID/Passport Details`}
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={!isNewEmployee && !embeddedEmployee && onFormBack}
			>
				<ClearableInput name="expiry_date" type="date" placeholder="Expiry Date..." defaultValue={expiry_date} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={3}
				title={`${++idx}. Document`}
				className="row-doc"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				<UploadButton
					name="doc"
					defaultValue={doc}
					buttonTitle="Upload File (PDF, Word or Photo)"
					type={['PDF', 'Word', 'Image']}
					showOnlyIcon
					className="col-lg-12"
					onChange={this.form.onChange}
				/>
			</Row>
		</FormControls>);
	}
}

export default EditDialog;
