import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../utils/Form';
import {Dates} from '../../../utils/Utils';
import {ClearableInput, ProfilePic} from '../../../components/inputs';

import {AEditDialog} from '../../../components/dialogs';
import style from "./EditPasswordDialog.lazy.css";

@observer
class EditDialog extends AEditDialog {
    pageKey = "EditPassword";
//    className = 'ANewTableFormDialog';
    
    topButtonsHiddenDelete = true;

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Password";
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "users/accounts/";
    @observable
    state = {
    };

    constructor(props) {
        super(props);
        
        this.form = new Form();
    }
    
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('password_old')) {
            infoDialog.open('Old Password is required');
            return;
        }
        if (!form.isValid('password')) {
            infoDialog.open('New Password is required');
            return;
        }
        if (!form.isValid('password_conf')) {
            infoDialog.open('Password Confirmation is required');
            return;
        }
        
        const {password_old, password, password_conf} = form.data;
        if(password_old !== this.item.data.password) {
            infoDialog.open('Old Password is incorrect');
            return;
        }
        if(password !== password_conf) {
            infoDialog.open('New Password and Password Confirmation DO NOT MATCH');
            return;
        }
        
        console.log(password)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "change-pass", password).then(newPassword => {
            console.log("res", newPassword)
            if(newPassword === password) {
                onSaved && onSaved(password);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
                this.props.close(); 
            } else {
                infoDialog.open("An error occurred. Please try again.");
                infoDialog.close(2000);
            }
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
                id, data: {created_at, fname, lname, phone, username, password, user_type, profile_pic, permissions_modules, permissions_other}
            }
        } = this;
        
        console.log(this.item)
        
        return (<div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <ProfilePic readonly profilePic={profile_pic}/>
                    <h3>{fname + ' ' + lname}</h3>
                    {created_at && <h5>{'Create On ' + Dates.formatDate(created_at)}</h5>}
                </React.Fragment>)}
                <div className="row">
                    <div className="row sec-group padding-10 padding-t-5">
                        <ClearableInput name="password_old" type="password" placeholder="Old Password" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group padding-10 padding-t-5">
                        <ClearableInput name="password" type="password" placeholder="New Password" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="password_conf" type="password" placeholder="Password Confirmation" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default EditDialog;
