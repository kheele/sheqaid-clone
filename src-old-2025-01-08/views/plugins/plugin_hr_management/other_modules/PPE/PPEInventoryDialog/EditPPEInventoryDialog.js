// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {ClearableInput, ProfileField, RowOrgs, SelectPPETypeInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./EditPPEInventoryDialog.lazy.css";
import {findByIdPPEInventory} from "mutations/findById";
import {updatePPEInventory} from "mutations/update";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditPPEInventoryDialog";
    title = "Edit PPE Inventory";
    findById = findByIdPPEInventory;
    removeById = updatePPEInventory;

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
        } = this;
        const {is: {isContractor}, loggedContractor} = storage;

        const onSubmit = (data, onSaved) => {
            if (Object.keys(data).isEmpty()) {
                infoDialog.open("Nothing changed!");
                return;
            }

            console.log(data)

            btn.text("Saving...").disabled();
            progressDialog.open();
            updatePPEInventory({id: this.item.id, ...data}).then(res => {
                console.log("res", res)
                if (res === "EMAIL_DUP") {
                    infoDialog.open("An Employee with this email address already exist.");
                } else if (res === "PHONE_DUP") {
                    infoDialog.open("An Employee with this phone number address already exist.");
                } else {
                    const res_data = res;
                    onSaved && onSaved(res_data);
                    infoDialog.open("Record successfully updated.");
                    infoDialog.close(2000);
                    // this.props.close();
                }
            }).finally(() => {
                btn.text("Save").enabled();
                setTimeout(() => progressDialog.close());
            });
        };

        const {idx} = btn.props;
        if (idx === 0) {
            // const {isConsultant} = storage.is;
            // if (isConsultant && !form.isValid('client')) {
            //     infoDialog.open('Company is required');
            //     return;
            // }

            const {
                site, project, client,
            } = form.data;

            const data = {};

            if (isContractor) {
                ShouldUpdate.checkSite(data, old_data, site, 'contractor_site_id');
            } else {
                ShouldUpdate.checkClient(data, old_data, client);
                ShouldUpdate.checkProject(data, old_data, project);
                ShouldUpdate.checkSite(data, old_data, site);
            }

            onSubmit(data);
            return;
        }

        if (idx === 1) {
            if (!form.isValid('ppe_type')) {
                infoDialog.open('PPE Type is required');
                return;
            }
            if (!form.isValid('location')) {
                infoDialog.open('Inventory Location is required');
                return;
            }

            const {
                site, project, client,
                ppe_type,
                location,
                reorder_threshold,
            } = form.data;

            const data = {};
            ShouldUpdate.checkPPEType(data, old_data, ppe_type, 'ppe_type');
            ShouldUpdate.check(data, old_data, location, 'location');
            ShouldUpdate.check(data, old_data, reorder_threshold, 'reorder_threshold');

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
                    ppe_type,
                    location,
                    reorder_threshold,
                    quantity,
                }
            }
        } = this;

        return (<FormControls>
            <RowOrgs
                onChange={this.form.onChange}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormSave={this.onFormSave}
            >
                <Row
                    rendered
                    idx={1}
                    title="1. PPE Inventory Details"
                    onFormNext={null}
                >
                    <SelectPPETypeInput
                        name="ppe_type"
                        defaultValue={ppe_type}
                        placeholder="PPE Type..."
                        className="col-lg-12 form-control"
                        onChange={this.onChange}
                    />
                    <ClearableInput
                        name="location"
                        type="text"
                        defaultValue={location}
                        placeholder="Inventory Location"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="reorder_threshold"
                        type="number"
                        defaultValue={reorder_threshold}
                        placeholder="Reorder Threshold"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ProfileField title="Quantity" value={quantity} className="col-lg-12"/>
                </Row>
            </RowOrgs>
        </FormControls>);
    }

    // </editor-fold>
}

export default EditDialog;
