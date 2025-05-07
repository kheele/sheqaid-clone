import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {ClearableInput, SelectEmployeeInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./EditDialog.lazy.css";
import {updateEmployeeLeave} from "mutations/update";
import {findByIdEmployeeLeave} from "mutations/findById";

@observer
class EditDialog extends AEditDialog {
    pageKey = "EditLeaveDialog";
    className = "AEditEmployeeDocDialog";
    title = "Edit Time-Off";
    removeById = updateEmployeeLeave;

    constructor(props) {
        super(props, style);
    }

    get findById() {
        const {props: {isNewEmployee}} = this;
        if (isNewEmployee) return;
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
        this.onFormSave = this.onFormSave.bind(this);

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

    //<editor-fold desc="onFormSave">
    async onFormSave(e, btn) {
        const {
            form,
            isNewEmployee,
            item: {id, data: old_data},
            props: {dialog: {props: {embeddedEmployee}}},
        } = this;

        const {is: {isContractor}, loggedContractor} = storage;

        const onSubmit = (data, onSaved) => {
            if (Object.keys(data).isEmpty()) {
                infoDialog.open("Nothing changed!");
                return;
            }

            console.log(data)

            btn.text("Saving...").disabled();
            progressDialog.open();
            updateEmployeeLeave({id: this.item.id, ...data}).then(res => {
                console.log("res", res)
                const res_data = res;
                onSaved && onSaved(res_data);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
                // this.props.close();
            }).finally(() => {
                btn.text("Save").enabled();
                setTimeout(() => progressDialog.close());
            });
        };

        const {idx} = btn.props;

        if (idx === 1) {
            if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }

            const {
                employee,
            } = form.data;

            const data = {};

            if (!embeddedEmployee) {
                ShouldUpdate.checkEmployee(data, old_data, employee, 'employee_id');
            }

            onSubmit(data);
            return;
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

            const {
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

            ShouldUpdate.check(data, old_data, type, 'type');
            ShouldUpdate.check(data, old_data, due_to, 'due_to');
            ShouldUpdate.checkDate(data, old_data, date, 'date');
            ShouldUpdate.checkDate(data, old_data, expiry_date, 'expiry_date');
            ShouldUpdate.check(data, old_data, days_booked, 'days_booked');
            ShouldUpdate.check(data, old_data, reason, 'reason');
            ShouldUpdate.check(data, old_data, employee_comments, 'employee_comments');
            ShouldUpdate.check(data, old_data, notes, 'notes');

            onSubmit(data);
            return;
        }

        if (idx === 3.1) {
            const {
                doc,
            } = form.data;

            const data = {};

            ShouldUpdate.checkFile(data, old_data, doc, 'doc');

            onSubmit(data);
            return;
        }

        if (idx === 3.2) {
            const {
                doc_fitness_certificate,
            } = form.data;

            const data = {};

            ShouldUpdate.checkFile(data, old_data, doc_fitness_certificate, 'doc_fitness_certificate');

            onSubmit(data);
            return;
        }

        return true;
    }

    onSubmit(e, btn, onSaved) {
        const {form, isNewEmployee, item: {data: old_data}, props: {dialog: {props: {embeddedEmployee}}}} = this;

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

        console.log("res", form.data)
        onSaved && onSaved(form.data);
        infoDialog.open("Record added.");
        infoDialog.close(2000);
        this.props.close();
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
                    doc_fitness_certificate,
                    employee,
                    type, due_to, date, expiry_date, days_booked, reason,
                    employee_comments, notes
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
                title="1. Employee"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormSave={!isNewEmployee && this.onFormSave}
            >
                <SelectEmployeeInput
                    name="employee"
                    placeholder="Employee..."
                    defaultValue={employee}
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
            </Row>}
            <Row
                rendered
                active={isNewEmployee || embeddedEmployee}
                idx={2}
                title={`${++idx}. Time-Off Details`}
                onFormOpen={onFormOpen}
                onFormBack={!isNewEmployee && !embeddedEmployee && onFormBack}
                onFormNext={onFormNext}
                onFormSave={!isNewEmployee && this.onFormSave}
            >
                <ClearableInput name="due_to" type="radio" placeholder="Leave Due To" defaultValue={due_to}
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.due_to}/>
                <ClearableInput name="type" type="select" placeholder="Leave Type..." defaultValue={type}
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.types} returnValue/>
                <ClearableInput ref="date" name="date" type="date" placeholder="Leave Start Date..."
                                defaultValue={date}
                                required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="expiry_date" name="expiry_date" type="date"
                                placeholder="Leave End Date..."
                                defaultValue={expiry_date} required className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="days_booked" type="number" placeholder="No. Of Days Booked"
                                defaultValue={days_booked}
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="reason" type="textarea" placeholder="Reason Of Leave"
                                defaultValue={reason}
                                required={true} className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="employee_comments" type="textarea" placeholder="Employee's Comments"
                                defaultValue={employee_comments} required className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="notes" type="textarea" placeholder="Notes" defaultValue={notes} required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title={`${++idx}. Documents`}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <FormControls>
                    <Row
                        rendered
                        activeAlways
                        idx={3.1}
                        title={`${idx}.1. Proof Of Sick Note Attachment`}
                        onFormSave={!isNewEmployee && this.onFormSave}
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
                    <Row
                        rendered
                        activeAlways
                        idx={3.2}
                        title={`${idx}.2. Certificate Of Fitness Attachment`}
                        onFormSave={!isNewEmployee && this.onFormSave}
                    >
                        <UploadButton
                            name="doc_fitness_certificate"
                            buttonTitle="Upload File (PDF, Image)"
                            type={['PDF', 'Image']}
                            defaultValue={doc_fitness_certificate}
                            showOnlyIcon
                            className="col-lg-12"
                            onChange={this.form.onChange}
                        />
                    </Row>
                </FormControls>
            </Row>
        </FormControls>;
    }
}

export default EditDialog;
