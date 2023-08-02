// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {
    ClearableInput,
    SelectEmployeeInput,
    SelectTrainingMatixInput,
    UploadButton
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import {AEditDialog} from 'components/dialogs';

import style from "./EditDialog.lazy.css";
import updateEmployeeCompetency from "mutations/all/EmployeeCompetency/updateEmployeeCompetency";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditCompetencyCertificateDialog extends AEditDialog {
    pageKey = "EditCompetencyCertificateDialog";
    title = "Edit Competency Certificate";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/employees/competencies/";
    
    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            type: [{text: "Accredited", value: "Accredited", checked: false}, {text: "Non-Accredited", value: "Non-Accredited", checked: false}],
            competency_type: ['Behavioural', 'Technical / Functional', 'Leadership']
        },
        trainer: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
        this.form.addChangeOne("training", this.onChangeTraining.bind(this));   
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeTraining">
    onChangeTraining(el, val){
        if(val) {
            const {hr} = val.data;
            this.state.trainer = hr;
        }
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 1) {
            if (!form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }
            if (!form.isValid('competency_type')) {
                infoDialog.open('Competency Type is required');
                return;
            }
        }
        if(idx === 3) {
            if (!form.isValid('doc')) {
                infoDialog.open('Please Upload Competency Certificate');
                return;
            }
        }
        
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, item: old_data} = this;

        //1
        if (!form.isValid('employee')) {
            infoDialog.open('Employee is required');
            return;
        }
        if (!form.isValid('competency_type')) {
            infoDialog.open('Competency Type is required');
            return;
        }
        //3
        if (!form.isValid('doc')) {
            infoDialog.open('Please Upload Competency Certificate');
            return;
        }
        
        const {
            employee, 
            issued_date, expiry_date, 
            type, competency_type, 
            accreditation_num, 
            training, 
            doc
        } = form.data;

        const data = {};
        
        ShouldUpdate.checkEmployee(data, old_data, employee, 'employee_id');
        ShouldUpdate.checkDate(data, old_data, issued_date, 'issued_date');
        ShouldUpdate.checkDate(data, old_data, expiry_date, 'expiry_date');
        ShouldUpdate.check(data, old_data, type, 'type');
        ShouldUpdate.check(data, old_data, competency_type, 'competency_type');
        ShouldUpdate.check(data, old_data, accreditation_num, 'accreditation_num');
        ShouldUpdate.checkTrainingMatrix(data, old_data, training, 'training_id');
        ShouldUpdate.checkFile(data, old_data, doc, 'doc');

        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateEmployeeCompetency({id: this.item.id, ...data}).then(res => {
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
    // </editor-fold>

    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;
        let {
            props: {
                onFormNext, onFormBack, onFormOpen, 
                dialog: {renderProfileCover}
            },
            item, item: {
                id,
                data: {
                    created_at, employee, title, training, trainer, type, competency_type, issued_date, expiry_date, accreditation_num, doc
                }
            }
        } = this;
        return <FormControls>
            <Row 
                rendered  
                active
                idx={1}
                title="1. Competency Details" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={employee} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="issued_date" type="date" placeholder="Date Of Issue..." defaultValue={issued_date} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="expiry_date" type="date" placeholder="Expiry Date..." defaultValue={expiry_date} className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="type" type="radio" placeholder="Certificate Type" defaultValue={type} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.type}/>
                <ClearableInput name="competency_type" type="select" placeholder="Competency Type..." defaultValue={competency_type} required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.competency_type} returnValue add/>
                <ClearableInput name="accreditation_num" type="text" placeholder="Accreditation Number" defaultValue={accreditation_num} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Training Details" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <SelectTrainingMatixInput name="training" defaultValue={training} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <Trainer state={this.state}/>
            </Row>
            <Row 
                rendered 
                idx={3}
                title="3. Certificate Details" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack}
            >
                <UploadButton 
                    name="doc" 
                    buttonTitle="Upload File (PDF, Word or Photo)" 
                    type={['PDF', 'Word', 'Image']}
                    defaultValue={doc}
                    showOnlyIcon 
                    className="col-lg-12" 
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="Trainer">
@observer
class Trainer extends React.Component {
    
    render(){
        const {state: {trainer}} = this.props;
        if(!trainer) return null;
        return <div className="Trainer row">
            <label className="hor-center">Trainer</label>
            <div>{trainer.lname + ' ' + trainer.fname}</div>
        </div>;
    }
}
// </editor-fold>

export default EditCompetencyCertificateDialog;
