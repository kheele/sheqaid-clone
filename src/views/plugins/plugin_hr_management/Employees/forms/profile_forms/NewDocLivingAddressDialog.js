import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {ClearableInput, SelectCityInput, SelectCountryInput, SelectZoneInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewDocLivingAddressDialog.lazy.css";
import insertEmployeeDocLivingAddress
    from "mutations/all/EmployeeDocument/EmployeeDocLivingAddress/insertEmployeeDocLivingAddress";

//<editor-fold desc="NewDialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewDocLivingAddressDialog";
    title = "Create Living Address";

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
    }

    //</editor-fold>

    //<editor-fold desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            if (!form.isValid('country')) {
                infoDialog.open('Country is required');
                return;
            }
            if (!form.isValid('province')) {
                infoDialog.open('Province is required');
                return;
            }
            if (!form.isValid('city')) {
                infoDialog.open("City Code is required");
                return;
            }
            if (!form.isValid('local_address')) {
                infoDialog.open("Local Area is required");
                return;
            }
            // if (!form.isValid('street_address')) {
            //     infoDialog.open("Street Address is required");
            //     return;
            // }
        }

        return true;
    }

    //</editor-fold>

    //<editor-fold desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        //1
        if (!form.isValid('country')) {
            infoDialog.open('Country is required');
            return;
        }
        if (!form.isValid('province')) {
            infoDialog.open('Province is required');
            return;
        }
        if (!form.isValid('city')) {
            infoDialog.open("City Code is required");
            return;
        }
        if (!form.isValid('local_address')) {
            infoDialog.open("Local Area is required");
            return;
        }
        // if (!form.isValid('street_address')) {
        //     infoDialog.open("Street Address is required");
        //     return;
        // }

        //2
        if (!form.isValid('doc')) {
            infoDialog.open("Proof of Living Address is required");
            return;
        }

        const {
            //1
            country,
            province,
            city,
            local_address,
            street_address,
            //2
            doc,
        } = form.data;
        const data = {
            employee_id: this.employeeItem.id,
            is_default: true,
            //1
            country_id: country.id,
            province_id: province.id,
            city_id: city.id,
            local_address,
            street_address,
            //2
            doc: doc && doc.path,
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertEmployeeDocLivingAddress(data).then(res => {
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

    //</editor-fold>

    get employeeItem() {
        return this.props.state.item;
    }

    //<editor-fold desc="render">
    render() {
        let {props: {onFormNext, onFormBack, onFormOpen}} = this;

        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title="1. Living Address Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <SelectCountryInput ref="country" name="country" placeholder="Country..."
                                    className="col-lg-12 form-control"
                                    onChange={this.form.onChange}/>
                <SelectZoneInput ref="province" name="province" placeholder="Province..."
                                 className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <SelectCityInput ref="city" name="city" placeholder="City" className="col-lg-6 form-control"
                                 onChange={this.form.onChange}/>
                <ClearableInput name="local_address" type="text" placeholder="Local Area"
                                className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="street_address" type="text" placeholder="Street Address"
                                className="col-lg-6 form-control"
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
                    className="col-lg-12"
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>;
    }

    //</editor-fold>
}

export default NewDialog;
