// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {autorun, computed, observable, toJS} from 'mobx';

import Form from '../../../../utils/Form';
import {onChangeUsername, onSendOTPContractor} from '../../../../utils/UsersFuns';

import {debounce, execWhen} from '../../../../utils/Utils';
import {Button, ClearableInput, Clickable, ProfileField, UsernameStatus} from '../../../../components/inputs';
import {Row} from '../../../../components/FormComponents';

import UserDetails from "./UserDetails.js";

// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            auth_type: [{
                text: "Multi-Factor Authentication (Password)",
                value: "MultiFactor",
                checked: true
            }, {text: "Biometric Authentication (Face)", value: "Biometric", checked: false}],
            //
            receive_modules_notifs: [
                {
                    text: "Receive Contractor Management Notifications",
                    value: true,
                    checked: false
                },
                {
                    text: "Receive Asset Management Notifications",
                    value: true,
                    checked: false
                },
                {
                    text: "Receive Incident Management Notifications",
                    value: true,
                    checked: false
                },
                {
                    text: "Receive Chemicals Management Notifications",
                    value: true,
                    checked: false
                },
                {
                    text: "Receive Non-Conformance Management Notifications",
                    value: true,
                    checked: false
                }
            ],
            //
            receive_expired_docs_notifs: [{
                text: "Receive Expired Documents Notifications",
                value: true,
                checked: false
            }],
            //
        },
        employee: null,
        isNewContractorUserOTPStatus: 'NotSent',
        usernameStatus: {
            valid: false,
            required: true,
            exist: false,
            duplicate: false,
            uid: null,
            token: null,
            loading: false,
            username: null
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onSendOTP = this.onSendOTP.bind(this);

        this.onNext = this.onNext.bind(this);

        this.form = new Form();

        this.onSelectAllModulePermissions = this.onSelectAllModulePermissions.bind(this);
        this.onClearAllModulePermissions = this.onClearAllModulePermissions.bind(this);
        this.onSelectAllOtherPermissions = this.onSelectAllOtherPermissions.bind(this);
        this.onClearAllOtherPermissions = this.onClearAllOtherPermissions.bind(this);

        this.onChangeNames = this.onChangeNames.bind(this);

        this.onChangeUsernameStatus = this.onChangeUsernameStatus.bind(this);

        this.form.addChangeOne("username", debounce(onChangeUsername.call(this, "plugin_sheq_assist/contractors/users/")).bind(this));
        this.form.addChangeMany(["fname", "lname"], this.onChangeNames);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        autorun(() => {
            if (!this.isNewContractorUser) return;

            const {
                isNewContractorUserOTPStatusNotSent,
                isNewContractorUserOTPStatusSent,
                isNewContractorUserOTPStatusVerified
            } = this;

            const {dialog} = this.props;
            if (isNewContractorUserOTPStatusNotSent) {
                dialog.setTitle('Account Verification')
                    .hideSubmitBtn()
                    .addClass('AccountVerificationStep1');
                return;
            }
            if (isNewContractorUserOTPStatusSent) {
                dialog.setTitle('Account Verification')
                    .hideSubmitBtn()
                    .removeClass('AccountVerificationStep1')
                    .addClass('AccountVerificationStep2');
                return;
            }
            if (isNewContractorUserOTPStatusVerified) {
                dialog.setTitle('Account Setup')
                    .showSubmitBtn()
                    .removeClass('AccountVerificationStep1')
                    .removeClass('AccountVerificationStep2');
                return;
            }
        });
    }

    // </editor-fold>

    //<editor-fold desc="onChangeUsernameStatus">
    onChangeUsernameStatus(status) {
        const {dialog} = this.props;
        execWhen(() => /*this.refs.signup && */this.refs.usernameStatus && this.refs.userDetails).then(() => {
            const {/*signup, */usernameStatus, userDetails} = this.refs;
            const {cancel, submit} = dialog.refs;
            if (status.status === 'CONFIRMED' || (usernameStatus && usernameStatus.isAvailable)) {
                // signup.show();
                // alert(usernameStatus.isAvailable)
                if (usernameStatus.isAvailable) {
                    userDetails.showPasswords();
                    submit.show();
                } else {
                    submit.hide();
                }
            } else if(usernameStatus && usernameStatus.isRequired) {
                submit.show();
            } else {
                // signup.hide();
                submit.hide();
            }
        });
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="funs">
    onChangeNames(el, name, val) {
        const {
            profile_pic: ref_profile_pic,
            fname: ref_fname,
            lname: ref_lname,
            username: ref_username
        } = this.refs;
        if (isString(val) && !this.employeeTO) {
            console.log('onChangeNames', name, val)
            if (this.state.employee) {
                name !== 'fname' && ref_fname.reset();
                name !== 'lname' && ref_lname.reset();
                ref_username.reset();
            }
            this.state.employee = null;
        } else if (!this.employeeTO) {
            this.employeeTO = setTimeout(() => {
                clearTimeout(this.employeeTO);
                this.employeeTO = null;
            }, 500);

            this.state.employee = val;
            if (val) {
                const {
                    profile_pic,
                    fname,
                    lname,
                    id_num,
                    passport_num,
                    site,
                    project,
                    client,
                    access_type,
                    email
                } = val.data;
                profile_pic && ref_profile_pic.setValue(profile_pic);
                fname && ref_fname.onChange(fname);
                lname && ref_lname.onChange(lname);
                email && ref_username.onChange(email);
            } else {

            }
        }
    }

    onSelectAllModulePermissions() {
        const {refs: {modulePermissionsRef}} = this;
        modulePermissionsRef.selectAll();
    }

    onClearAllModulePermissions() {
        const {refs: {modulePermissionsRef}} = this;
        modulePermissionsRef.unselectAll();
    }

    onSelectAllOtherPermissions() {
        const {refs: {otherPermissionsRef}} = this;
        otherPermissionsRef.selectAll();
    }

    onClearAllOtherPermissions() {
        const {refs: {otherPermissionsRef}} = this;
        otherPermissionsRef.unselectAll();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSendOTP">
    onSendOTP(evt, btn) {
        onSendOTPContractor(this.contractor.id).then(res => {
            if (res) {
                this.state.isNewContractorUserOTPStatus = 'Sent';
            }
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form, isNewContractorUser} = this;
        const {idx} = btn.props;

        if (isNewContractorUser) {
            const {uid, token} = this.state.usernameStatus;
            if (idx === 1) {
                const {employee} = this.state;

                if (!form.isValid('username')) {
                    infoDialog.open('Username / Email Address is required');
                    return;
                } else if (!form.get('username').isEmailAddress()) {
                    infoDialog.open('Username / Email Address is not valid');
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
//                if (!form.isValid('auth_type')) {
//                    infoDialog.open('Authentication Type is required');
//                    return;
//                }
                }
            }
        } else {
            if (idx === 1) {
                const {employee} = this.state;

                if (!form.isValid('username')) {
                    infoDialog.open('Username / Email Address is required');
                    return;
                } else if (!form.get('username').isEmailAddress()) {
                    infoDialog.open('Username / Email Address is not valid');
                    return;
                }
//                if (!form.isValid('auth_type')) {
//                    infoDialog.open('Authentication Type is required');
//                    return;
//                }

                if (!employee && !form.isValid('fname')) {
                    infoDialog.open('First Name is required');
                    return;
                }
                if (!employee && !form.isValid('lname')) {
                    infoDialog.open('Last Name is required');
                    return;
                }
            }
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    async onSubmit(e, btn, onSaved) {
        const {form, isNewContractorUser, contractor} = this;
        const path = "plugin_sheq_assist/contractors/users/" + (storage.is.isContractor ? "create" : "signup");

        //2
        const {employee} = this.state;
        if (!form.isValid('username')) {
            infoDialog.open('Username / Email Address is required');
            return;
        } else if (!form.get('username').isEmailAddress()) {
            infoDialog.open('Username / Email Address is not valid');
            return;
        }
        if (!employee && !form.isValid('fname')) {
            infoDialog.open('First Name is required');
            return;
        }
        if (!employee && !form.isValid('lname')) {
            infoDialog.open('Last Name is required');
            return;
        }

        //3
        if (isNewContractorUser) {
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
//        if (!form.isValid('auth_type')) {
//            infoDialog.open('Authentication Type is required');
//            return;
//        }

        const {
            profile_pic,
            fname,
            lname,
            username,
            password,
            auth_type = 'MultiFactor',
            receive_modules_notifs,
            receive_expired_docs_notifs,
            site,
            project,
            client,
            permissions_modules,
            permissions_other
        } = form.data;
        const data = {
            fname, lname, username, auth_type
        };

        if (isNewContractorUser) {
            data.password = password;
        }

        //
        if(receive_modules_notifs) {
            data.receive_modules_notifs = toJS(receive_modules_notifs);
        }
        //
        if (receive_expired_docs_notifs) {
            data.receive_expired_docs_notifs = receive_expired_docs_notifs;
        } else {
            data.receive_expired_docs_notifs = false;
        }
        //

        if (employee) {
            data.linked_employee_id = employee.id;
            data.fname = employee.data.fname;
            data.lname = employee.data.lname;
        }
        if (profile_pic) {
            data.profile_pic = profile_pic.path ? profile_pic.path : profile_pic;
        }

        if (isNewContractorUser) {
            data.contractor = contractor;
            data.company = this.state.contractorCompany;
        } else {
            if (site) {
                if (site.id) {
                    const {id, data: _data, name} = site;
                    data.site = {id, name: name || _data.name};
                } else {
                    data.site = site;
                }
            }
            if (project) {
                if (project.id) {
                    const {id, data: _data, name} = project;
                    data.project = {id, name: name || _data.name};
                } else {
                    data.project = project;
                }
            }
            if (client) {
                if (client.id) {
                    const {id, data: _data, name} = client;
                    data.client = {id, name: name || _data.name};
                } else {
                    data.client = client;
                }
            }
        }

        if (permissions_modules) {
            data.permissions_modules = toJS(permissions_modules);
        }
        if (permissions_other) {
            data.permissions_other = toJS(permissions_other);
        }
        console.log(data)

        progressDialog.open();
//        btn.text("Saving...").disabled();
        neonBinding.events.emit(path, data).then(res => {
            console.log("res", res)
            if (res === "EMAIL_DUP") {
                infoDialog.open("A User with this email address already exist.");
            } else {
                if (isNewContractorUser) {
                    return neonBinding.events.emit('plugin_sheq_assist/contractors/users/relogin', res.user.id).then(res => {
                        if (!res) {
                            infoDialog.open("Authentication failed.");
                        } else if (isString(res)) {
                            switch (res) {
                                case "auth/too-many-requests":
                                    infoDialog.open(<div>
                                        Access to this account has been<br/>
                                        temporarily disabled due to many<br/>
                                        failed login attempts.<br/><br/>
                                        You can immediately restore it by<br/>
                                        resetting your password or you<br/>
                                        can try again later.
                                    </div>);
                                    break;
                                case "auth/network-request-failed":
                                    infoDialog.open(<div className="text-left">
                                        1. You currently do not have internet access or;<br/>
                                        2. Your internet connection is too slow<br/><br/>
                                        Please try again when you have stronger connection.
                                    </div>);
                                    break;
                                case "NO_USER_AUTH":
                                    infoDialog.open(<div>
                                        Sorry, the user associated with this<br/>
                                        <b>Email Address</b> or <b>Phone Number</b> does not exist.
                                    </div>);
                                    break;
                                case "NO_USER_DB":
                                    infoDialog.open(<div>
                                        Sorry, the user associated with this<br/>
                                        <b>Email Address</b> or <b>Phone Number</b> does not exist.<br/><br/>
                                        The user could have been deleted from the system.
                                    </div>);
                                    break;
                                case "ERR_CREATING_TOKEN":
                                default:
                                    infoDialog.open(<div>
                                        Sorry, we couldn't verify you at the moment.<br/>
                                        Please try again later.<br/>
                                        If the issue persists, please contact support.
                                    </div>);
                                    break;
                            }
                        } else if (isObject(res)) {
                            const {loggedUserAuth: currentUser} = storage;
                            if (currentUser) {
                                const {user: {data: {auth_type = "MultiFactor", has_biometric}}} = res;

                                infoDialog.open(<div>
                                    Your account was successfully set up
                                    <p className="margin-t-10">
                                        Please go to <b>
                                        <Clickable loggedUser={res} onClick={() => infoDialog.close()}>
                                            <a href="#">Log in</a>
                                        </Clickable>
                                    </b>
                                    </p>
                                </div>).then(() => this.props.close());
                            } else {
                                infoDialog.open("Authentication failed.");
                            }
                        }
                    });
                } else {
                    onSaved && onSaved(res);
                    infoDialog.open("Record successfully saved.");
                    infoDialog.close(2000);
                    this.props.close();
                }
            }
        }).finally(() => {
//            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }

    // </editor-fold>

    //<editor-fold desc="computeds">
    @computed
    get isNewContractorUserOTPStatusNotSent() {
        const {isNewContractorUserOTPStatus} = this.state;
        return this.isNewContractorUser && isNewContractorUserOTPStatus === 'NotSent';
    }

    @computed
    get isNewContractorUserOTPStatusSent() {
        const {isNewContractorUserOTPStatus} = this.state;
        return this.isNewContractorUser && isNewContractorUserOTPStatus === 'Sent';
    }

    @computed
    get isNewContractorUserOTPStatusVerified() {
        const {isNewContractorUserOTPStatus} = this.state;
        return this.isNewContractorUser && isNewContractorUserOTPStatus === 'Verified';
    }

    @computed
    get isShowNewForm() {
        const {isNewContractorUserOTPStatusVerified} = this;
        return !this.isNewContractorUser || isNewContractorUserOTPStatusVerified;
    }
    //</editor-fold>

    get isNewContractorUser() {
        const {props: {dialog: {props: {isNewContractorUser}}}} = this;
        return isNewContractorUser;
    }

    get contractor() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        const {
            isNewContractorUserOTPStatusNotSent, isNewContractorUserOTPStatusSent, isShowNewForm,
            isNewContractorUser, contractor = {}
        } = this;
        const {data = {}} = contractor || {};
        const {name: contractorName, client, project} = data;

        const {isConsultant, isContractor} = storage.is;

        const {usernameStatus} = this.state;

        let idx = 0;
        return (<div className="controls-wrapper controls-sectioned">
            <IsNewContractorUserOTPStatusNotSent show={isNewContractorUserOTPStatusNotSent} onSendOTP={this.onSendOTP}/>
            <IsNewContractorUserOTPStatusSent state={this.state} contractor={this.contractor}
                                              show={isNewContractorUserOTPStatusSent} onSendOTP={this.onSendOTP}/>
            {isShowNewForm && <div className="controls">
                <Row
                    active
                    rendered
                    idx={idx += 0.1}
                    title="My Contractor Details"
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                >
                    <ProfileField title="Contractor Name" value={contractorName} className="col-lg-12"/>
                </Row>
                {isContractor && <Row
                    rendered
                    idx={idx += 0.1}
                    title="Company Details"
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                    onFormBack={onFormBack}
                >
                    <ProfileField title="Company" value={client} renderer={v => v.name || v.data.name}
                                  className="col-lg-12"/>
                    <ProfileField title="Project" value={project} renderer={v => v.name || v.data.name}
                                  className="col-lg-12"/>
                </Row>}
                <Row
                    rendered
                    idx={idx += isNewContractorUser ? 0.9 : 0.8}
                    title={idx + ". User Details"}
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                    onFormBack={onFormBack}
                >
                    <ClearableInput ref="username" name="username" type="email" placeholder="Username / Email Address"
                                    required className="col-lg-12 z-index-2 form-control" onChange={this.form.onChange}/>
                    <UsernameStatus ref="usernameStatus" usernameStatus={usernameStatus}
                                    access_type="ContractorUser"
                                    onChange={this.onChangeUsernameStatus}/>
                    <UserDetails ref="userDetails" usernameStatus={usernameStatus}
                                 isNewContractorUser={isNewContractorUser} onChange={this.form.onChange}/>
                    <ClearableInput name="auth_type" type="radio" placeholder="Authentication Type" required vertical
                                    className="col-lg-12 form-control" onChange={this.form.onChange}
                                    values={this.state.lists.auth_type}/>
                </Row>
                <Row
                    rendered
                    idx={idx += 1}
                    title={idx + ". Notifications Settings"}
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                >
                    <ClearableInput name="receive_modules_notifs" type="checkbox" required
                                    className="col-lg-12 form-control margin-b-10" vertical onChange={this.form.onChange}
                                    values={this.state.lists.receive_modules_notifs}/>
                                    
                    <hr className="margin-v-10"/>
                    
                    <ClearableInput name="receive_expired_docs_notifs" type="checkbox" required
                                    className="col-lg-12 form-control margin-b-10" onChange={this.form.onChange}
                                    values={this.state.lists.receive_expired_docs_notifs} returnValue/>
                </Row>
            </div>}
        </div>);
    }

    // </editor-fold>
}

//<editor-fold desc="IsNewContractorUserOTPStatusNotSent">
@observer
class IsNewContractorUserOTPStatusNotSent extends React.Component {

    render() {
        const {show, onSendOTP} = this.props;
        if (!show) return null;

        return <div className="controls">
            <Row
                activeAlways
                rendered
                idx={1}
                title="Account Verification"
            >
                <p className="text-center margin-t-10 margin-b-10 font-size-16">In order to verify your account:</p>
                <p className="text-center margin-t-10 margin-b-10 font-size-16">Click "Send OTP" button below</p>
                <p className="text-center margin-t-10 margin-b-10 font-size-16">You will receive verification One-Time
                    Password on your email address</p>
                <p className="text-center margin-t-10 margin-b-10 font-size-16">Copy the One-Time Password and use it on
                    the next step provided</p>
                <hr className="pull-left margin-t-0 margin-b-20"/>
                <Button className="btn btn-primary hor-center w-200 border-radius-20 padding-5 margin-t-10 margin-b-5"
                        text="Send OTP" onClick={onSendOTP}/>
            </Row>
        </div>;
    }
}

//</editor-fold>

//<editor-fold desc="IsNewContractorUserOTPStatusSent">
@observer
class IsNewContractorUserOTPStatusSent extends React.Component {
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onVerifyOTP = this.onVerifyOTP.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onVerifyOTP">
    onVerifyOTP(evt, btn) {
        const {form} = this;

        if (!form.isValid('code')) {
            infoDialog.open('One-Time Password is required');
            return;
        }

        const {contractor, state} = this.props;

        const {code} = form.data;
        const data = {uid: contractor.id, code};

        progressDialog.open();

        neonBinding.events.emit('plugin_sheq_assist/contractors/verify/otp', data).then(res => {
            console.log("res", res)
            if (!res) {
                infoDialog.open(<div>
                    Sorry, we couldn't verify your One-Time Password at the moment.<br/>
                    Please try again later.<br/>
                    If the issue persists, please contact support.
                </div>);
            } else if (res === 'NO_USER_AUTH') {
                infoDialog.open(<div>
                    Sorry, the contractor associated with this<br/>
                    <b>Email Address</b> or <b>Phone Number</b> does not exist.
                </div>);
            } else if (res === 'NO_USER_DB') {
                infoDialog.open(<div>
                    Sorry, the contractor associated with this<br/>
                    <b>Email Address</b> or <b>Phone Number</b> does not exist.<br/><br/>
                    The user could have been deleted from the system.
                </div>);
            } else if (res === 'NO_OTP_MATCH') {
                infoDialog.open(<div>
                    Your One-Time Password does not match.<br/>
                    Please try again
                </div>);
            } else if (res === 'ERR_UPDATE_USER') {
                infoDialog.open(<div>
                    Sorry, we couldn't verify your One-Time Password at the moment.<br/>
                    Please try again later.<br/>
                    If the issue persists, please contact support.
                </div>);
            } else if (res === 'ERR_CREATING_TOKEN') {
                infoDialog.open(<div>
                    Sorry, we couldn't verify your One-Time Password at the moment.<br/>
                    Please try again later.<br/>
                    If the issue persists, please contact support.
                </div>);
            } else {
                state.contractorCompany = res.company;
                state.isNewContractorUserOTPStatus = 'Verified';
            }
        }).catch(err => {
            infoDialog.open(<div>
                Sorry, we couldn't verify your One-Time Password at the moment.<br/>
                Please try again later.<br/>
                If the issue persists, please contact support.
            </div>);
        }).finally(() => {
            setTimeout(() => progressDialog.close());
        });
    }

    // </editor-fold>

    render() {
        const {show, onSendOTP} = this.props;
        if (!show) return null;

        return <div className="controls">
            <Row
                activeAlways
                rendered
                idx={1}
                title="Account Verification"
            >
                <ClearableInput name="code" type="password" placeholder="One-Time Password"
                                className="hor-center form-control" onChange={this.form.onChange}/>
                <Button className="btn btn-primary hor-center w-200 border-radius-20 padding-5 margin-t-10 margin-b-5"
                        text="Verify OTP" onClick={this.onVerifyOTP}/>
                <hr className="pull-left margin-t-0 margin-b-20"/>
                <Button className="btn btn-primary hor-center w-200 border-radius-20 padding-5 margin-t-10 margin-b-5"
                        text="Re-Send OTP" onClick={onSendOTP}/>
            </Row>
        </div>;
    }
}

//</editor-fold>

export default Controls;