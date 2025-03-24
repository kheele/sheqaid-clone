import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput, SelectEmployeeInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewDialog.lazy.css";
import {insertEmployeeWorkPermit} from "mutations/create";

@observer
class NewDialog extends ANewDialog {
    pageKey = "NewWorkPermitDialog";
    className = "ANewEmployeeDocDialog";
    title = "Create Work Permit";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/employees/workpermits/";
    @observable
    state = {};

    constructor(props) {
        super(props);

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
            if (!form.isValid('expiry_date')) {
                infoDialog.open('Expiry Date is required');
                return;
            }
        }
        if (idx === 2) {
            if (!form.isValid('doc')) {
                infoDialog.open('Please Upload Work Permit');
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
            infoDialog.open('Please Upload Work Permit');
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
        insertEmployeeWorkPermit(data).then(employee_res => {
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

        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title="1. Work Permit Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {!isNewEmployee && !embeddedEmployee &&
                    <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={this.employeeItem}
                                         className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <ClearableInput name="date" type="date" placeholder="Date..." required className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="expiry_date" type="date" placeholder="Expiry Date..." required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="notes" type="textarea" placeholder="Notes" className="col-lg-12 form-control"
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
                    name="doc"
                    buttonTitle="Upload File (PDF, Word or Photo)"
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon
                    className="col-lg-12"
                    onChange={this.form.onChange}
                />
            </Row>
            {/*<SignatureListRow*/}
            {/*    idx={3}*/}
            {/*    pluginKey="HR"*/}
            {/*    module="WorkPermits"*/}
            {/*    onSetSignatureSettings={onSetSignatureSettings}*/}
            {/*    onFormOpen={onFormOpen}*/}
            {/*    onFormBack={onFormBack}*/}
            {/*>*/}

            {/*</SignatureListRow>*/}
        </FormControls>;
    }
}

export default NewDialog;
