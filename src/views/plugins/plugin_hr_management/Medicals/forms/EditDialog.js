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
import {updateEmployeeMedical} from "mutations/update";
import {findByIdEmployeeMedical} from "mutations/findById";

@observer
class EditDialog extends AEditDialog {
    pageKey = "EditMedicalFitnessCertificateDialog";
    className = "AEditEmployeeDocDialog";
    title = "Edit Medical Fitness Certificate";
    removeById = updateEmployeeMedical;

    constructor(props) {
        super(props, style);
    }

    get findById() {
        const {props: {isNewEmployee}} = this;
        if (isNewEmployee) return;
        return findByIdEmployeeMedical;
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
                infoDialog.open('Please Upload Medical Fitness Certificate');
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
            infoDialog.open('Please Upload Medical Fitness Certificate');
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

        const {employee, expiry_date, annexture_3, fitness_option, restrictions, annexture3_doc, doc} = form.data;

        const data = {};

        if (!embeddedEmployee) {
            ShouldUpdate.checkEmployee(data, old_data, employee, 'employee_id');
        }
        ShouldUpdate.checkDate(data, old_data, expiry_date, 'expiry_date');
        ShouldUpdate.check(data, old_data, annexture_3, 'annexture_3');
        ShouldUpdate.check(data, old_data, fitness_option, 'fitness_option');
        ShouldUpdate.check(data, old_data, restrictions, 'restrictions');
        ShouldUpdate.checkFile(data, old_data, annexture3_doc, 'annexture3_doc');
        ShouldUpdate.checkFile(data, old_data, doc, 'doc');

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateEmployeeMedical({id: this.item.id, ...data}).then(res => {
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
                    created_at, expiry_date, annexture_3, fitness_option, restrictions, annexture3_doc, doc, employee
                }
            }
        } = this;

        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title="1. Medical Fitness Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {!isNewEmployee && !embeddedEmployee &&
                    <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={employee}
                                         className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <ClearableInput name="expiry_date" type="date" placeholder="Expiry Date..."
                                defaultValue={expiry_date}
                                required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="annexture_3" type="radio" placeholder="Annexture 3?"
                                defaultValue={annexture_3}
                                required className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.annexture_3}/>
                <ClearableInput name="fitness_option" type="radio" placeholder="Fitness"
                                defaultValue={fitness_option}
                                required className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.fitness_option}/>
                <ClearableInput name="restrictions" type="textarea" placeholder="Restrictions (if any)"
                                defaultValue={restrictions} className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Document"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <UploadButton
                    name="annexture3_doc"
                    buttonTitle="Upload Annexture 3 (PDF, Word or Photo)"
                    type={['PDF', 'Word', 'Image']}
                    defaultValue={annexture3_doc}
                    showOnlyIcon
                    className="col-lg-12"
                    onChange={this.form.onChange}
                />
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
}

export default EditDialog;
