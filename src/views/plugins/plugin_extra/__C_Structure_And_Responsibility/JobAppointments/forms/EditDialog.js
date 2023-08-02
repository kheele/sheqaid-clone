import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {ClearableInput, Clickable, SelectEmployeeInput, UploadButton} from 'components/inputs';
import {NavButtons} from 'components/FormComponents';

import style from "./EditDialog.lazy.css";
import updateEmployeeJobAppointment from "mutations/all/EmployeeJobAppointment/updateEmployeeJobAppointment";

@observer
class EditDialog extends AEditDialog {
    pageKey = "EditJobAppointmentDialog";
    title = "Edit Job Appointment";

    constructor(props) {
        super(props, style);
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
        }
        
        return true;
    }
    
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

        if (!form.isValid('employee')) {
            infoDialog.open('Employee is required');
            return;
        }
        if (!form.isValid('date')) {
            infoDialog.open('Start Date is required');
            return;
        }

        const {
            doc,
            employee,
            date, 
            expiry_date,
            notes
        } = form.data;
        
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
        progressDialog.open();
        updateEmployeeJobAppointment({id: this.item.id, ...data}).then(res => {
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
                    created_at, 
                    doc, 
                    employee, 
                    date, expiry_date, notes
                }
            }
        } = this;
        console.log('item', item)
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <div className="row active">
                    <label>
                        1. Employee
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={employee} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        2. Job Appointment Details
                        <Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput ref="date" name="date" type="date" placeholder="Start Date..." defaultValue={date} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput ref="expiry_date" name="expiry_date" type="date" placeholder="Expiry Date..." defaultValue={expiry_date} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="notes" type="textarea" placeholder="Notes" defaultValue={notes} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={2} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row row-doc">
                    <label>
                        3. Document
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
