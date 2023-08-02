// <editor-fold defaultstate="collapsed" desc="imports">
import React from 'react';
import {findDOMNode} from 'react-dom';
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from '../../utils/Form';
import {execWhen} from '../../utils/Utils';
import {Button, ClearableInput} from '../../components/inputs';
import {PaymentForm} from '../../components/FormComponents';
//import StripeForm from '../../components/stripe/StripeForm';
// </editor-fold>

@observer
class Signup extends React.Component {
    path = "users/accounts/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        display: false,
        lists:{
            company_category: ['Banking', 'Construction', 'Education', 'Finacial', 'Forestry', 'Health', 'Law', 'Marketing', 'Mining', 'Technology', 'Transportation', 'Other'],
            consultant: [
                {text: 'Yes', value: true, checked: false},
                {text: 'No', value: false, checked: false}
            ],
            account_types: [
                {text: '30 Days Trial', value: 'Trial', checked: false},
                {text: 'Premium', value: 'Premium', checked: false}
            ],
            payment_intervals: [
                {text: 'Monthly', value: 'Monthly', checked: true},
                {text: 'Annually', value: 'Annually', checked: false}
            ],
        },
        account_type: null,
        permissions_modules: [],
        permissions_other: []
    };
    index = 0;
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onBack = this.onBack.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        
        const {selectedClientModules: {permissionsSelected: defaultList}} = storage.selected;
        this.state.permissions_modules = defaultList;
        this.state.permissions_other = [...defaultOtherPermissions.map(({key, desc, actions: {create, edit, view, remove, share}}) => {
                return {key, desc, actions: {create: true, view: true, edit: true, remove: true, share: true}};
            })];
        
        this.form = new Form();
        this.form.addChangeOne("account_type", this.onChangeAccountType.bind(this));
        this.form.addChangeOne("consultant", this.onChangeConsultant.bind(this));
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        execWhen(() => this.refs.company_category).then(company_category_ref => {
            const nodeJQ = $(company_category_ref.getDOMNode());
            nodeJQ.hide();
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChangeAccountType">
    onChangeAccountType(el, val) {
        this.state.account_type = val;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeConsultant">
    onChangeConsultant(el, val) {
        execWhen(() => this.refs.company_category).then(company_category_ref => {
            const nodeJQ = $(company_category_ref.getDOMNode());
            if(val) {
                nodeJQ.hide();
            } else {
                nodeJQ.show();
            }
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="show, hide">
    show() {
        this.state.display = true;
    }

    hide() {
        this.form.reset();
//        if (this.index === 2) {
//            const el = $(findDOMNode(this)).parent();
//            el.hasClass('min-w-700') && el.addClass('min-w-460').removeClass('min-w-700');
//        }
        this.index = 0;
        this.state.display = false;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="next, prev">
    next() {
        if (this.index <= 3) {
            this.index++;
            this.activate();
        }
    }

    prev() {
        if (this.index >= 1) {
            this.index--;
            this.activate();
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="activate">
    activate() {
        const el = $(findDOMNode(this));
        el.children('.row.active').removeClass('active');
        el.children('.row:nth-of-type(' + (this.index + 1) + ')').addClass('active');

        const {signup, back} = this.refs;
        signup.text(this.index === 2 ? 'Submit' : 'Next');
        if (this.index > 0) {
            back.show();
        }  else {
            back.hide();
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onBack">
    onBack(e, btn) {
        this.prev();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn) {
        const {form} = this;

        const {index} = this;
//        console.log('index', index)
        if (index === 0) {
            if (!form.isValid('account_type')) {
                infoDialog.open('Account Type is required');
                return;
            }
            this.next();
        } else if (index === 1) {
            if (!form.isValid('consultant')) {
                infoDialog.open('Check if you are a Consultant on not');
                return;
            }
            if (!form.isValid('company_name')) {
                infoDialog.open('Name is required');
                return;
            }
            if (form.get('consultant') === false && !form.isValid('company_category')) {
                infoDialog.open('Category is required');
                return;
            }
            if (!form.isValid('company_email')) {
                infoDialog.open('Email Address is required');
                return;
            } else if (!form.get('company_email').isEmailAddress()) {
                infoDialog.open('Email Address is not valid');
                return;
            }
            if (!form.isValid('company_phone')) {
                infoDialog.open('Phone Number is required');
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
            this.next();
        } else if (index === 2) {
            if (!form.isValid('fname')) {
                infoDialog.open('First Name is required');
                return;
            }
            if (!form.isValid('lname')) {
                infoDialog.open('Last Name is required');
                return;
            }
            if (!form.isValid('username')) {
                infoDialog.open('Email Address is required');
                return;
            } else if (!form.get('username').isEmailAddress()) {
                infoDialog.open('Email Address is not valid');
                return;
            }
            if (!form.isValid('password')) {
                infoDialog.open('Password is required');
                return;
            }
            if (form.get('password').length < 6) {
                infoDialog.open('Password must be a minimum of 6 characters');
                return;
            }
            if (!form.isValid('conf_password')) {
                infoDialog.open('Confirmation Password is required');
                return;
            }
            if (form.get('conf_password') !== form.get('password')) {
                infoDialog.open('Password and Confirmation Password do not match');
                return;
            }

            const {
                account_type,
                fname, lname, phone, username, password,
                consultant, company_category, company_name, company_address, company_phone, company_email, country, city
            } = form.data;
            const data = {
                user: {
                    fname, lname, username, password, 
                    permissions_modules: toJS(this.state.permissions_modules), 
                    permissions_other: toJS(this.state.permissions_other)
                },
                company: {account_type, consultant, company_category, company_name, company_phone, company_email, country, city}
            };
            if (phone) {
                data.user.phone = phone;
            }
            if (company_address) {
                data.company.company_address = company_address;
            }
            
            console.log(data)

            btn.text("Saving...").disabled();
            neonBinding.events.emit(this.path + "signup", data).then(res => {
                console.log("res", res)
                if (res === "EMAIL_DUP") {
                    infoDialog.open("User with this email address already exist.");
                } else {
                    storage.isAccountCreated = true;
                }
            }).finally(() => {
                btn.text("Sign Up").enabled();
            });
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return this.state.display && (<div className="controls scale-up-center signup">
            <i className="fa fa-arrow-left pull-left" onClick={this.props.onBack}/>
            <label>Create Account</label>
            <div className="row active">
                <div className="row sec-group">   
                    <ClearableInput name="account_type" type="radio" placeholder="Account Type" vertical className="form-control" onChange={this.form.onChange} values={this.state.lists.account_types}/>
                </div>
                {this.state.account_type === 'Premium' && <React.Fragment>
                    <label>Payment Details</label>
                    <div className="row sec-group">   
                        <ClearableInput name="payment_interval" type="radio" placeholder="Payment Interval" vertical className="form-control" onChange={this.form.onChange} values={this.state.lists.payment_intervals}/>
                        <PaymentForm name="account_type" className="col-lg-8 pull-left-2 form-control" onChange={this.form.onChange}/>
                    </div>
                </React.Fragment>}
            </div>
            <div className="row">
                <label>Company Details</label>
                <div className="row sec-group">   
                    <ClearableInput ref="consultant" name="consultant" type="radio" placeholder="Consultant?" vertical className="form-control" onChange={this.form.onChange} values={this.state.lists.consultant}/>
                    <ClearableInput ref="company_name" name="company_name" type="text" placeholder="Name" required className="form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="company_category" name="company_category" type="select" placeholder="Category..." className="form-control" onChange={this.form.onChange} values={this.state.lists.company_category} returnValue/>
                    <ClearableInput ref="company_email" name="company_email" type="email" placeholder="Email Address" required className="form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="company_phone" name="company_phone" type="text" placeholder="Phone Number" required className="form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="company_address" name="company_address" type="text" placeholder="Address" required className="form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="country" type="select" placeholder="Country..." required className="form-control" onChange={this.form.onChange} returnValue values={storage.list.countryNames}/>
                    <ClearableInput name="city" type="text" placeholder="City" required className="form-control" onChange={this.form.onChange}/>
                </div>
            </div>
            <div className="row">
                <label>User Details</label>
                <div className="row sec-group">   
                    <ClearableInput name="fname" type="text" placeholder="First Name" required className="form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="lname" type="text" placeholder="Last Name" required className="form-control" onChange={this.form.onChange}/>
                    <div className="clearfix"/>
                    <ClearableInput name="phone" type="text" placeholder="Phone Number" required className="form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="username" type="email" placeholder="Email Address" required className="form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="password" type="password" placeholder="Password" className="form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="conf_password" type="password" placeholder="Confirmation Password" className="form-control" onChange={this.form.onChange}/>
                </div>
            </div>
            <Button ref="back" text="Back" className="btn btn-primary back pull-left" shouldRender={false} onClick={this.onBack}/>
            <Button ref="signup" text="Next" className="btn btn-primary save pull-right" onClick={this.onSubmit}/>
        </div>);
    }
    // </editor-fold>
}

export default Signup;