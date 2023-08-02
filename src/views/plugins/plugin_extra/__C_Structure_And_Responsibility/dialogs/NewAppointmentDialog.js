import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {TinyMCE} from 'components/documents';
import {ANewDialog} from 'components/dialogs';
import {ClearableInput, Clickable, SelectEmployeeInput, UploadButton} from 'components/inputs';
import {NavButtons} from 'components/FormComponents';

import style from "./NewAppointmentDialog.lazy.css";

@observer
class NewDialog extends ANewDialog {
    pageKey = "NewJobAppointmentDialog";
    title = "Create Job Appointment";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/StructureAndResponsibility/appointments/";

    @observable
    state = {
        showTinyMCE: true
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
        const {form} = this;

        if (!form.isValid('employee')) {
            infoDialog.open('Employee is required');
            return;
        }
        if (!form.isValid('notes') && !form.isValid('doc')) {
            infoDialog.open('Notes OR Document is/are required');
            return;
        }

        const {
            employee: {id, data: {fname, lname}}, 
            date, expiry_date,
            notes,
            doc
        } = form.data;
        const data = { 
            employee: {id, fname, lname}
        };
        if (date) {
            data.date = date.getTime();
        }
        if (expiry_date) {
            data.expiry_date = expiry_date.getTime();
        }
        if (notes) {
            data.notes = notes;
        }
        if (doc) {
            data.doc = doc.path;
        }
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(employee_res => {
            console.log("res", employee_res)
            onSaved && onSaved(employee_res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <div className="row active">
                    <label>
                        1. Employee
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <SelectEmployeeInput name="employee" placeholder="Employee..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput ref="date" name="date" type="date" placeholder="Date..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput ref="expiry_date" name="expiry_date" type="date" placeholder="Expiry Date..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        2. Notes
                        <Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
			<TinyMCE state={this.state} name="notes" onChange={this.form.onChange}/>
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
                            buttonTitle="Document (PDF/Word)" 
                            type={['PDF', 'Word']}
                            showOnlyIcon 
                            className="col-lg-6 col-xs-12 hor-center"
                            onChange={this.form.onChange}
                        />
                    </div>
                    <NavButtons idx={3} onBack={onFormBack}/>
                </div>
            </div>
        </div>);
    }
}

export default NewDialog;
