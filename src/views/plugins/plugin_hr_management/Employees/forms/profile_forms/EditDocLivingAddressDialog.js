import React from "react";
import {observer} from 'mobx-react';
import {extendObservable} from 'mobx';

import Form from 'utils/Form';

import {ShouldUpdate} from 'utils/Utils';
import {ClearableInput, SelectCityInput, SelectCountryInput, SelectZoneInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import style from "./EditDocLivingAddressDialog.lazy.css";
import {updateEmployeeDocLivingAddress} from "mutations/update";

//<editor-fold desc="EditDialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditDocLivingAddressDialog";
    title = "Edit Living Address";

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

        this.onNext = this.onNext.bind(this);

        this.form = new Form();
        this.form.addChangeOne('country', this.onChangeCountry.bind(this));
        this.form.addChangeOne('zone', this.onChangeProvince.bind(this));
    }

    //</editor-fold>

    get isNewEmployee() {
        const {props: {dialog: {props: {isNewEmployee}}}} = this;
        return isNewEmployee;
    }

    get item() {
        return this.props.state.item;
    }

    get itemData() {
        if (this.isNewEmployee) {
            return this.item.data || this.item;
        }
        return this.item.data;
    }

    //</editor-fold>

    onChangeCountry(el, val) {
        this.props.execWhen(() => this.refs.zone).then(ref => {
            ref.country = val;
        });
    }

    onChangeProvince(el, val) {
        this.props.execWhen(() => this.refs.city).then(ref => {
            ref.zone = val;
        });
    }

    //<editor-fold desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            if (!form.isValid('country')) {
                infoDialog.open('Country is required');
                return;
            }
            // if (!form.isValid('zone')) {
            //     infoDialog.open('Province is required');
            //     return;
            // }
            // if (!form.isValid('city')) {
            //     infoDialog.open("City Code is required");
            //     return;
            // }
            // if (!form.isValid('local_address')) {
            //     infoDialog.open("Local Area is required");
            //     return;
            // }
            // if (!form.isValid('street_address')) {
            //     infoDialog.open("Street Address is required");
            //     return;
            // }
        }

        return true;
    }

    onSubmit(e, btn, onSaved) {
        const {form, isNewEmployee, item: {data: old_data}} = this;

        //1
        if (!form.isValid('country')) {
            infoDialog.open('Country is required');
            return;
        }
        // if (!form.isValid('zone')) {
        //     infoDialog.open('Province is required');
        //     return;
        // }
        // if (!form.isValid('city')) {
        //     infoDialog.open("City Code is required");
        //     return;
        // }
        // if (!form.isValid('local_address')) {
        //     infoDialog.open("Local Area is required");
        //     return;
        // }
        // if (!form.isValid('street_address')) {
        //     infoDialog.open("Street Address is required");
        //     return;
        // }

        //2
        // if (!form.isValid('doc')) {
        //     infoDialog.open("Proof of Living Address is required");
        //     return;
        // }

        if (isNewEmployee) {
            console.log("res", form.data)
            onSaved && onSaved(form.data);
            infoDialog.open("Record added.");
            infoDialog.close(2000);
            this.props.close();
            return;
        }

        const {
            //1
            country,
            zone,
            city,
            local_address,
            street_address,
            //2
            doc,
        } = form.data;
        const data = {};

        ShouldUpdate.checkCountry(data, old_data, country, 'country');
        ShouldUpdate.checkZone(data, old_data, zone, 'zone');
        ShouldUpdate.checkCity(data, old_data, city, 'city');

        ShouldUpdate.check(data, old_data, local_address, 'local_address');
        ShouldUpdate.check(data, old_data, street_address, 'street_address');
        ShouldUpdate.checkFile(data, old_data, doc, 'doc');

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateEmployeeDocLivingAddress({id: this.item.id, ...data}).then(res => {
            console.log("res", res)
            if (res) {
                extendObservable(old_data, res.data);
            }
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
            item,
            itemData: {
                id,
                created_at,
                //1
                country,
                zone,
                city,
                local_address,
                street_address,
                //2
                doc,
            }
        } = this;

        console.log(this.item)

        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title="1. Living Address Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <SelectCountryInput ref="country" name="country"
                                    placeholder="Country..." defaultValue={country}
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectZoneInput ref="zone" name="zone"
                                 placeholder="State/Province/District..." defaultValue={zone}
                                 className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <SelectCityInput ref="city" name="city" placeholder="City"
                                 defaultValue={city} className="col-lg-6 form-control"
                                 onChange={this.form.onChange}/>
                <ClearableInput name="local_address" type="text" placeholder="Local Area"
                                defaultValue={local_address} className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="street_address" type="text" placeholder="Street Address"
                                defaultValue={street_address} className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Proof of Living Address"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <UploadButton
                    name="doc"
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon
                    buttonTitle="Upload (PDF/Word/Image)"
                    defaultValue={doc}
                    className="col-lg-12"
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>;
    }
}

export default EditDialog;
