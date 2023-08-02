// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {
    ClearableInput,
    SelectEmployeeInput,
    SelectTrainingMatixInput,
    UploadButton
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import {ANewDialog} from 'components/dialogs';

import style from "./NewCompetencyCertificateDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewCompetencyCertificateDialog extends ANewDialog {
    pageKey = "NewCompetencyCertificateDialog";
    title = "Create Competency Certificate";

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
        const {form} = this;

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
            employee: {id, data: {fname, lname}},//
            issued_date, expiry_date, //
            type, competency_type, //
            accreditation_num, //
            training, //
            doc//
        } = form.data;
        const data = { 
            employee: {id, fname, lname},
            doc: doc.path
        };
        if(issued_date){
            data.issued_date = issued_date.getTime();
        }
        if(expiry_date){
            data.expiry_date = expiry_date.getTime();
        }
        if(accreditation_num) {
            data.accreditation_num = accreditation_num;
        }
        if(type) {
            data.type = type;
        }
        if(competency_type) {
            data.competency_type = competency_type;
        }
        if(training) {
            const {id: _id, data: {type: _type, course_or_module, job_title, hr}} = training;
            data.training = {
                id: _id, 
                type: _type, 
                course_or_module, 
                job_title
            };
            data.trainer = hr;
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
    // </editor-fold>

    get employeeItem() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        
        return <FormControls>
            <Row 
                rendered  
                active
                idx={1}
                title="1. Competency Details" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={this.employeeItem} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="issued_date" type="date" placeholder="Date Of Issue..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="expiry_date" type="date" placeholder="Expiry Date..." className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="type" type="radio" placeholder="Certificate Type" required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.type}/>
                <ClearableInput name="competency_type" type="select" placeholder="Competency Type..." required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.competency_type} returnValue add/>
                <ClearableInput name="accreditation_num" type="text" placeholder="Accreditation Number" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Training Details" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <SelectTrainingMatixInput name="training" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
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

export default NewCompetencyCertificateDialog;
