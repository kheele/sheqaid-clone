import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../utils/Form';

import {Button, ClearableInput, SelectJobPositionInput} from '../inputs';

import ANewDialog from './ANewDialog';

import style from "./CustomPersonalInfoDialog.lazy.css";

@observer
class CustomPersonalInfoDialog extends ANewDialog {
    pageKey = "CustomPersonalInfoDialog";
    title = "Add Personal Details";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }

    get topButtons() {
        return <React.Fragment>
            <Button className="btn btn-primary cancel" onClick={this.onCancel}>Cancel</Button>
            <Button className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>Done
            </Button>
        </React.Fragment>;
    }
}

@observer
class Controls extends React.Component {

    @observable
    state = {
    };

    constructor() {
        super();

        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;
        if(!form.isValid('fname')) {
            infoDialog.open('First Name is required');
            return;
        }
        if(!form.isValid('lname')) {
            infoDialog.open('Last Name is required');
            return;
        }

        const {
            fname, lname, id_num, passport_num, email, job_position
        } = form.data;
        const data = {fname, lname};
        
        if(id_num) {
            data.id_num = id_num;
        }
        if(passport_num) {
            data.passport_num = passport_num;
        }
        if(email) {
            data.email = email;
        }
        if(job_position) {
            data.job_position = job_position;
        }
        
        console.log(data)

        onSaved && onSaved(data);
        infoDialog.open("Record successfully added.");
        infoDialog.close(1500);
        this.props.close();
    }
    
    get item() {
        return this.props.state.item || {};
    }

    render() {
        let {
            item, item: {
                fname, lname, id_num, passport_num, email
            }
        } = this;
        
//        console.log('item', item)
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10 padding-b-10">
                        <ClearableInput name="fname" type="text" placeholder="First Name" required defaultValue={fname} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="lname" type="text" placeholder="Last Name" required defaultValue={lname} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="id_num" type="text" placeholder="Identification No" required defaultValue={id_num} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="passport_num" type="text" placeholder="Passport No" required defaultValue={passport_num} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="email" type="email" placeholder="Email Address" required defaultValue={email} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectJobPositionInput name="job_position" placeholder="Job Position..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default CustomPersonalInfoDialog;
