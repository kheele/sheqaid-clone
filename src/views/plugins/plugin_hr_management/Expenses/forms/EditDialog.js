import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {ClearableInput, SelectCountryCurrencyInput, SelectEmployeeInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./EditDialog.lazy.css";
import {updateEmployeeExpense} from "mutations/update";
import {findByIdEmployeeExpense} from "mutations/findById";

@observer
class EditDialog extends AEditDialog {
    pageKey = "EditExpenseDialog";
    className = "AEditEmployeeDocDialog";
    title = "Edit Expense";
    removeById = updateEmployeeExpense;

    constructor(props) {
        super(props, style);
    }

    get findById() {
        const {props: {isNewEmployee}} = this;
        if (isNewEmployee) return;
        return findByIdEmployeeExpense;
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
    path = "plugin_sheq_assist/employees/expenses/";

    @observable
    state = {
        lists: {
            category: [
                "Beverage-clients and training",
                "Business Technologies",
                "Education / Training ",
                "Fuel and Oil",
                "Kilometers",
                "Material/Project Supplies",
                "Meals and Entertainment",
                "Medical - Employer contribution",
                "Office Expense-Refreshments",
                "Office supplies/Printing and Stationary",
                "Other",
                "Parking and Tolls",
                "Postage",
                "Professional Registrations/memberships",
                "Rent",
                "Repairs and Maintenance",
                "Staff Welfare and Gifts",
                "Telephone and Internet",
                "Transportation (taxi, bus, train)",
                "Travel and Accomodation"
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

    get isNewEmployee() {
        const {props: {dialog: {props: {isNewEmployee}}}} = this;
        return isNewEmployee;
    }

    @computed
    get item() {
        return this.props.state.item;
    }

    onNext(e, btn) {
        const {form, isNewEmployee, props: {dialog: {props: {embeddedEmployee}}}} = this;
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
        const {form, isNewEmployee, item: {data: old_data}, props: {dialog: {props: {embeddedEmployee}}}} = this;

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

        const data = {};

        if (!embeddedEmployee) {
            ShouldUpdate.checkEmployee(data, old_data, employee, 'employee_id');
        }
        ShouldUpdate.check(data, old_data, category, 'category');
        ShouldUpdate.check(data, old_data, currency_country, 'currency_country');
        ShouldUpdate.check(data, old_data, paid_with, 'paid_with');
        ShouldUpdate.checkDate(data, old_data, date, 'date');
        ShouldUpdate.check(data, old_data, amount, 'amount');
        ShouldUpdate.check(data, old_data, comments, 'comments');
        ShouldUpdate.checkFile(data, old_data, doc, 'doc');

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateEmployeeExpense({id: this.item.id, ...data}).then(res => {
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
                    doc, //
                    employee,//
                    category,
                    currency_country,
                    paid_with,
                    date,
                    amount,
                    status,
                    comments,
                    date_submitted,
                    date_approved,
                    date_compensated,
                }
            }
        } = this;
        console.log('item', item)

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
                <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={employee}
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
                    defaultValue={category}
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                    values={this.state.lists.category}
                    returnValue
                />
                <SelectCountryCurrencyInput
                    name="currency_country"
                    type="select"
                    placeholder="Currency..."
                    defaultValue={currency_country}
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                    returnValue
                />
                <ClearableInput
                    name="paid_with"
                    type="select"
                    placeholder="Paid With..."
                    defaultValue={paid_with}
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
                    defaultValue={date}
                    required
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="amount"
                    type="number"
                    placeholder="Amount"
                    defaultValue={amount}
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="comments"
                    type="textarea"
                    placeholder="Comments"
                    defaultValue={comments}
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
                    defaultValue={doc}
                    showOnlyIcon
                    className="col-lg-12"
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>;
    }
}

export default EditDialog;
