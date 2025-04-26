import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {ClearableInput, Clickable, ProofUploadButton, SelectEmployeeInput} from 'components/inputs';
import {NavButtons} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import style from "./EditDialog.lazy.css";
import {updateEmployeeWorkPermit} from "mutations/update";
import {findByIdEmployeeWorkPermit} from "mutations/findById";

@observer
class EditDialog extends AEditDialog {
    pageKey = "EditWorkPermitDialog";
    className = "AEditEmployeeDocDialog";
    title = "Edit Work Permit (Foreigners)";
    removeById = updateEmployeeWorkPermit;

    constructor(props) {
        super(props, style);
    }

    get findById() {
        const {props: {isNewEmployee}} = this;
        if (isNewEmployee) return;
        return findByIdEmployeeWorkPermit;
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
    path = "plugin_sheq_assist/employees/workpermits/";
    @observable
    state = {};

    constructor(props) {
        super(props);

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
            if (!form.isValid('expiry_date')) {
                infoDialog.open('Expiry Date is required');
                return;
            }
        }
        if (idx === 2) {
            if (!form.isValid('doc')) {
                infoDialog.open('Please Upload Work Permit');
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
        if (!form.isValid('expiry_date')) {
            infoDialog.open('Expiry Date is required');
            return;
        }
        if (!form.isValid('doc')) {
            infoDialog.open('Please Upload Work Permit');
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

        const {employee, date, expiry_date, notes, doc} = form.data;

        const data = {};

        if (!embeddedEmployee) {
            ShouldUpdate.checkEmployee(data, old_data, employee, 'employee_id');
        }
        ShouldUpdate.checkDate(data, old_data, date, 'date');
        ShouldUpdate.checkDate(data, old_data, expiry_date, 'expiry_date');
        ShouldUpdate.check(data, old_data, notes, 'notes');
        ShouldUpdate.checkFile(data, old_data, doc, 'doc');

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateEmployeeWorkPermit({id: this.item.id, ...data}).then(res => {
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
                    created_at, date, expiry_date, notes, doc, employee
                }
            }
        } = this;
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <div className="row active">
                    <label>
                        1. Work Permit Details (Foreigners)
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        {!isNewEmployee && !embeddedEmployee &&
                            <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={employee}
                                                 className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                        <ClearableInput name="date" type="date" placeholder="Date..." defaultValue={date}
                                        className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="expiry_date" type="date" placeholder="Expiry Date..."
                                        defaultValue={expiry_date} required className="col-lg-6 form-control"
                                        onChange={this.form.onChange}/>
                        <ClearableInput name="notes" type="textarea" placeholder="Notes" defaultValue={notes}
                                        className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>
                <div className="row row-doc">
                    <label>
                        2. Document
                        <Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ProofUploadButton name="doc" className="col-lg-12" defaultValue={doc}
                                           onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={2} onBack={onFormBack}/>
                </div>
            </div>
        </div>);
    }
}

export default EditDialog;
