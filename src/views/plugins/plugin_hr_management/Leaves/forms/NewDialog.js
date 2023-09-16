import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ANewDialog} from 'components/dialogs';
import {ClearableInput, Clickable, SelectEmployeeInput, UploadButton} from 'components/inputs';
import {FormControls, NavButtons, Row} from 'components/FormComponents';

import style from "./NewDialog.lazy.css";
import {SignatureListRow} from "components/SignatureComponents";
import {Dates} from "utils/Dates";
import insertEmployeeLeave from "mutations/all/EmployeeLeave/insertEmployeeLeave";

@observer
class NewDialog extends ANewDialog {
	pageKey = "NewLeaveDialog";
	className = "ANewEmployeeDocDialog";
	title = "Create Leave";

	constructor(props) {
		super(props, style);
	}

	get controls() {
		return Controls;
	}
}

@observer
class Controls extends React.Component {
	path = "plugin_sheq_assist/employees/leaves/";

	@observable
	state = {
		lists: {
			types: ['Annual', 'Sick', 'Unpaid', 'Maternity', 'Family Responsibility'],
			due_to: [{text: 'Occurred Incident', value: 'Occurred Incident', checked: false}, {
				text: 'Other',
				value: 'Other',
				checked: false
			}]
		}
	};

	constructor() {
		super();

		this.onNext = this.onNext.bind(this);

		this.form = new Form();
	}

	onNext(e, btn) {
		const {form, isNewEmployee, embeddedEmployee} = this;
		const {idx} = btn.props;
		if (idx === 1) {
			if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
				infoDialog.open('Employee is required');
				return;
			}
		}
		if (idx === 2) {
			if (!!this.dueToOccurredIncident) {
				if (!form.isValid('due_to')) {
					infoDialog.open('Leave Due To is required');
					return;
				}
			}

			if (!form.isValid('type')) {
				infoDialog.open('Leave Type is required');
				return;
			}
			if (!form.isValid('date')) {
				infoDialog.open('Leave Start Date is required');
				return;
			}
		}

		return true;
	}

	onSubmit(e, btn, onSaved) {
		const {form, isNewEmployee, embeddedEmployee} = this;

		if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
			infoDialog.open('Employee is required');
			return;
		}
		if (!!this.dueToOccurredIncident) {
			if (!form.isValid('due_to')) {
				infoDialog.open('Leave Due To is required');
				return;
			}
		}

		if (!form.isValid('type')) {
			infoDialog.open('Leave Type is required');
			return;
		}
		if (!form.isValid('date')) {
			infoDialog.open('Leave Start Date is required');
			return;
		}

		if (isNewEmployee) {
			console.log("res", form.data)
			onSaved && onSaved(form.data);
			infoDialog.open("Record added.");
			infoDialog.close(2000);
			this.props.close();
			return;
		}

		const {
			doc, //
			employee,//
			type,//
			due_to,//
			date, //
			expiry_date, //
			days_booked,//
			reason,//
			employee_comments,//
			notes//
		} = form.data;
		const data = {
			employee_id: (embeddedEmployee || employee).id,
			doc: doc && doc.path,

			date: Dates.formatTimestampSQL(date),
			days_booked,
			due_to: !form.isValid('due_to') ? 'Occurred Incident' : due_to,
			employee_comments,
			expiry_date: Dates.formatTimestampSQL(expiry_date),
			notes,
			reason,
			type,
		};

		console.log(data)

		btn.text("Saving...").disabled();
		progressDialog.open();
		insertEmployeeLeave(data).then(employee_res => {
			console.log("res", employee_res)
			onSaved && onSaved(employee_res);
			infoDialog.open("Record successfully saved.");
			infoDialog.close(2000);
			this.props.close();
		}).finally(() => {
			btn.text("Save").enabled();
			setTimeout(() => progressDialog.close());
		});
	}

	get dueToOccurredIncident() {
		return !!this.props.dialog.props.dueToOccurredIncident;
	}

	get onSetSignatureSettings() {
		const {props: {dialog: {props: {onSetSignatureSettings}}}} = this;
		return onSetSignatureSettings;
	}

	get embeddedEmployee() {
		const {props: {dialog: {props: {embeddedEmployee}}}} = this;
		return embeddedEmployee;
	}

	get isNewEmployee() {
		const {props: {dialog: {props: {isNewEmployee}}}} = this;
		return isNewEmployee;
	}

	get employeeItem() {
		return this.props.state.item;
	}

	render() {
		const {dueToOccurredIncident} = this;
		console.log('dueToOccurredIncident', dueToOccurredIncident)
		const {isNewEmployee, embeddedEmployee, onSetSignatureSettings, props:{onFormNext, onFormBack, onFormOpen}} = this;

		let idx = !isNewEmployee && !embeddedEmployee ? 1 : 0;
		return <FormControls>
			{!isNewEmployee && !embeddedEmployee && <Row
				rendered
				active
				idx={1}
				title='1. Employee'
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
			>
				<SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={this.employeeItem}
				                     className="col-lg-12 form-control" onChange={this.form.onChange}/>
			</Row>}
			<Row
				rendered
				active={isNewEmployee || embeddedEmployee}
				idx={2}
				title={`${++idx}. Leave Details`}
				onFormOpen={onFormOpen}
				onFormBack={!isNewEmployee && !embeddedEmployee && onFormBack}
				onFormNext={onFormNext}
			>
				{!dueToOccurredIncident &&
					<ClearableInput name="due_to" type="radio" placeholder="Leave Due To" className="col-lg-12 form-control"
					                onChange={this.form.onChange} values={this.state.lists.due_to} returnValue/>}
				{dueToOccurredIncident &&
					<div className="due_to text-center col-lg-12 form-control">Leave Due To: <b>Occurred Incident</b></div>}
				<ClearableInput name="type" type="select" placeholder="Leave Type..." className="col-lg-12 form-control"
				                onChange={this.form.onChange} values={this.state.lists.types} returnValue/>
				<ClearableInput ref="date" name="date" type="date" placeholder="Leave Start Date..." required
				                className="col-lg-6 form-control" onChange={this.form.onChange}/>
				<ClearableInput ref="expiry_date" name="expiry_date" type="date" placeholder="Leave Expiry Date..." required
				                className="col-lg-6 form-control" onChange={this.form.onChange}/>
				<ClearableInput name="days_booked" type="number" placeholder="No. Of Days Booked"
				                className="col-lg-12 form-control" onChange={this.form.onChange}/>
				<ClearableInput name="reason" type="textarea" placeholder="Reason Of Leave" required={true}
				                className="col-lg-12 form-control" onChange={this.form.onChange}/>
				<ClearableInput name="employee_comments" type="textarea" placeholder="Employee's Comments" required
				                className="col-lg-12 form-control" onChange={this.form.onChange}/>
				<ClearableInput name="notes" type="textarea" placeholder="Notes" required className="col-lg-12 form-control"
				                onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={3}
				title={`${++idx}. Proof Of Sick Note`}
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<UploadButton
					name="doc"
					buttonTitle="Upload File (PDF, Word or Photo)"
					type={['PDF', 'Word', 'Image']}
					showOnlyIcon
					className="col-lg-12"
					onChange={this.form.onChange}
				/>
			</Row>
			<SignatureListRow
				idx={!isNewEmployee && !embeddedEmployee ? 4 : 3}
				pluginKey="HR"
				module="Leaves"
				onSetSignatureSettings={onSetSignatureSettings}
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>

			</SignatureListRow>
		</FormControls>;
	}
}

export default NewDialog;
