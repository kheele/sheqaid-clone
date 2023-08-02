import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {ShouldUpdate} from "utils/Utils";
import {ClearableInput, ProfilePic, SelectSectorInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import {AEditDialog} from 'components/dialogs';
import style from "./EditDialog.lazy.css";
import updateClient from "mutations/all/Client/updateClient";

@observer
class EditDialog extends AEditDialog {
    pageKey = "Client";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Company";
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

    constructor(props) {
        super(props);

        this.onUploaded = this.onUploaded.bind(this);

        this.form = new Form();
    }

    onUploaded(path) {
        this.item.data.profile_pic = path;
    }

    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

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

        const {name, business_id, phone, email, contractor_email, address, profile_pic, sector_list} = form.data;
        const data = {};

        ShouldUpdate.check(data, old_data, name, 'name');
        ShouldUpdate.check(data, old_data, business_id, 'business_id');
        ShouldUpdate.check(data, old_data, phone, 'phone');
        ShouldUpdate.check(data, old_data, email, 'email');
        ShouldUpdate.check(data, old_data, contractor_email, 'contractor_email');
        ShouldUpdate.check(data, old_data, address, 'address');
        ShouldUpdate.checkFile(data, old_data, profile_pic, 'profile_pic');
        ShouldUpdate.checkBox(data, old_data, sector_list, 'sector_list');

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateClient({id: this.item.id, ...data}).then(res => {
            console.log("res", res)
            if(res === "DUP_CONTRACTOR_EMAIL") {
                infoDialog.open("Another company is already using the Contractor Email Address provided.");
            } else {
                onSaved && onSaved(data);
                storage.update.updateClient(this.item.id, data);

                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
                this.props.close();
            }
        }).finally(() => {
            btn.text("Save").enabled();
            progressDialog.close();
        });
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog, dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at, profile_pic, name, business_id, phone, email, contractor_email, address, sector_list
                }
            }
        } = this;

        const index = dialog.extraProp('index') || 1;

        return <FormControls onChange={this.form.onChange}>
            <Row
                active={index === 1}
                rendered
                idx={1}
                title="Company Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}>
                <ProfilePic name="profile_pic" path={this.path + "upload/profile-pic"} id={item.id}
                            profilePic={profile_pic} onUploaded={this.onUploaded}/>
                <ClearableInput name="name" type="text" placeholder="Company Name" defaultValue={name} required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="business_id" type="text" placeholder="Company Business ID"
                                defaultValue={business_id}
                                desc="This is required for COVID-19 data submission purposes. You will receive Business ID when registering your business for COVID-19 data submission on https://www.nioh.ac.za/ website"
                                required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="phone" type="text" placeholder="Contact No." defaultValue={phone} required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="email" type="text" placeholder="Email Address" defaultValue={email} required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="address" type="textarea" placeholder="Company Address" defaultValue={address}
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="Sector(s)"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}>
                <SelectSectorInput name="sector_list" type="checkbox" placeholder="Sector(s)" defaultValue={sector_list}
                                vertical={3} className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.sector_list} returnValue/>
            </Row>
            <Row
                active={index === 3}
                rendered
                idx={3}
                title="Register As Contractor"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <ClearableInput name="contractor_email" type="text" placeholder="Contractor Email Address" defaultValue={contractor_email}
                                desc="Used to link this company as a contractor of other companies when required."
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
}

export default EditDialog;
