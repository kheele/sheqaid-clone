import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {ClearableInput, Clickable, ProofUploadButton, SelectEmployeeInput} from 'components/inputs';
import {NavButtons} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import style from "./EditDialog.lazy.css";
import updateEmployeeLicense from "mutations/all/EmployeeLicense/updateEmployeeLicense";

@observer
class EditDialog extends AEditDialog {
    pageKey = "EditLicenseDialog";
    className = "AEditEmployeeDocDialog";
    title = "Edit License";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/employees/licenses/";
    @observable
    state = {
    };

    constructor(props) {
        super(props);
        
        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
    }
    
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 1) {
            if (!form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }
            if (!form.isValid('expiry_date')) {
                infoDialog.open('Expiry Date is required');
                return;
            }
        }
        if(idx === 2) {
            if (!form.isValid('doc')) {
                infoDialog.open('Please Upload License');
                return;
            }
        }
        
        return true;
    }
    
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

        if (!form.isValid('employee')) {
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

        const {employee, date, expiry_date, notes, doc} = form.data;
        
        const data = {};
        
        ShouldUpdate.checkEmployee(data, old_data, employee, 'employee_id');
        ShouldUpdate.checkDate(data, old_data, date, 'date');
        ShouldUpdate.checkDate(data, old_data, expiry_date, 'expiry_date');
        ShouldUpdate.check(data, old_data, notes, 'notes');
        ShouldUpdate.checkFile(data, old_data, doc, 'doc');

        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        updateEmployeeLicense({id: this.item.id, ...data}).then(res => {
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

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        let {
            props: {
                onFormNext, onFormBack, onFormOpen, 
                dialog: {renderProfileCover}
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
                        1. License Details 
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={employee} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="date" type="date" placeholder="Date..." defaultValue={date} className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="expiry_date" type="date" placeholder="Expiry Date..." defaultValue={expiry_date} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="notes" type="textarea" placeholder="Notes" defaultValue={notes} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>
                <div className="row row-doc">
                    <label>
                        2. Document
                        <Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ProofUploadButton name="doc" className="col-lg-12" defaultValue={doc} onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={2} onBack={onFormBack}/>
                </div>
            </div>
        </div>);
    }
}

export default EditDialog;
