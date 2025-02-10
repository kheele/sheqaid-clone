import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {ClearableInput, ProfilePic, SelectSectorInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewDialog.lazy.css";
import {observable} from "mobx";
import {insertClient} from "mutations/create";

@observer
class NewDialog extends ANewDialog {
    pageKey = "Client";
    title = "Create Company";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/clients/";
    @observable
    state = {
        lists: {
            sector_list: ['Chemicals', 'Construction', 'Fire Management', 'Harvesting', 'Manufacturing', 'Mining', 'Silviculture', 'Transport', 'Other'].map(value => {
                return {value, text: value, checked: false};
            }),
        },
    };

    constructor() {
        super();

        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('name')) {
            infoDialog.open('Company Name is required');
            return;
        }
        if (form.isValid('email') && !form.get('email').isEmailAddress()) {
            infoDialog.open('Please enter a valid Email Address');
            return;
        }
        if (form.isValid('contractor_email') && !form.get('contractor_email').isEmailAddress()) {
            infoDialog.open('Please enter a valid Contractor Email Address');
            return;
        }

        const {
            name,
            business_id,
            phone,
            email,
            contractor_email,
            address,
            profile_pic,
            sector_list,
        } = form.data;
        const data = {
            name,
            business_id,
            phone,
            email,
            contractor_email,
            address,
            profile_pic: profile_pic && profile_pic.path,
            sector_list: {
                data: (sector_list || []).map(({id: sector_id, name}) => ({
                    sector_id,
                    name,
                }))
            }
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertClient(data).then(res => {
            console.log("res", res)
            if (res === "DUP_CONTRACTOR_EMAIL") {
                infoDialog.open("Another company is already using the Contractor Email Address provided.");
            } else {
                storage.load.loadClients(true);
                onSaved && onSaved(res);
                infoDialog.open("Record successfully saved.");
                infoDialog.close(2000);
                this.props.close();
            }
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }

    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        return <FormControls onChange={this.form.onChange}>
            <Row
                activeAlways
                rendered
                idx={1}
                title="Company Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}>
                <ProfilePic name="profile_pic" onChange={this.form.onChange}/>
                <ClearableInput name="name" type="text" placeholder="Company Name" required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="business_id" type="text" placeholder="Company Business ID"
                                desc="This is required for COVID-19 data submission purposes. You will receive Business ID when registering your business for COVID-19 data submission on https://www.nioh.ac.za/ website"
                                required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="phone" type="text" placeholder="Contact No." required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="email" type="text" placeholder="Email Address" required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="address" type="textarea" placeholder="Company Address"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="Sector(s)"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}>
                <SelectSectorInput name="sector_list" type="checkbox" placeholder="Sector(s)" required vertical={3}
                                   className="col-lg-12 form-control" onChange={this.form.onChange}
                                   values={this.state.lists.sector_list} returnValue/>
            </Row>
            <Row
                rendered
                idx={3}
                title="Register As Contractor"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <ClearableInput name="contractor_email" type="text" placeholder="Contractor Email Address"
                                desc="Used to link this company as a contractor of other companies when required."
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
}

export default NewDialog;
