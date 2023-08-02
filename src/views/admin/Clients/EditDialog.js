import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {ClearableInput, ProfilePic} from 'components/inputs';

import {AEditDialog} from 'components/dialogs';
import style from "./EditDialog.lazy.css";

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
        
        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            onSaved && onSaved(data);
            storage.update.updateClient(this.item.id, data);
            
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close(); 
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
  
    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog: {renderProfileCover}},
             item, item: {
                id, data: {
                    created_at, profile_pic, name, business_id, phone, email
                }
            }
        } = this;
        
        console.log(this.item)
        
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group margin-t-10 padding-b-10">
                        <ProfilePic path={this.path + "upload/profile-pic"} id={item.id} profilePic={profile_pic} onUploaded={this.onUploaded}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="name" type="text" placeholder="Company Name" defaultValue={name} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="business_id" type="text" placeholder="Company Business ID" defaultValue={business_id} desc="This is required for COVID-19 data submission purposes. You will receive Business ID when registering your business for COVID-19 data submission on https://www.nioh.ac.za/ website" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="phone" type="text" placeholder="Contact No." defaultValue={phone} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="email" type="text" placeholder="Email Address" defaultValue={email} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default EditDialog;
