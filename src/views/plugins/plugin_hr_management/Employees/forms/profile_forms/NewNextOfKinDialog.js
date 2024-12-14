import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {ClearableInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewNextOfKinDialog.lazy.css";
import {insertEmployeeNextOfKin} from "mutations/create";

//<editor-fold desc="NewDialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewNextOfKinDialog";
    title = "Create Next Of Kin";

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
        if (!form.isValid('phone1') && !form.isValid('phone2')) {
            infoDialog.open("At least 1 Phone No. is required");
            return;
        }
        if (!form.isValid('relationship')) {
            infoDialog.open("Relationship is required");
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
            phone1,
            phone2,
            relationship,
        } = form.data;
        const data = {
            employee_id: this.employeeItem.id,
            fname,
            lname,
            phone1,
            phone2,
            relationship,
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertEmployeeNextOfKin(data).then(res => {
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
                title="1. Next Of Kin Details"
            >
                <ClearableInput name="fname" type="text" placeholder="First Name" className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="lname" type="text" placeholder="Last Name" className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="phone1" type="text" placeholder="1) Phone No." className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="phone2" type="text" placeholder="2) Phone No." className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="relationship" type="text" placeholder="Relationship"
                                className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }

    //</editor-fold>
}

export default NewDialog;
