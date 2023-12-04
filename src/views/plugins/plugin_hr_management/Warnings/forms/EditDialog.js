import React from "react";
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {ClearableInput, Clickable, ProofUploadButton, SelectEmployeeInput} from 'components/inputs';
import {NavButtons} from 'components/FormComponents';
import {NewEmployeeListTable} from 'components/FormTableComponents';
import {mapPersonDetails} from 'utils/ArrayMapperUtils';

import style from "./EditDialog.lazy.css";
import updateEmployeeWarning from "mutations/all/EmployeeWarning/updateEmployeeWarning";
import findByIdEmployeeWarning from "mutations/all/EmployeeWarning/findByIdEmployeeWarning";

@observer
class EditDialog extends AEditDialog {
    pageKey = "EditWarningDialog";
    className = "AEditEmployeeDocDialog";
    title = "Edit Warning";
    findById = findByIdEmployeeWarning;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/employees/warnings/";

    @observable
    state = {
        lists: {
            warning_types: ['Verbal', 'Written', 'Final']
        }
    };

    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
        this.form.addChangeOne("date", this.onChangeDate.bind(this));
    }

    onChangeDate(el, val) {
        this.props.execWhen(() => this.refs.expiry_date).then(() => {
            const {
                expiry_date: expiry_date_ref
            } = this.refs;
            if(val) {
                expiry_date_ref && expiry_date_ref.onChange(val.addYears(1));
            }
        });
    }

    onNext(e, btn) {
        const {form, isNewEmployee, props: {dialog: {props:{embeddedEmployee}}}} = this;
        const {idx} = btn.props;
        if(idx === 1) {
            if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }
        }
        if(idx === 2) {
            if (!form.isValid('type')) {
                infoDialog.open('Warning Type is required');
                return;
            }
            if (!form.isValid('date')) {
                infoDialog.open('Warning Date is required');
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
        if (!form.isValid('type')) {
            infoDialog.open('Warning Type is required');
            return;
        }
        if (!form.isValid('date')) {
            infoDialog.open('Warning Date is required');
            return;
        }

        const {
            employee, issued_by,
            type, date, expiry_date, 
            details, employee_comments, notes, witness_list,
            doc
        } = form.data;
        
        const data = {};

        if(!embeddedEmployee) {
            ShouldUpdate.checkEmployee(data, old_data, employee, 'employee_id');
        }
        ShouldUpdate.checkEmployee(data, old_data, issued_by, 'issued_by_id');
        ShouldUpdate.check(data, old_data, type, 'type');
        ShouldUpdate.checkDate(data, old_data, date, 'date');
        ShouldUpdate.checkDate(data, old_data, expiry_date, 'expiry_date');
        ShouldUpdate.check(data, old_data, details, 'details');
        ShouldUpdate.check(data, old_data, employee_comments, 'employee_comments');
        ShouldUpdate.check(data, old_data, notes, 'notes');
        ShouldUpdate.checkWitnessList(data, old_data, witness_list, 'witness_list');
        ShouldUpdate.checkFile(data, old_data, doc, 'doc');

        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateEmployeeWarning({id: this.item.id, ...data}).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
        // neonBinding.events.emit(this.path + "update", employee.id, this.item.id, data).then(res => {
        //     console.log("res", res)
        //     if(res === "ERROR") {
        //         infoDialog.open("An error occurred. Please try again.");
        //     } else {
        //         onSaved && onSaved(res);
        //         infoDialog.open("Record successfully updated.");
        //         this.props.close();
        //     }
        //     infoDialog.close(2000);
        // }).finally(() => {
        //     btn.text("Save").enabled();
        // });
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
                    created_at, employee, issued_by, type, date, expiry_date, details, employee_comments, notes, witness_list, doc
                }
            }
        } = this;
        
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <div className="row active">
                    <label>
                        1. Employee & Person Issuing Warning
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        {!isNewEmployee && !embeddedEmployee &&
                          <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={employee} className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                        <SelectEmployeeInput name="issued_by" placeholder="Warning Issued By..." defaultValue={issued_by} defaultUser className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        2. Warning Details
                        <Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput name="type" type="select" placeholder="Warning Type..." defaultValue={type} className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.warning_types} returnValue/>
                        <ClearableInput ref="date" name="date" type="date" placeholder="Warning Date..." defaultValue={date || new Date()} required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput ref="expiry_date" name="expiry_date" type="date" placeholder="Warning Expiry Date..." defaultValue={expiry_date} required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="details" type="textarea" placeholder="Details Of Misconduct" defaultValue={details} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="employee_comments" type="textarea" placeholder="Employee's Comments" defaultValue={employee_comments} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="notes" type="textarea" placeholder="Notes" defaultValue={notes} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <label className="col-lg-12 margin-0 margin-t-10 padding-0 padding-b-0">Witness List</label>
                        <NewEmployeeListTable name="witness_list" defaultValue={[...(witness_list || []), null]} onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={2} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row row-doc">
                    <label>
                        3. Document
                        <Clickable idx={3} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ProofUploadButton name="doc" className="col-lg-12" defaultValue={doc} onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={3} onBack={onFormBack}/>
                </div>
            </div>
        </div>);
    }
}

export default EditDialog;
