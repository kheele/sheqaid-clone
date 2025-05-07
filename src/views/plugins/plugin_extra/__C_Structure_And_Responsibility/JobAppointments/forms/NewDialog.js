import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ANewDialog} from 'components/dialogs';
import {ClearableInput, SelectEmployeeInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./NewDialog.lazy.css";
import {insertEmployeeJobAppointment} from "mutations/create";

@observer
class NewDialog extends ANewDialog {
    pageKey = "NewJobAppointmentDialog";
    title = "Create Job Appointment";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {

    @observable
    state = {
        lists: {}
    };

    constructor() {
        super();

        this.onNext = this.onNext.bind(this);

        this.form = new Form();
    }

    get onSetSignatureSettings() {
        const {props: {dialog: {props: {onSetSignatureSettings}}}} = this;
        return onSetSignatureSettings;
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

        return true;
    }

    onSubmit(e, btn, onSaved) {
        const {form, isNewEmployee, embeddedEmployee} = this;

        if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
            infoDialog.open('Employee is required');
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
        insertEmployeeJobAppointment(data).then(employee_res => {
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
        const {
            isNewEmployee,
            embeddedEmployee,
            onSetSignatureSettings,
            props: {onFormNext, onFormBack, onFormOpen}
        } = this;

        let idx = !isNewEmployee && !embeddedEmployee ? 1 : 0;
        return <FormControls>
            {!isNewEmployee && !embeddedEmployee && <Row
                rendered
                active
                idx={1}
                title={`${++idx}. Employee`}
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
                title={`${++idx}. Job Appointment Details`}
                onFormOpen={onFormOpen}
                onFormBack={!isNewEmployee && !embeddedEmployee && onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput ref="date" name="date" type="date" placeholder="Job Appointment Start Date..." required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="expiry_date" name="expiry_date" type="date"
                                placeholder="Job Appointment Expiry Date..." required className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="notes" type="textarea" placeholder="Notes" required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title={`${++idx}. Document`}
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
            {/*<SignatureListRow*/}
            {/*    idx={!isNewEmployee && !embeddedEmployee ? 4 : 3}*/}
            {/*    pluginKey="HR"*/}
            {/*    module="JobAppointments"*/}
            {/*    onSetSignatureSettings={onSetSignatureSettings}*/}
            {/*    onFormOpen={onFormOpen}*/}
            {/*    onFormBack={onFormBack}*/}
            {/*>*/}

            {/*</SignatureListRow>*/}
        </FormControls>;
    }
}

export default NewDialog;
