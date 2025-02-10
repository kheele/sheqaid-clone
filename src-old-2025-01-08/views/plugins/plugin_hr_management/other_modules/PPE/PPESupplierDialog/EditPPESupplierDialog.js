// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {ClearableInput, RowOrgs} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./EditPPESupplierDialog.lazy.css";
import {findByIdPPESupplier} from "mutations/findById";
import {updatePPESupplier} from "mutations/update";
import {NewPPEItemListTable} from "components/FormTableComponents";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditPPESupplierDialog";
    title = "Edit PPE Supplier";
    findById = findByIdPPESupplier;
    removeById = updatePPESupplier;
    onUpdate = updatePPESupplier;

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
    path = "plugin_sheq_assist/employees/ppe/";

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
        this.onFormSave = this.onFormSave.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    @computed get item() {
        return this.props.state.item;
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

    //<editor-fold desc="onFormSave">
    async onFormSave(e, btn) {
        const {
            form,
            item: {id, data: old_data},
            props: {dialog: {onProcessUpdateOrgs, onUpdateSave}},
        } = this;
        const {is: {isContractor}, loggedContractor} = storage;

        const onSubmit = (data, onSaved) => {
            onUpdateSave(data, btn, onSaved);
        };

        const {idx} = btn.props;
        if (idx === 0) {
            return onProcessUpdateOrgs(btn);
        }

        if (idx === 1) {
            if (!form.isValid('name')) {
                infoDialog.open('Supplier Name is required');
                return;
            }

            const {
                site, project, client,
                name,
                contact_person,
                email,
                phone,
                address,
            } = form.data;

            const data = {};
            ShouldUpdate.check(data, old_data, name, 'name');
            ShouldUpdate.check(data, old_data, contact_person, 'contact_person');
            ShouldUpdate.check(data, old_data, email, 'email');
            ShouldUpdate.check(data, old_data, phone, 'phone');
            ShouldUpdate.check(data, old_data, address, 'address');

            onSubmit(data);
            return;
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        let {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item: {
                id, data: {
                    created_at,
                    site, project, client,
                    name,
                    contact_person,
                    email,
                    phone,
                    address,
                    ppe_item_list,
                }
            }
        } = this;

        return (<FormControls>
            <RowOrgs
                client={client}
                project={project}
                site={site}
                onChange={this.form.onChange}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormSave={this.onFormSave}
            >
                <Row
                    rendered
                    idx={1}
                    title="1. PPE Supplier Details"
                >
                    <ClearableInput
                        name="name"
                        type="text"
                        defaultValue={name}
                        placeholder="Supplier Name"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="contact_person"
                        type="text"
                        defaultValue={contact_person}
                        placeholder="Contact Person"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="email"
                        type="text"
                        defaultValue={email}
                        placeholder="Email Address"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="phone"
                        type="text"
                        defaultValue={phone}
                        placeholder="Phone No."
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="address"
                        type="textarea"
                        defaultValue={address}
                        placeholder="Address"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                </Row>
            </RowOrgs>
            <Row
                rendered
                idx={2}
                title="2. PPE Items"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <NewPPEItemListTable name="ppe_item_list" defaultValue={ppe_item_list} readonly
                                     className="w-full-calc-add-10 -margin-l-10 -margin-t-5"/>
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

export default EditDialog;
//288