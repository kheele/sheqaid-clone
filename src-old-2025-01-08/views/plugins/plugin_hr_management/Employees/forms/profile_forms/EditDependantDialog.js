import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {ShouldUpdate} from 'utils/Utils';
import {ClearableInput, SelectGenderInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import style from "./EditDependantDialog.lazy.css";
import {updateEmployeeDependant} from "mutations/update";

//<editor-fold desc="EditDialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditDependantDialog";
    title = "Edit Dependant Details";

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

    get item() {
        return this.props.state.item;
    }

    onSubmit(e, btn, onSaved) {
        const {form, isNewEmployee, item: {data: old_data}} = this;

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

        const {
            fname,
            lname,
            gender,
            dob,
        } = form.data;
        const data = {};

        ShouldUpdate.check(data, old_data, fname, 'fname');
        ShouldUpdate.check(data, old_data, lname, 'lname');
        ShouldUpdate.check(data, old_data, gender, 'gender');
        ShouldUpdate.check(data, old_data, dob, 'dob');

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateEmployeeDependant({id: this.item.id, ...data}).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close(), 0);
        });
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    //1
                    fname,
                    lname,
                    gender,
                    dob,
                }
            }
        } = this;

        console.log(this.item)

        return <FormControls>
            <Row
                rendered
                activeAlways
                idx={1}
                title="1. Dependant Details"
            >
                <ClearableInput name="fname" type="text" placeholder="First Name"
                                defaultValue={fname} className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="lname" type="text" placeholder="Last Name"
                                defaultValue={lname} className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <SelectGenderInput name="gender" defaultValue={gender} className="col-lg-6 form-control"
                                   onChange={this.form.onChange}/>
                <ClearableInput name="dob" type="date" placeholder="Date of Birth"
                                defaultValue={dob} className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
}

export default EditDialog;
