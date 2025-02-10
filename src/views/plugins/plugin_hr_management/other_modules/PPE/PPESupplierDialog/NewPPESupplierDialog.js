// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ANewDialog} from 'components/dialogs';
import {ClearableInput, RowOrgs} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./NewPPESupplierDialog.lazy.css";
import {insertPPESupplier} from "mutations/create";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewPPESupplierDialog";
    title = "Create PPE Supplier";

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

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            duration_type: [
                {text: "Years", value: "Years", checked: false},
                {text: "Months", value: "Months", checked: false},
                {text: 'Weeks', value: 'Weeks', checked: false},
                {text: 'Days', value: 'Days', checked: false}
            ]
        },
        duration_type: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 0) {
            if (!form.isValid('client')) {
                infoDialog.open('Company is required');
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
        if (!form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }

        //2
        if (!form.isValid('name')) {
            infoDialog.open('Supplier Name is required');
            return;
        }

        const {
            site,
            project,
            client,
            //
            name,
            contact_person,
            email,
            phone,
            address,
        } = form.data;
        const data = {
            client_id: client && client.id,
            project_id: project && project.id,
            site_id: site && site.id,
            //
            name,
            contact_person,
            email,
            phone,
            address,
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertPPESupplier(data).then(res => {
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

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        return (<FormControls>
            <RowOrgs
                onChange={this.form.onChange}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <Row
                    rendered
                    idx={1}
                    title="1. PPE Supplier Details"
                    onFormNext={null}
                >
                    <ClearableInput
                        name="name"
                        type="text"
                        placeholder="Supplier Name"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="contact_person"
                        type="text"
                        placeholder="Contact Person"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="email"
                        type="text"
                        placeholder="Email Address"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="phone"
                        type="text"
                        placeholder="Phone No."
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="address"
                        type="textarea"
                        placeholder="Address"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                </Row>
            </RowOrgs>
        </FormControls>);
    }

    // </editor-fold>
}

export default NewDialog;
