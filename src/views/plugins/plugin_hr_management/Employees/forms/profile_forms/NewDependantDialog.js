import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {ClearableInput, SelectGenderInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewDependantDialog.lazy.css";
import {insertEmployeeDependant} from "mutations/create";

//<editor-fold desc="NewDialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewDependantDialog";
    title = "Create Dependant";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

//</editor-fold>

@observer
class Controls extends React.Component {

    //<editor-fold desc="constructor">
    constructor() {
        super();

        this.form = new Form();
    }

    //</editor-fold>

    get isNewEmployee() {
        const {props: {dialog: {props: {isNewEmployee}}}} = this;
        return isNewEmployee;
    }

    //</editor-fold>

    get employeeItem() {
        return this.props.state.item;
    }

    //<editor-fold desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, isNewEmployee} = this;

        if (!form.isValid('fname')) {
            infoDialog.open('First Name is required');
            return;
        }
        if (!form.isValid('lname')) {
            infoDialog.open('Last Name is required');
            return;
        }
        if (!form.isValid('gender')) {
            infoDialog.open("Gender is required");
            return;
        }
        if (!form.isValid('dob')) {
            infoDialog.open("Date of Birth is required");
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
            formData: {...form.data, employee_id: this.employeeItem.id},
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertEmployeeDependant(data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close(), 0);
        });
    }

    //<editor-fold desc="render">
    render() {
        let {props: {onFormNext, onFormBack, onFormOpen}} = this;

        return <FormControls>
            <Row
                rendered
                activeAlways
                idx={1}
                title="1. Dependant Details"
            >
                <ClearableInput name="fname" type="text" placeholder="First Name" className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="lname" type="text" placeholder="Last Name" className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <SelectGenderInput name="gender" className="col-lg-6 form-control"
                                   onChange={this.form.onChange}/>
                <ClearableInput name="dob" type="date" placeholder="Date of Birth" className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }

    //</editor-fold>
}

export default NewDialog;
