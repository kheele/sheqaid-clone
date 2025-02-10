// <editor-fold defaultstate="collapsed" desc="imports">
import React from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {debounce, execWhen} from 'utils/Utils';
import {onChangeUsername} from 'utils/UsersFuns';
import {
	Button,
	ClearableInput,
	SelectCityInput,
	SelectCompanyCategoryInput,
	SelectCountryInput,
	SelectZoneInput,
	UsernameStatus
} from 'components/inputs';
import {signUp} from "mutations/signup";
import storage from "../../storage/Storage";

// </editor-fold>

@observer
class Signup extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        display: false,
        lists: {
            consultant: [
                {text: 'Yes', value: true, checked: false},
                {text: 'No', value: false, checked: false}
            ],
            //This is intentional.
            no_projects: [
                {text: 'No', value: true, checked: false},
                {text: 'Yes', value: false, checked: true}
            ],
            account_types: [
                {text: '30 Days Trial', value: 'Trial', checked: false},
                {text: 'Premium', value: 'Premium', checked: false}
            ]
        },
        account_type: null,
//        permissions_modules: [],
//        permissions_other: []
        usernameStatus: {
            valid: false,
            required: true,
            exist: false,
            duplicate: false,
            uid: null,
            customToken: null,
            loading: false,
            username: null
        }
    };
    index = 0;
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onChangeUsernameStatus = this.onChangeUsernameStatus.bind(this);

        this.onBack = this.onBack.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

//        const {selectedClientModules: {permissionsSelected: defaultList}} = storage.selected;
//        this.state.permissions_modules = defaultList;
//        this.state.permissions_other = [...defaultOtherPermissions.map(({key, desc, actions: {create, edit, view, remove, share}}) => {
//                return {key, desc, actions: {create: true, view: true, edit: true, remove: true, share: true}};
//            })];

        this.form = new Form();
        this.form.addChangeOne("username", debounce(onChangeUsername.call(this, 'User', () => this.refs.signup)).bind(this));
        this.form.addChangeOne("account_type", this.onChangeAccountType.bind(this));
        this.form.addChangeOne("consultant", this.onChangeConsultant.bind(this));
        this.form.addChangeOne("country", this.onChangeCountry.bind(this));
        this.form.addChangeOne("zone", this.onChangeZone.bind(this));
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="path">
    get path() {
        return "users/accounts/";
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        execWhen(() => this.refs.category).then(ref => {
            ref.hide();
        });

        // //manager.moduleListInstalledAll
        // const permissions_other_list = storage.list.permissionOtherKeys.map(key => {
        // 	return {key_id: key.id, actions: {create: true, edit: true, view: true, remove: true, share: true}};
        // });//{id, key: {id, value}, actions}
        // const permissions_module_list = moduleManager.moduleListInstalledAll.map(({id}) => {
        // 	return {module_id: id, actions: {create: true, view: true, edit: true, remove: true, share: true}};
        // });
        // console.log('permissions_other_list', permissions_other_list.slice());
        // console.log('permissions_module_list', permissions_module_list.slice());
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeAccountType">
    onChangeAccountType(el, val) {
        this.state.account_type = val;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeConsultant">
    onChangeConsultant(el, val) {
        execWhen(() => this.refs.category).then(ref => {
            if (val) {
                ref.hide();
            } else {
                ref.show();
            }
        });
    }

    //</editor-fold>

    //<editor-fold desc="onChangeUsernameStatus">
    onChangeUsernameStatus(status) {
        execWhen(() => this.refs.signup && this.refs.usernameStatus && this.refs.userDetails).then(() => {
            const {signup, usernameStatus, userDetails} = this.refs;
            if (status.status === 'CONFIRMED' || usernameStatus.isAvailable) {
                signup.show();
                //
                if (usernameStatus.isAvailable) {
                    userDetails.showPasswords();
                }
            } else {
                signup.hide();
            }
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeCountry">
    onChangeCountry(el, val) {
        execWhen(() => this.refs.zone).then(ref => {
            ref.country = val;
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeZone">
    onChangeZone(el, val) {
        execWhen(() => this.refs.city).then(ref => {
            ref.zone = val;
        });
    }

    // <editor-fold defaultstate="collapsed" desc="show, hide">
    show() {
        this.state.display = true;
    }

    // </editor-fold>

    hide() {
        this.form.reset();
//        if (this.index === 2) {
//            const el = $(findDOMNode(this)).parent();
//            el.hasClass('min-w-700') && el.addClass('min-w-460').removeClass('min-w-700');
//        }
        this.index = 0;
        this.state.display = false;
    }

    // <editor-fold defaultstate="collapsed" desc="next, prev">
    next() {
        if (this.index <= 3) {
            this.index++;
            this.activate();
        }
    }

    // </editor-fold>

    prev() {
        if (this.index >= 1) {
            this.index--;
            this.activate();
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="activate">
    activate() {
        const el = $('.controls-wrapper-signup .controls');
        el.children('.row.active').removeClass('active');
        const active = el.children('.row:nth-of-type(' + (this.index + 1) + ')').addClass('active');

        if (active.hasClass('row-company')) {
            active.children('.sec-group').height(active.parent() - 80);
        }

        const {signup, back} = this.refs;
        signup.text(this.index === 2 ? 'Submit' : 'Next');
        if (this.index > 0) {
            back.show();
        } else {
            back.hide();
            if (this.index === 0) {
                const {valid, required, duplicate, exist, uid, customToken, username} = this.state.usernameStatus;
                if (valid && (uid || (!duplicate && !exist))) {
                    signup.show();
                } else {
                    signup.hide();
                }
            }
        }
//        if(this.index !== 2) {
//            alert(this.index)
//            signup.show();
//        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onBack">
    onBack(e, btn) {
        this.prev();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    async onNext(evt, btn) {
        const {form} = this;

        const {index} = this;
//        console.log('index', index)
        if (index === 0) {
            const {uid, customToken} = this.state.usernameStatus;

            if (!form.isValid('username')) {
                infoDialog.open('Email Address is required');
                return;
            } else if (!form.get('username').isEmailAddress()) {
                infoDialog.open('Email Address is not valid');
                return;
            }
            if (!form.isValid('fname')) {
                infoDialog.open('First Name is required');
                return;
            }
            if (!form.isValid('lname')) {
                infoDialog.open('Last Name is required');
                return;
            }

            if (!uid) {
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
            }

            this.next();
        } else if (index === 1) {
            if (!form.isValid('account_type')) {
                infoDialog.open('Account Type is required');
                return;
            }
            this.next();
        } else if (index === 2) {
            if (!form.isValid('consultant')) {
                infoDialog.open('Check if you are a Consultant on not');
                return;
            }
            if (!form.isValid('name')) {
                infoDialog.open('Name is required');
                return;
            }
            if (form.get('consultant') === false && !form.isValid('category')) {
                infoDialog.open('Category is required');
                return;
            }
            if (!form.isValid('email')) {
                infoDialog.open('Email Address is required');
                return;
            } else if (!form.get('email').isEmailAddress()) {
                infoDialog.open('Email Address is not valid');
                return;
            }
            if (!form.isValid('phone')) {
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

            this.onSubmit(evt, btn);
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(evt, btn) {
        const {form} = this;

        const {uid, customToken, status} = this.state.usernameStatus;

        const {
            account_type,
            no_projects,
            fname, lname, phone, username, password,
            consultant, category, name, address, phone: company_phone, email, country, zone, city
        } = form.data;
        const data = {
            uid,
            customToken,
            fname,
            lname,
            username: username.toLowerCase(),
            phone,
            password,
            company: {
                data: {
                    account_type,
                    consultant,
                    no_projects,
                    name,
                    phone: company_phone,
                    email,
                    address,
                    category_id: category && category.id,
                    country_iso2: country && country.data.iso2,
                    zone_id: zone && zone.id,
                    city_id: city && city.id,
                }
            }
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        signUp(data).then(res => {
            auth.onAuthStateChanged(currentUser => {
                storage.onLogin(currentUser);
            });

            return execWhen(() => storage.loggedUserAuth).then(loggedUserAuth => loggedUserAuth.getIdTokenResult().then(idTokenResult => {
                storage.idTokenResult = idTokenResult;
                return res;
            }));
        }).then(res => {
            console.log("res", res)
            if (!res) {
                infoDialog.open("Sorry! The account couldn't be create. Please try again later.");
                return;
            }

            if (isString(res)) {
                switch (res) {
                    case 'EMAIL_DUP':
                        infoDialog.open("User with this email address already exist.");
                        break;
                    case 'PHONE_DUP':
                        infoDialog.open("User with this phone number already exist.");
                        break;
                    default:
                        infoDialog.open("Sorry! The account couldn't be create. Please try again later.");
                        break;
                }
            } else {
                const {loggedUser} = res;
                const {name, consultant} = loggedUser.company.data;
                infoDialog.open(<React.Fragment>
                    <p>Account successfully created!</p>
                    <p>Welcome to {name}, partner with SHEQ Aid.</p>
                    <hr/>
                    <p>You can start creating {consultant ? 'clients, ' : ''}projects and sites.</p>
                </React.Fragment>);

                storage.isAccountCreated = true;
                storage.login.loginUser(loggedUser);
            }
        }).finally(() => {
            btn.text("Sign Up").enabled();
            progressDialog.close();
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {
            display,
            usernameStatus,
            usernameStatus: {valid, required, duplicate, exist, uid, customToken, username}
        } = this.state;
        if (!display) {
            return null;
        }
        return <React.Fragment>
            <div className="controls-wrapper-layer"/>
            <div className="controls-wrapper controls-wrapper-signup min-w-475">
                <div className="controls scale-up-center signup">
                    <i className="fa fa-arrow-left pull-left" onClick={this.props.onBack}/>
                    <label>Create Account</label>
                    <div className="row active">
                        <label>User Details</label>
                        <div className="row sec-group">
                            <ClearableInput name="username" type="email" placeholder="Email Address / Username" required
                                            className="form-control" onChange={this.form.onChange}/>
                            <UsernameStatus ref="usernameStatus" usernameStatus={usernameStatus} access_type="User"
                                            onChange={this.onChangeUsernameStatus}/>
                            <UserDetails ref="userDetails" usernameStatus={usernameStatus}
                                         onChange={this.form.onChange}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="row sec-group">
                            <ClearableInput name="account_type" type="radio" placeholder="Account Type" vertical
                                            className="form-control" onChange={this.form.onChange}
                                            values={this.state.lists.account_types}/>
                            <ClearableInput ref="no_projects" name="no_projects" type="radio"
                                            placeholder="Has Projects?"
                                            vertical className="form-control" onChange={this.form.onChange}
                                            values={this.state.lists.no_projects}/>
                        </div>
                    </div>
                    <div className="row h-full-calc-subtract-80">
                        <label>Company Details</label>
                        <div className="row sec-group h-full-calc-subtract-40">
                            <ClearableInput ref="consultant" name="consultant" type="radio" placeholder="Consultant?"
                                            vertical className="form-control" onChange={this.form.onChange}
                                            values={this.state.lists.consultant}/>
                            <ClearableInput ref="name" name="name" type="text" placeholder="Name" required
                                            className="form-control" onChange={this.form.onChange}/>
                            <SelectCompanyCategoryInput ref="category" className="form-control"
                                                        onChange={this.form.onChange}/>
                            <ClearableInput ref="email" name="email" type="email" placeholder="Email Address" required
                                            className="form-control" onChange={this.form.onChange}/>
                            <ClearableInput ref="phone" name="phone" type="text" placeholder="Phone Number" required
                                            className="form-control" onChange={this.form.onChange}/>
                            <ClearableInput ref="address" name="address" type="text" placeholder="Address" required
                                            className="form-control" onChange={this.form.onChange}/>
                            <SelectCountryInput name="country" className="form-control" onChange={this.form.onChange}/>
                            <SelectZoneInput ref="zone" name="zone" className="form-control"
                                             onChange={this.form.onChange}/>
                            <SelectCityInput ref="city" name="city" className="form-control"
                                             onChange={this.form.onChange}/>
                        </div>
                    </div>
                    <Button ref="back" text="Back" className="btn btn-primary back pull-left" shouldRender={false}
                            onClick={this.onBack}/>
                    <Button ref="signup" text="Next" className="btn btn-primary save pull-right" shouldRender={false}
                            onClick={this.onNext}/>
                </div>
            </div>
        </React.Fragment>;
    }

    // </editor-fold>
}

//<editor-fold desc="UserDetails">
@observer
class UserDetails extends React.Component {

    showPasswords() {
        execWhen(() => this.refs.password).then(ref => ref.show());
        execWhen(() => this.refs.conf_password).then(ref => ref.show());
    }

    hidePasswords() {
        execWhen(() => this.refs.password).then(ref => ref.hide());
        execWhen(() => this.refs.conf_password).then(ref => ref.hide());
    }

    render() {
        const {usernameStatus: {valid, required, duplicate, exist, username, loading, uid}, onChange} = this.props;
        if (!(valid && (uid || (!duplicate && !exist))) || loading) {
            return null;
        }

        return <React.Fragment>
            <ClearableInput name="fname" type="text" placeholder="First Name" required
                            className="margin-t-20 form-control" onChange={onChange}/>
            <ClearableInput name="lname" type="text" placeholder="Last Name" required className="form-control"
                            onChange={onChange}/>
            <div className="clearfix"/>
            <ClearableInput name="phone" type="text" placeholder="Phone Number" required className="form-control"
                            onChange={onChange}/>
            <ClearableInput ref="password" name="password" type="password" placeholder="Password" rendered={false}
                            className="form-control" onChange={onChange}/>
            <ClearableInput ref="conf_password" name="conf_password" type="password" placeholder="Confirmation Password"
                            rendered={false} className="form-control" onChange={onChange}/>
        </React.Fragment>;
    }
}

//</editor-fold>

export default Signup;
