import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../utils/Form';

import {ClearableInput} from '../inputs';
import {ANewDialog} from './';

import style from "./SupportDialog.lazy.css";

@observer
class SupportDialog extends ANewDialog {
    pageKey = "SupportDialog";
    title = "Support";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "support/";

    @observable state = {
    };
    
    constructor() {
        super();
        
        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('fname')) {
            infoDialog.open('First Name is required');
            return;
        }
        if (!form.isValid('lname')) {
            infoDialog.open('Last Name is required');
            return;
        }
        if (!form.isValid('email')) {
            infoDialog.open('Email Address is required');
            return;
        }
        if (!form.isValid('message')) {
            infoDialog.open('Message is required');
            return;
        }

        const {fname, lname, email, message} = form.data;
        const data = {fname, lname, email, message};
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            infoDialog.open(<React.Fragment>
                        <p>Message successfully sent!</p> 
                        <p>We will get back to you as soon as possible.</p>    
                    </React.Fragment>);
                infoDialog.close(5000);
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
   
    render() {
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="fname" type="text" placeholder="First Name" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="lname" type="text" placeholder="Last Name" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="email" type="email" placeholder="Email Address" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="message" type="textarea" placeholder="Message" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default SupportDialog;
