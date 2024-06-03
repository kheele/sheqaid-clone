import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ANewDialog} from 'components/dialogs';
import {ClearableInput, SelectCountryCurrencyInput, SelectEmployeeInput, UploadButton} from 'components/inputs';
import {FormControls, NavButtons, Row} from 'components/FormComponents';

import style from "./NewDialog.lazy.css";
import {SignatureListRow} from "components/SignatureComponents";
import {Dates} from "utils/Dates";
import insertEmployeeExpense from "mutations/all/EmployeeExpense/insertEmployeeExpense";

@observer
class NewDialog extends ANewDialog {
	pageKey = "NewExpenseDialog";
	className = "ANewEmployeeDocDialog";
	title = "Create Expense";

	constructor(props) {
		super(props, style);
	}

	get controls() {
		return Controls;
	}
}

@observer
class Controls extends React.Component {
	path = "plugin_sheq_assist/employees/expenses/";

	@observable
	state = {
		lists: {
			category: [
				"Beverage-clients and Training",
				"Business Technologies",
				"Education / Training",
				"Fuel and Oil",
				"Kilometers",
				"Material/Project Supplies",
				"Meals and Entertainment",
				"Medical - Employer Contribution",
				"Office Expense-Refreshments",
				"Office Supplies/Printing and Stationary",
				"Other",
				"Parking and Tolls",
				"Postage",
				"Professional Registrations/Memberships",
				"Rent",
				"Repairs and Maintenance",
				"Staff Welfare and Gifts",
				"Telephone and Internet",
				"Transportation (taxi, bus, train)",
				"Travel and Accommodation",
			],
			paid_with: [
				"Bank Transfer",
				"Cash",
				"Company Card",
				"Fleet Card",
				"Invoice",
				"Personal Card",
				"Petty Cash",
			],
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
			if (!form.isValid('category')) {
				infoDialog.open('Category is required');
				return;
			}
			if (!form.isValid('currency_country')) {
				infoDialog.open('Currency is required');
				return;
			}
			if (!form.isValid('paid_with')) {
				infoDialog.open('Paid With is required');
				return;
			}
			if (!form.isValid('date')) {
				infoDialog.open('Date is required');
				return;
			}
			if (!form.isValid('amount')) {
				infoDialog.open('Amount is required');
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
		
		if (!form.isValid('category')) {
			infoDialog.open('Category is required');
			return;
		}
		if (!form.isValid('currency_country')) {
			infoDialog.open('Currency is required');
			return;
		}
		if (!form.isValid('paid_with')) {
			infoDialog.open('Paid With is required');
			return;
		}
		if (!form.isValid('date')) {
			infoDialog.open('Date is required');
			return;
		}
		if (!form.isValid('amount')) {
			infoDialog.open('Amount is required');
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
			category,
			currency_country,
			paid_with,
			date,
			amount,
			comments,
		} = form.data;
		const data = {
			employee_id: (embeddedEmployee || employee).id,
			doc,
			category,
			currency_country_id: currency_country && currency_country.id,
			paid_with,
			date: Dates.formatTimestampSQL(date),
			amount,
			comments,
		};

		console.log(data)

		btn.text("Saving...").disabled();
		progressDialog.open();
		insertEmployeeExpense(data).then(employee_res => {
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
				title={`${++idx}. Expense Details`}
				onFormOpen={onFormOpen}
				onFormBack={!isNewEmployee && !embeddedEmployee && onFormBack}
				onFormNext={onFormNext}
			>
				<ClearableInput
					name="category"
					type="select"
					placeholder="Category..."
					className="col-lg-12 form-control"
					onChange={this.form.onChange}
					values={this.state.lists.category}
					returnValue
				/>
				<SelectCountryCurrencyInput
					name="currency_country"
					type="select"
					placeholder="Currency..."
					className="col-lg-12 form-control"
					onChange={this.form.onChange}
					returnValue
				/>
				<ClearableInput
					name="paid_with"
					type="select"
					placeholder="Paid With..."
					className="col-lg-12 form-control"
					onChange={this.form.onChange}
					values={this.state.lists.paid_with}
					returnValue
				/>
				<ClearableInput
					ref="date"
					name="date"
					type="date"
					placeholder="Date..."
					required
					className="col-lg-12 form-control"
					onChange={this.form.onChange}
				/>
				<ClearableInput
					name="amount"
					type="number"
					placeholder="Amount"
					className="col-lg-12 form-control"
					onChange={this.form.onChange}
				/>
				<ClearableInput
					name="comments"
					type="textarea"
					placeholder="Comments"
					required
					className="col-lg-12 form-control"
					onChange={this.form.onChange}
				/>
			</Row>
			<Row
				rendered
				idx={3}
				title={`${++idx}. Document`}
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				<UploadButton
					name="doc"
					buttonTitle="Upload File (PDF, Image)"
					type={['PDF', 'Image']}
					showOnlyIcon
					className="col-lg-12"
					onChange={this.form.onChange}
				/>
			</Row>
		</FormControls>;
	}
}

export default NewDialog;
