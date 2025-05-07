import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput, SelectEmployeeInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewDialog.lazy.css";
import {insertEmployeeMedical} from "mutations/create";

@observer
class NewDialog extends ANewDialog {
    pageKey = "NewMedicalFitnessCertificateDialog";
    className = "ANewEmployeeDocDialog";
    title = "Create Medical Fitness Certificate";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/employees/medicals/";
    @observable
    state = {
        lists: {
            annexture_3: [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}],
            fitness_option: [{text: "Fit", value: "Fit", checked: false}, {
                text: "Fit with Restrictions",
                value: "Fit with Restrictions",
                checked: false
            }]
        }
    };

    constructor(props) {
        super(props);

        this.onNext = this.onNext.bind(this);

        this.form = new Form();
    }

    get embeddedEmployee() {
        const {props: {dialog: {props: {embeddedEmployee}}}} = this;
        return embeddedEmployee;
    }

    get isNewEmployee() {
        const {props: {dialog: {props: {isNewEmployee}}}} = this;
        return isNewEmployee;
    }

    get employeeItem() {
        return this.props.state.item;
    }

    onNext(e, btn) {
        const {form, isNewEmployee, embeddedEmployee} = this;
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

    onSubmit(e, btn, onSaved) {
        const {form, isNewEmployee, embeddedEmployee} = this;

        if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
            infoDialog.open('Employee is required');
            return;
        }
        if (!form.isValid('expiry_date')) {
            infoDialog.open('Expiry Date is required');
            return;
        }
        if (!form.isValid('doc')) {
            infoDialog.open('Please Upload Medical Certificate');
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

        const data = {
            formData: {...form.data, embeddedEmployee},
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertEmployeeMedical(data).then(employee_res => {
            console.log("res", employee_res)
            onSaved && onSaved(employee_res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }

    render() {
        const {isNewEmployee, embeddedEmployee, props: {onFormNext, onFormBack, onFormOpen}} = this;

        let idx = !isNewEmployee && !embeddedEmployee ? 1 : 0;
        return <FormControls>
            {!isNewEmployee && !embeddedEmployee && <Row
                rendered
                active
                idx={1}
                title='1. Employee'
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <SelectEmployeeInput
                    name="employee"
                    placeholder="Employee..."
                    defaultValue={this.employeeItem}
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
            </Row>}
            <Row
                rendered
                active={isNewEmployee || embeddedEmployee}
                idx={2}
                title={`${++idx}. Medical Fitness Details`}
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={!isNewEmployee && !embeddedEmployee && onFormBack}
            >
                <ClearableInput name="expiry_date" type="date" placeholder="Expiry Date..." required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="annexture_3" type="radio" placeholder="Annexture 3?" required
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.annexture_3}/>
                <ClearableInput name="fitness_option" type="radio" placeholder="Fitness"
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.fitness_option}/>
                <ClearableInput name="restrictions" type="textarea" placeholder="Restrictions (if any)"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title={`${++idx}. Documents`}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <FormControls>
                    <Row
                        rendered
                        activeAlways
                        idx={4.1}
                        title={`${idx}.1. Medical Attachment`}
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
                    <Row
                        rendered
                        activeAlways
                        idx={4.2}
                        title={`${idx}.2. Annexture 3 Attachment`}
                    >
                        <UploadButton
                            name="annexture3_doc"
                            buttonTitle="Upload File (PDF, Word or Photo)"
                            type={['PDF', 'Word', 'Image']}
                            showOnlyIcon
                            className="col-lg-12"
                            onChange={this.form.onChange}
                        />
                    </Row>
                </FormControls>
            </Row>
        </FormControls>;
    }
}

export default NewDialog;
