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
import updateEmployeeJobAppointment from "mutations/all/EmployeeJobAppointment/updateEmployeeJobAppointment";
import findByIdEmployeeJobAppointment from "mutations/all/EmployeeJobAppointment/findByIdEmployeeJobAppointment";

@observer
class EditDialog extends AEditDialog {
    pageKey = "EditJobAppointmentDialog";
    className = "AEditEmployeeDocDialog";
    title = "Edit Job Appointment";
    removeById = updateEmployeeJobAppointment;

    constructor(props) {
        super(props, style);
    }

    get findById() {
        const {props: {isNewEmployee}} = this;
        if (isNewEmployee) return;
        return findByIdEmployeeJobAppointment;
    }

    get topButtonsHiddenSave() {
        const {props: {isNewEmployee}} = this;
        if (isNewEmployee) return false;
        return true;
    }

    get topButtonsHiddenDelete() {
        const {props: {isNewEmployee}} = this;
        if (isNewEmployee) return true;
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/employees/job_appointments/";

    @observable
    state = {
        lists: {
        }
    };

    constructor() {
        super();

        this.onFormSave = this.onFormSave.bind(this);

        this.form = new Form();
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
            updateEmployeeJobAppointment({id: this.item.id, ...data}).then(res => {
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
            if (!form.isValid('date')) {
                infoDialog.open('Start Date is required');
                return;
            }

            const {
                date,
                expiry_date,
                notes
            } = form.data;

            const data = {};

            ShouldUpdate.checkDate(data, old_data, date, 'date');
            ShouldUpdate.checkDate(data, old_data, expiry_date, 'expiry_date');
            ShouldUpdate.check(data, old_data, notes, 'notes');

            onSubmit(data);
            return;
        }

        if (idx === 3) {
            const {
                doc,
            } = form.data;

            const data = {};

            ShouldUpdate.checkFile(data, old_data, doc, 'doc');

            onSubmit(data);
            return;
        }

        return true;
    }

    //</editor-fold>

    onSubmit(e, btn, onSaved) {
        const {form, isNewEmployee, item: {data: old_data}, props: {dialog: {props:{embeddedEmployee}}}} = this;

        if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
            infoDialog.open('Employee is required');
            return;
        }
        if (!form.isValid('date')) {
            infoDialog.open('Start Date is required');
            return;
        }

        console.log("res", form.data)
        onSaved && onSaved(form.data);
        infoDialog.open("Record added.");
        infoDialog.close(2000);
        this.props.close();
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
                    date, expiry_date, notes
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
                onFormSave={!isNewEmployee && this.onFormSave}
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
                title={`${++idx}. Job Appointment Details`}
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={!isNewEmployee && !embeddedEmployee && onFormBack}
                onFormSave={!isNewEmployee && this.onFormSave}
            >
                <ClearableInput ref="date" name="date" type="date" placeholder="Start Date..." defaultValue={date} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="expiry_date" name="expiry_date" type="date" placeholder="Expiry Date..." defaultValue={expiry_date} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="notes" type="textarea" placeholder="Notes" defaultValue={notes} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title={`${++idx}. Document`}
                className="row-doc"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormSave={!isNewEmployee && this.onFormSave}
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
