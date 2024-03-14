// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {autorun, computed, observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {onChangeUsername, onConfirmContractorOTP, onSendOTPContractor} from 'utils/UsersFuns';

import {debounce, execWhen} from 'utils/Utils';
import {Button, ClearableInput, Clickable, ProfileField, UsernameStatus} from 'components/inputs';
import {Row} from 'components/FormComponents';

import UserDetails from "./UserDetails.js";
import {NewSiteListTable} from "components/FormTableComponents";
import insertContractorUser from "../../../../mutations/all/ContractorUser/insertContractorUser";
import signUpContractorUser from "../../../../mutations/all/ContractorUser/signUpContractorUser";
import storage from "../../../../storage/Storage";

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
			receive_asset_management_notifs: [{
				text: "Receive Asset Management Notifications",
				value: true,
				checked: false
			}],
			receive_chemicals_management_notifs: [{
				text: "Receive Chemicals Management Notifications",
				value: true,
				checked: false
			}],
			receive_contractor_management_notifs: [{
				text: "Receive Contractor Management Notifications",
				value: true,
				checked: false
			}],
			receive_employees_expired_docs_medicals: [{
				text: "Receive Employees Expired Documents Notifications",
				value: true,
				checked: false
			}],
			receive_employees_profile_notifs: [{
				text: "Receive Employees Profile Notifications",
				value: true,
				checked: false
			}],
			receive_incident_management_notifs: [{
				text: "Receive Incident Management Notifications",
				value: true,
				checked: false
			}],
			receive_inspection_management_notifs: [{
				text: "Receive Inspection Management Notifications",
				value: true,
				checked: false
			}],
			receive_non_conformance_management_notifs: [{
				text: "Receive Non-Conformance Management Notifications",
				value: true,
				checked: false
			}],
			receive_training_management_notifs: [{
				text: "Receive Training Management Notifications",
				value: true,
				checked: false
			}],
			//
			receive_expired_docs_notifs: [{
				text: "Receive Expired Documents Notifications",
				value: true,
				checked: false
			}],
			//
		},
		employee: null,
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
		
		this.form.addChangeOne("username", debounce(onChangeUsername.call(this, "ContractorUser")).bind(this));
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
				//
				if (usernameStatus.isAvailable) {
					userDetails.showPasswords();
					submit.show();
				} else {
					submit.hide();
				}
			} else if (usernameStatus && usernameStatus.isRequired) {
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
			username: ref_username,
			userDetails: {
				refs: {
					fname: ref_fname,
					lname: ref_lname,
					profile_pic: ref_profile_pic,
				}
			},
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
				storage.setIsNewContractorUserOTPStatusSent();
			}
		});
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onNext">
	onNext(e, btn) {
		const {form, isNewContractorUser} = this;
		const {idx} = btn.props;
		
		if (isNewContractorUser) {
			const {uid, customToken} = this.state.usernameStatus;
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
		const fn = storage.is.isContractor ? insertContractorUser : signUpContractorUser;
		
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
			//
			receive_asset_management_notifs,
			receive_chemicals_management_notifs,
			receive_contractor_management_notifs,
			receive_employees_expired_docs_medicals,
			receive_employees_profile_notifs,
			receive_incident_management_notifs,
			receive_inspection_management_notifs,
			receive_non_conformance_management_notifs,
			receive_training_management_notifs,
			receive_expired_docs_notifs,
			//
			site,
			project,
			client,
		} = form.data;
		
		const data = {
			contractor_id: contractor && contractor.id,
			//
			fname: employee ? employee.data.fname : fname,
			lname: employee ? employee.data.lname : lname,
			username: username.toLowerCase(),
			auth_type,
			linked_employee_id: employee && employee.id,
			profile_pic: profile_pic && profile_pic.path,
			notifications_settings: {
				data: {
					receive_asset_management_notifs,
					receive_chemicals_management_notifs,
					receive_contractor_management_notifs,
					receive_employees_expired_docs_medicals,
					receive_employees_profile_notifs,
					receive_incident_management_notifs,
					receive_inspection_management_notifs,
					receive_non_conformance_management_notifs,
					receive_training_management_notifs,
					receive_expired_docs_notifs,
				}
			},
		};
		
		if (isNewContractorUser) {
			data.password = password;
			
			// const {data: {company, client, project}} = contractor;
			// data.company_id = company.id;
			// data.client_id = client && client.id;
			// data.project_id = project && project.id;
		} else {
			// data.client_id = client && client.id;
			// data.project_id = project && project.id;
			// data.site_id = site && site.id;
		}
		
		console.log(data)
		
		btn.text("Saving...").disabled();
		progressDialog.open();
		fn(data).then(res => {
			console.log("res", res)
			if (res === "EMAIL_DUP") {
				infoDialog.open("A User with this email address already exist.");
			} else {
				if (isNewContractorUser) {
					const {user: {data: {auth_id}}} = res.loggedUser;
					return neonBinding.events.emit('plugin_sheq_assist/contractors/users/relogin', auth_id).then(res => {
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
							alert(0)
							auth2.onAuthStateChanged(currentUser => {
								alert(1)
								storage.onLogin(currentUser);
							});
							
							alert(2)
							
							execWhen(() => storage.loggedUserAuth).then(loggedUserAuth => loggedUserAuth.getIdTokenResult().then(idTokenResult => {
								alert(3)
								storage.idTokenResult = idTokenResult;
								return res;
							})).then(() => {
								alert(4)
								const {loggedUserAuth: currentUser} = storage;
								if (currentUser) {
									infoDialog.open(<div>
										Your account was successfully set up
									</div>);
									
									this.props.close();
									
									storage.login.loginUser(res.loggedUser);
								} else {
									infoDialog.open("Authentication failed.");
								}
							});
						}
					});
				} else {
					onSaved && onSaved(res);
					infoDialog.open("Record successfully saved.");
					infoDialog.close(2000);
					this.props.close();
				}
			}
		}).catch(err => {
			btn.text("Save").enabled();
			setTimeout(() => progressDialog.close());
			console.error(err);
			infoDialog.open("An error occurred while creating the account. Please try again.");
		}).finally(() => {
//            btn.text("Save").enabled();
			setTimeout(() => progressDialog.close());
		});
	}
	
	// </editor-fold>
	
	//<editor-fold desc="computeds">
	@computed
	get isNewContractorUserOTPStatusNotSent() {
		return this.isNewContractorUser && storage.is.isNewContractorUserOTPStatusNotSent;
	}
	
	@computed
	get isNewContractorUserOTPStatusSent() {
		return this.isNewContractorUser && storage.is.isNewContractorUserOTPStatusSent;
	}
	
	@computed
	get isNewContractorUserOTPStatusVerified() {
		return this.isNewContractorUser && storage.is.isNewContractorUserOTPStatusVerified;
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
	
	@computed
	get hideNotificationSettings() {
		if(!this.isNewContractorUser) return false;
		return this.isNewContractorUserOTPStatusVerified && this.contractor.data.inc_contractor_pack === "No";
	}
	
	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		const {onFormNext, onFormBack, onFormOpen} = this.props;
		const {
			isNewContractorUserOTPStatusNotSent, isNewContractorUserOTPStatusSent, isShowNewForm,
			isNewContractorUser, contractor = {}
		} = this;
		const {data = {}} = contractor || {};
		const {name: contractorName, site_list, client, project} = data;
		
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
					title="Site(s) Details"
					onFormOpen={onFormOpen}
					onFormNext={onFormNext}
					onFormBack={onFormBack}
				>
					<NewSiteListTable name="site_list" defaultValue={site_list} readonly isContractor/>
					{/*<ProfileField title="Company" value={client} renderer={v => v.name || v.data.name}*/}
					{/*              className="col-lg-12"/>*/}
					{/*<ProfileField title="Project" value={project} renderer={v => v.name || v.data.name}*/}
					{/*              className="col-lg-12"/>*/}
				</Row>}
				<Row
					rendered
					idx={idx += isNewContractorUser ? 0.9 : 0.8}
					title={idx + ". User Details"}
					onFormOpen={onFormOpen}
					onFormNext={!this.hideNotificationSettings && onFormNext}
					onFormBack={onFormBack}
				>
					<ClearableInput ref="username" name="username" type="email" placeholder="Username / Email Address"
					                required className="col-lg-12 z-index-2 form-control"
					                onChange={this.form.onChange}/>
					<UsernameStatus ref="usernameStatus" usernameStatus={usernameStatus}
					                access_type="ContractorUser"
					                onChange={this.onChangeUsernameStatus}/>
					<UserDetails ref="userDetails" usernameStatus={usernameStatus}
					             isNewContractorUser={isNewContractorUser} onChange={this.form.onChange}/>
					<ClearableInput name="auth_type" type="radio" placeholder="Authentication Type" required vertical
					                className="col-lg-12 form-control" onChange={this.form.onChange}
					                values={this.state.lists.auth_type}/>
				</Row>
				{!this.hideNotificationSettings && <Row
					rendered
					idx={idx += 1}
					title={idx + ". Notifications Settings"}
					className="NotificationsSettings-row"
					onFormOpen={onFormOpen}
					onFormBack={onFormBack}
				>
					<ClearableInput name="receive_asset_management_notifs" type="checkbox"
					                className="col-lg-12 form-control margin-b-0" vertical onChange={this.form.onChange}
					                values={this.state.lists.receive_asset_management_notifs} returnValue/>
					<ClearableInput name="receive_chemicals_management_notifs" type="checkbox"
					                className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
					                onChange={this.form.onChange}
					                values={this.state.lists.receive_chemicals_management_notifs} returnValue/>
					<ClearableInput name="receive_contractor_management_notifs" type="checkbox"
					                className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
					                onChange={this.form.onChange}
					                values={this.state.lists.receive_contractor_management_notifs} returnValue/>
					<ClearableInput name="receive_employees_expired_docs_medicals" type="checkbox"
					                className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
					                onChange={this.form.onChange}
					                values={this.state.lists.receive_employees_expired_docs_medicals} returnValue/>
					<ClearableInput name="receive_employees_profile_notifs" type="checkbox"
					                className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
					                onChange={this.form.onChange}
					                values={this.state.lists.receive_employees_profile_notifs} returnValue/>
					<ClearableInput name="receive_incident_management_notifs" type="checkbox"
					                className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
					                onChange={this.form.onChange}
					                values={this.state.lists.receive_incident_management_notifs} returnValue/>
					<ClearableInput name="receive_inspection_management_notifs" type="checkbox"
					                className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
					                onChange={this.form.onChange}
					                values={this.state.lists.receive_inspection_management_notifs} returnValue/>
					<ClearableInput name="receive_non_conformance_management_notifs" type="checkbox"
					                className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
					                onChange={this.form.onChange}
					                values={this.state.lists.receive_non_conformance_management_notifs} returnValue/>
					<ClearableInput name="receive_training_management_notifs" type="checkbox"
					                className="col-lg-12 form-control margin-t-5 margin-b-10" vertical
					                onChange={this.form.onChange}
					                values={this.state.lists.receive_training_management_notifs} returnValue/>
					
					<hr className="margin-v-10"/>
					
					<ClearableInput name="receive_expired_docs_notifs" type="checkbox" required
					                className="col-lg-12 form-control margin-b-10" onChange={this.form.onChange}
					                values={this.state.lists.receive_expired_docs_notifs} returnValue/>
				</Row>}
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
		const data = {id: contractor.id, code};
		
		progressDialog.open();
		
		onConfirmContractorOTP(data).then(res => {
			if (res && res.data) {
				storage.setIsNewContractorUserOTPStatusVerified();
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
