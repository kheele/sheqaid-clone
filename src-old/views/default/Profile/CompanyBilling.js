import React from "react";
import {findDOMNode} from 'react-dom';
import {observer} from 'mobx-react';
import {extendObservable} from 'mobx';

import Form from '../../../utils/Form';

import style from "./CompanyBilling.lazy.css";

@observer
class CompanyBilling extends React.Component {

    constructor() {
        super();

        this.onEdit = this.onEdit.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        
        this.onUploaded = this.onUploaded.bind(this);
        
        this.form = new Form();
    }

    componentDidMount() {
        style.use();
        setTimeout(function () {
            $(findDOMNode(this)).showScrollbars(0.8, "rgb(2,168,168)");
        }.bind(this), 0);
    }

    componentWillUnmount() {
        style.unuse();
        $(findDOMNode(this)).removeScrollbars();
    }
    
    onEdit(e, btn) {
        if (btn.text().contains('Edit')) {
            Object.values(this.refs).forEach(input => {
                input.setEditable(true);
            });
            btn.text('Save');
        } else {
            this.onSubmit(e, btn);
        }
    }

    onSubmit(e, btn) {
        const {form} = this;

        if (!form.isValid('company_name')) {
            infoDialog.open('Company Name is required');
            return;
        }
        if (!form.isValid('company_email')) {
            infoDialog.open('Company Email Address is required');
            return;
        }
        if (!form.isValid('company_phone')) {
            infoDialog.open('Company Phone Number is required');
            return;
        }
        if (!form.isValid('country')) {
            infoDialog.open('Country is required');
            return;
        }
        if (!form.isValid('city')) {
            infoDialog.open('City is required');
            return;
        }

        const {company_name, company_owner, company_owner_email, company_address, company_phone, company_email, country, city} = form.data;
        const data = {};
        if (company_name) {
            data.company_name = company_name;
        }
        if (company_phone) {
            data.company_phone = company_phone;
        }
        if (company_email) {
            data.company_email = company_email;
        }
        if (country) {
            data.country = country;
        }
        if (city) {
            data.city = city;
        }
        
        if (company_owner) {
            data.company.company_owner = company_owner;
        }
        if (company_owner_email) {
            data.company.company_owner_email = company_owner_email;
        }
        if (company_address) {
            data.company.company_address = company_address;
        }
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit("users/update/profile/company", data).then(res => {
            btn.text("Edit Profile").enabled();
            Object.values(this.refs).forEach(input => {
                input.setEditable(false);
            });
            console.log("res", res)
            extendObservable(storage.loggedUser.company.data, data);
            storage.update.updateDBUser(storage.loggedUser);
            infoDialog.open("Record successfully updated.");
            setTimeout(function () {
                infoDialog.close();
            }.bind(this), 2000);
        }).catch(e => {
            btn.text("Save").enabled();
        });
    }
    
    onUploaded(path) {
        storage.loggedUser.company.data.profile_pic = path;
        storage.update.updateDBUser(storage.loggedUser);
    }

    render() {
        const {id, data: {company_name, company_owner, company_owner_email, company_address, company_phone, company_email, country, city}} = storage.loggedUser.company;
        console.log(storage.loggedUser.company)
        return null;/*
        return <div className="CompanyBilling col-lg-6 pull-right">
            <h3>
                Billing Info 
                <Button className="btn btn-primary pull-right" onClick={this.onEdit}>Edit Billing</Button>
            </h3>
            <div className="nice-scrollbars">
                <div className="controls-wrapper">
                    <div className="controls">
                        <div className="row sec-group">   
                            <ProfileField ref="company_name" name="company_name" type="text" placeholder="Company Name" value={company_name} required className="col-lg-12" onChange={this.form.onChange}/>
                            <ProfileField ref="company_owner" name="company_owner" type="text" placeholder="Company Owner" value={company_owner} required onChange={this.form.onChange}/>
                            <ProfileField ref="company_owner_email" name="company_owner_email" type="email" placeholder="Company Owner Email Address" value={company_owner_email} required className="pull-right" onChange={this.form.onChange}/>
                        </div>
                        <div className="row sec-group">   
                            <ProfileField ref="company_address" name="company_address" type="text" placeholder="Company Address" value={company_address} required className="col-lg-12" onChange={this.form.onChange}/>
                            <ProfileField ref="company_email" name="company_email" type="email" placeholder="Company Email Address" value={company_email} required onChange={this.form.onChange}/>
                            <ProfileField ref="company_phone" name="company_phone" type="text" placeholder="Company Phone Number" value={company_phone} required className="pull-right" onChange={this.form.onChange}/>
                        </div>
                        <div className="row sec-group">   
                            <ProfileField ref="country" name="country" type="select" placeholder="Country" value={country} required onChange={this.form.onChange} returnValue values={storage.list.countryNames}/>
                            <ProfileField ref="city" name="city" type="text" placeholder="City" value={city} required className="pull-right" onChange={this.form.onChange}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>;*/
    }
}

export default CompanyBilling;
//402, 328