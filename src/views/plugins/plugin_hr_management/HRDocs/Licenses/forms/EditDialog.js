import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {ClearableInput, SelectEmployeeInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import style from "./EditDialog.lazy.css";
import {updateEmployeeLicense} from "mutations/update";
import {findByIdEmployeeLicense} from "mutations/findById";

@observer
class EditDialog extends AEditDialog {
    pageKey = "EditLicenseDialog";
    className = "AEditEmployeeDocDialog";
    title = "Edit License";
    removeById = updateEmployeeLicense;

    constructor(props) {
        super(props, style);
    }

    get findById() {
        const {props: {isNewEmployee}} = this;
        if (isNewEmployee) return;
        return findByIdEmployeeLicense;
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
    path = "plugin_sheq_assist/employees/licenses/";
    @observable
    state = {};

    constructor(props) {
        super(props);

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
            if (!form.isValid('expiry_date')) {
                infoDialog.open('Expiry Date is required');
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
            updateEmployeeLicense({id: this.item.id, ...data}).then(res => {
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
            if (!form.isValid('expiry_date')) {
                infoDialog.open('Expiry Date is required');
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
            if (!form.isValid('doc')) {
                infoDialog.open('Please Upload License');
                return;
            }

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

    onSubmit(e, btn, onSaved) {
        const {form, isNewEmployee, item: {data: old_data}, props: {dialog: {props: {embeddedEmployee}}}} = this;

        if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
            infoDialog.open('Employee is required');
            return;
        }
        if (!form.isValid('expiry_date')) {
            infoDialog.open('Expiry Date is required');
            return;
        }
        if (!form.isValid('doc')) {
            infoDialog.open('Please Upload License');
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
                    created_at, date, expiry_date, notes, doc, employee,
                }
            }
        } = this;

        let idx = !isNewEmployee && !embeddedEmployee ? 1 : 0;
        return (<FormControls>
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
                title={`${++idx}. License Details`}
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={!isNewEmployee && !embeddedEmployee && onFormBack}
            >
                <ClearableInput name="date" type="date" placeholder="Date..." defaultValue={date}
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="expiry_date" type="date" placeholder="Expiry Date..."
                                defaultValue={expiry_date}
                                required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="notes" type="textarea" placeholder="License Description"
                                defaultValue={notes}
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
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
