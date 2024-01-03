import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {ClearableInput, Clickable, SelectEmployeeInput, UploadButton} from 'components/inputs';
import {NavButtons} from 'components/FormComponents';

import style from "./EditDialog.lazy.css";
import updateEmployeeLeave from "mutations/all/EmployeeLeave/updateEmployeeLeave";
import findByIdEmployeeLeave from "mutations/all/EmployeeLeave/findByIdEmployeeLeave";

@observer
class EditDialog extends AEditDialog {
	pageKey = "EditLeaveDialog";
	className = "AEditEmployeeDocDialog";
	title = "Edit Leave";
	removeById = updateEmployeeLeave;

	constructor(props) {
		super(props, style);
	}

	get findById() {
		const {props: {isNewEmployee}} = this;
		if(isNewEmployee) return;
		return findByIdEmployeeLeave;
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
		const {form, isNewEmployee, props: {dialog: {props:{embeddedEmployee}}}} = this;
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
		const {form, isNewEmployee, item: {data: old_data}, props: {dialog: {props:{embeddedEmployee}}}} = this;

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

		if(isNewEmployee) {
			console.log("res", form.data)
			onSaved && onSaved(form.data);
			infoDialog.open("Record added.");
			infoDialog.close(2000);
			this.props.close();
			return;
		}

		const {
			doc,
			employee,
			type,
			due_to,
			date,
			expiry_date,
			days_booked,
			reason,
			employee_comments,
			notes
		} = form.data;

		const data = {};

		if(!embeddedEmployee) {
			ShouldUpdate.checkEmployee(data, old_data, employee, 'employee_id');
		}
		ShouldUpdate.check(data, old_data, type, 'type');
		ShouldUpdate.check(data, old_data, due_to, 'due_to');
		ShouldUpdate.checkDate(data, old_data, date, 'date');
		ShouldUpdate.checkDate(data, old_data, expiry_date, 'expiry_date');
		ShouldUpdate.check(data, old_data, days_booked, 'days_booked');
		ShouldUpdate.check(data, old_data, reason, 'reason');
		ShouldUpdate.check(data, old_data, employee_comments, 'employee_comments');
		ShouldUpdate.check(data, old_data, notes, 'notes');
		ShouldUpdate.checkFile(data, old_data, doc, 'doc');

		if (Object.keys(data).isEmpty()) {
			infoDialog.open("Nothing changed!");
			return;
		}

		console.log(data)

		btn.text("Saving...").disabled();
		progressDialog.open();
		updateEmployeeLeave({id: this.item.id, ...data}).then(res => {
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
					created_at,
					doc,
					employee,
					type, due_to, date, expiry_date, days_booked, reason,
					employee_comments, notes
				}
			}
		} = this;
		console.log('item', item)

		let idx = !isNewEmployee && !embeddedEmployee ? 1 : 0;
		return (<div className="controls-wrapper controls-sectioned">
			<div className="controls">
				{!isNewEmployee && !embeddedEmployee && <div className="row active">
					<label>
						1. Employee
						<Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
					</label>
					<div className="row sec-group">
						<SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={employee}
						                     className="col-lg-12 form-control" onChange={this.form.onChange}/>
					</div>
					<NavButtons idx={1} onNext={onFormNext}/>
				</div>}
				<div className={`row${(isNewEmployee || embeddedEmployee) ? ' active' : ''}`}>
					<label>
						{++idx}. Leave Details
						<Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
					</label>
					<div className="row sec-group">
						<ClearableInput name="due_to" type="radio" placeholder="Leave Due To" defaultValue={due_to}
						                className="col-lg-12 form-control" onChange={this.form.onChange}
						                values={this.state.lists.due_to}/>
						<ClearableInput name="type" type="select" placeholder="Leave Type..." defaultValue={type}
						                className="col-lg-12 form-control" onChange={this.form.onChange}
						                values={this.state.lists.types} returnValue/>
						<ClearableInput ref="date" name="date" type="date" placeholder="Leave Start Date..." defaultValue={date}
						                required className="col-lg-6 form-control" onChange={this.form.onChange}/>
						<ClearableInput ref="expiry_date" name="expiry_date" type="date" placeholder="Leave Expiry Date..."
						                defaultValue={expiry_date} required className="col-lg-6 form-control"
						                onChange={this.form.onChange}/>
						<ClearableInput name="days_booked" type="number" placeholder="No. Of Days Booked" defaultValue={days_booked}
						                className="col-lg-12 form-control" onChange={this.form.onChange}/>
						<ClearableInput name="reason" type="textarea" placeholder="Reason Of Leave" defaultValue={reason}
						                required={true} className="col-lg-12 form-control" onChange={this.form.onChange}/>
						<ClearableInput name="employee_comments" type="textarea" placeholder="Employee's Comments"
						                defaultValue={employee_comments} required className="col-lg-12 form-control"
						                onChange={this.form.onChange}/>
						<ClearableInput name="notes" type="textarea" placeholder="Notes" defaultValue={notes} required
						                className="col-lg-12 form-control" onChange={this.form.onChange}/>
					</div>
					<NavButtons idx={2} onBack={!isNewEmployee && !embeddedEmployee && onFormBack} onNext={onFormNext}/>
				</div>
				<div className="row row-doc">
					<label>
						{++idx}. Proof Of Sick Note
						<Clickable idx={3} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
					</label>
					<div className="row sec-group">
						<UploadButton
							name="doc"
							defaultValue={doc}
							buttonTitle="Upload File (PDF, Word or Photo)"
							type={['PDF', 'Word', 'Image']}
							showOnlyIcon
							className="col-lg-12"
							onChange={this.form.onChange}
						/>
					</div>
					<NavButtons idx={3} onBack={onFormBack}/>
				</div>
			</div>
		</div>);
	}
}

export default EditDialog;
