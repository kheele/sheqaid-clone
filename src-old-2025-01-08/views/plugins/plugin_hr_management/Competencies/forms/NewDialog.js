// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput, SelectEmployeeInput, SelectTrainingMatixInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import {ANewDialog} from 'components/dialogs';

import style from "./NewDialog.lazy.css";
import {insertEmployeeCompetency} from "mutations/create";
import {Dates} from "utils/Dates";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewCompetencyCertificateDialog";
    className = "ANewEmployeeDocDialog";
    title = "Create Competency Certificate";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
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
            type: [{text: "Accredited", value: "Accredited", checked: false}, {
                text: "Non-Accredited",
                value: "Non-Accredited",
                checked: false
            }],
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

    get embeddedEmployee() {
        const {props: {dialog: {props: {embeddedEmployee}}}} = this;
        return embeddedEmployee;
    }

    // </editor-fold>

    get isNewEmployee() {
        const {props: {dialog: {props: {isNewEmployee}}}} = this;
        return isNewEmployee;
    }

    // </editor-fold>

    get employeeItem() {
        return this.props.state.item;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeTraining">
    onChangeTraining(el, val) {
        if (val) {
            const {hr} = val.data;
            this.state.trainer = hr;
        }
    }

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form, isNewEmployee, embeddedEmployee} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }
            if (!form.isValid('competency_type')) {
                infoDialog.open('Competency Type is required');
                return;
            }
        }
        if (idx === 3) {
            if (!form.isValid('doc')) {
                infoDialog.open('Please Upload Competency Certificate');
                return;
            }
        }

        return true;
    }

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, isNewEmployee, embeddedEmployee} = this;

        //1
        if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
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

        if (isNewEmployee) {
            console.log("res", form.data)
            onSaved && onSaved(form.data);
            infoDialog.open("Record added.");
            infoDialog.close(2000);
            this.props.close();
            return;
        }

        const {
            employee,//
            issued_date, //
            expiry_date, //
            type, //
            competency_type, //
            accreditation_num, //
            training, //
            doc//
        } = form.data;

        const data = {
            employee_id: (embeddedEmployee || employee).id,
            issued_date: Dates.formatDateSQL(issued_date),
            expiry_date: Dates.formatDateSQL(expiry_date),
            type,
            competency_type,
            accreditation_num,
            training_id: training && training.id,
            doc: doc.path
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();

        insertEmployeeCompetency(data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {isNewEmployee, embeddedEmployee, props: {onFormNext, onFormBack, onFormOpen}} = this;

        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title="1. Competency Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {!isNewEmployee && !embeddedEmployee &&
                    <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={this.employeeItem}
                                         className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <ClearableInput name="issued_date" type="date" placeholder="Date Of Issue..." required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="expiry_date" type="date" placeholder="Expiry Date..."
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="type" type="radio" placeholder="Certificate Type" required
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.type}/>
                <ClearableInput name="competency_type" type="select" placeholder="Competency Type..." required
                                className="col-lg-6 form-control" onChange={this.form.onChange}
                                values={this.state.lists.competency_type} returnValue add/>
                <ClearableInput name="accreditation_num" type="text" placeholder="Accreditation Number" required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Training Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <SelectTrainingMatixInput name="training" required className="col-lg-12 form-control"
                                          onChange={this.form.onChange}/>
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

    render() {
        const {state: {trainer}} = this.props;
        if (!trainer) return null;
        return <div className="Trainer row">
            <label className="hor-center">Trainer</label>
            <div>{trainer.lname + ' ' + trainer.fname}</div>
        </div>;
    }
}

// </editor-fold>

export default NewDialog;
