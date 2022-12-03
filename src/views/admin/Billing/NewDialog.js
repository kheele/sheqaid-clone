import React from "react";
import {observer} from 'mobx-react';

import Form from '../../../utils/Form';

import {ClearableInput, ProfilePic} from '../../../components/inputs';
import {ANewDialog} from '../../../components/dialogs';

import style from "./NewDialog.lazy.css";

@observer
class NewDialog extends ANewDialog {
    pageKey = "Client";
    title = "Create Company";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/clients/";

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

        const {name, business_id, phone, email, profile_pic} = form.data;
        const data = {name};
        if(business_id) {
            data.business_id = business_id;
        }
        if(phone) {
            data.phone = phone;
        }
        if(email) {
            data.email = email;
        }
        if(profile_pic) {
            data.profile_pic = profile_pic.path;
        }
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            storage.load.loadClients(true);
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    render() {
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group margin-t-10 padding-b-10">
                        <ProfilePic name="profile_pic" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="name" type="text" placeholder="Company Name" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="business_id" type="text" placeholder="Company Business ID" desc="This is required for COVID-19 data submission purposes. You will receive Business ID when registering your business for COVID-19 data submission on https://www.nioh.ac.za/ website" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="phone" type="text" placeholder="Contact No." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="email" type="text" placeholder="Email Address" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default NewDialog;
