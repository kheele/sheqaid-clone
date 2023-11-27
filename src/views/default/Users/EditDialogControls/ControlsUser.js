// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable, observable, toJS} from 'mobx';
import {isValidPhoneNumber, parsePhoneNumber} from 'libphonenumber-js';

import Form from 'utils/Form';
import {onChangeUsername} from 'utils/UsersFuns';

import {debounce, execWhen, ShouldUpdate} from 'utils/Utils';
import {
	Button,
	ClearableInput,
	ProfilePic,
	SelectClientInput,
	SelectCountryCodeInput,
	SelectProjectInput,
	SelectSiteInput
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import {
	NewUserModulePermissions,
	NewUserModulePermissionsByClaim, NewUserModulePermissionsByExtra,
	NewUserModulePermissionsByHR,
	NewUserModulePermissionsBySHEQ,
	NewUserOtherPermissions
} from 'components/common-modules/ANewUserPermissions';

import SetupPhoneNumDialog from 'components/dialogs/SetupPhoneNumDialog';

import EditPasswordDialog from "../EditPasswordDialog.js";
import NewClientListUpdateBlacklistTable
	from "components/FormTableComponents/NewClientListUpdateBlacklistTable";
import NewProjectListUpdateBlacklistTable
	from "components/FormTableComponents/NewProjectListUpdateBlacklistTable";
import NewSiteListUpdateBlacklistTable
	from "components/FormTableComponents/NewSiteListUpdateBlacklistTable";
import updateUserLocal from "./updateUser";
import {getPhoneNumberNew} from "utils/UtilsFuns";
import {CircularProgress} from "@mui/material";
import updateUser from "../../../../mutations/all/User/updateUser";
import updatePermissionAction from "../../../../mutations/all/PermissionAction/updatePermissionAction";
import insertPermissionAction from "../../../../mutations/all/PermissionAction/insertPermissionAction";
import insertPermissionModule from "../../../../mutations/all/PermissionModule/insertPermissionModule";
import updatePermissionOther from "../../../../mutations/all/PermissionOther/updatePermissionOther";
import insertPermissionOther from "../../../../mutations/all/PermissionOther/insertPermissionOther";
import updatePermissionModule from "../../../../mutations/all/PermissionModule/updatePermissionModule";

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
		usernameStatus: {
			valid: false,
			required: true,
			exist: false,
			duplicate: false,
			uid: null,
			token: null,
			loading: false,
			username: null
		},
		savingPermissions: [],
		item: null,
	};
	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);

		this.path = 'users/update/';

		this.onFormSave = this.onFormSave.bind(this);

		this.onSelectAllModulePermissions = this.onSelectAllModulePermissions.bind(this);
		this.onClearAllModulePermissions = this.onClearAllModulePermissions.bind(this);
		this.onSelectAllOtherPermissions = this.onSelectAllOtherPermissions.bind(this);
		this.onClearAllOtherPermissions = this.onClearAllOtherPermissions.bind(this);

		this.onUploaded = this.onUploaded.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);

		this.onChangeUsernameStatus = this.onChangeUsernameStatus.bind(this);

		this.updateUser = updateUser.bind(this);

		this.form = new Form();
		this.form.addChangeOne("username", debounce(onChangeUsername.call(this, "User")).bind(this));
		this.form.addChangeMany([
			"permissions_modules_sheq",
			"permissions_modules_hr",
			"permissions_modules_claims",
			"permissions_modules_extra",
			"permissions_other_list",
		], this.onChangePermissions.bind(this));
	}

	// </editor-fold>

	//<editor-fold desc="componentDidMount">
	componentDidMount() {
		const {forShouldSetupPermissions} = this.props;
		if (forShouldSetupPermissions) {
			this.onSelectAllModulePermissions();
			Promise.all(['NewUserModulePermissionsBySHEQ', 'NewUserModulePermissionsByHR', 'NewUserModulePermissionsByClaim', 'NewUserModulePermissionsByExtra'].map(ref => execWhen(() => this.refs[ref]).then(ref => {
				ref.selectAll();
			})));
			this.onSelectAllOtherPermissions();
		}
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

	//</editor-fold>

	//<editor-fold desc="onChangePermissionsModules">
	async onChangePermissions(el, name, val) {
		if (val) {
			let {
				item: {id: user_id, data: old_data, data: {permissions_other_list, permissions_module_list}}
			} = this;

			const {list, item, action, oldVal, newVal, onComplete} = val;

			// console.log('onChangePermissions', name, val)
			if (name === 'permissions_other_list') {
				//insertPermissionOther{id, actions, key, user, contractor_user},
				//updatePermissionOther{id, actions_id, key_id, user_id, contractor_user_id}
				let {id, key, actions} = item;
				if (id) {
					if (actions.id) {
						actions = await updatePermissionAction(actions);
					} else {
						actions = await insertPermissionAction(actions);
					}
					updatePermissionOther({id, actions_id: actions.id}).then(onComplete);
				} else {
					insertPermissionOther({
						actions: {data: actions},
						key_id: key.id,
						user_id,
						// contractor_user_id: ,
					}).then(onComplete);
				}
			} else {
				//insertPermissionModule{id, actions, module, user, contractor_user},
				//updatePermissionModule{id, actions_id, module_id, user_id, contractor_user_id}
				let {id, module, actions} = item;
				if (id) {
					if (actions.id) {
						// console.log(1)
						actions = await updatePermissionAction(actions);
					} else {
						// console.log(2)
						actions = await insertPermissionAction(actions);
					}
					updatePermissionModule({id, actions_id: actions.id}).then(onComplete);
				} else {
					// console.log(3)
					insertPermissionModule({
						actions: {data: actions},
						module_id: module.id,
						user_id,
						// contractor_user_id: ,
					}).then(onComplete);
				}
			}
		}

	}

	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="funs">
	onSelectAllModulePermissions(evt, btn) {
		const {actionRef} = btn.props;
		execWhen(() => this.refs[actionRef]).then(ref => {
			ref.selectAll();
		});
	}

	onClearAllModulePermissions(evt, btn) {
		const {actionRef} = btn.props;
		execWhen(() => this.refs[actionRef]).then(ref => {
			ref.unselectAll();
		});
	}

	onSelectAllOtherPermissions() {
		execWhen(() => this.refs.otherPermissionsRef).then(ref => {
			ref.selectAll();
		});
	}

	onClearAllOtherPermissions() {
		execWhen(() => this.refs.otherPermissionsRef).then(ref => {
			ref.unselectAll();
		});
	}

	onUploaded(path) {
		this.item.data.profile_pic = path;
		if (this.isLoggedUser) {
			const {user} = storage.loggedUser;
			user.data.profile_pic = path;
			storage.update.updateDBUser(storage.loggedUser);
		}
	}

	onChangePassword() {
		this.refs.editPasswordDialog.open(this.item).then(newPass => {
			this.item.data.password = newPass;
		});
	}

	// </editor-fold>

	//<editor-fold desc="onFormSave">
	async onFormSave(e, btn) {
		const {
			form,
			item: {id, data: old_data},
		} = this;
		const {shouldSetupPermissions, isNoProjects} = storage.is;

		const onSubmit = async (data, onSaved) => {
			if (Object.keys(data).isEmpty()) {
				infoDialog.open("Nothing changed!");
				return;
			}

			console.log(data)

			const btnText = btn.text();
			btn.text("Saving...").disabled();
			progressDialog.open();
			return updateUser({id: this.item.id, ...data}).then(res => {
				console.log("res", res)
				if (res === "EMAIL_DUP") {
					infoDialog.open("A User with this email address already exist.");
				} else if (res === "PHONE_DUP") {
					infoDialog.open("A User with this phone number address already exist.");
				} else {
					onSaved && onSaved(res);
					infoDialog.open("Record successfully updated.");
					infoDialog.close(2000);
					// this.props.close();
					return true;
				}
			}).finally(() => {
				btn.text(btnText).enabled();
				setTimeout(() => progressDialog.close());
			});
		};

		const {idx} = btn.props;
		if (idx === 'Orgs') {
			// const {isConsultant} = storage.is;
			// if (isConsultant && !form.isValid('client')) {
			//     infoDialog.open('Company is required');
			//     return;
			// }

			const {
				site, project, client,
			} = form.data;

			const data = {};
			ShouldUpdate.checkClient(data, old_data, client);
			ShouldUpdate.checkProject(data, old_data, project);
			ShouldUpdate.checkSite(data, old_data, site);

			return await onSubmit(data);
		}

		if (idx === 'BlacklistedCompanies') {
			//client_blacklist
		}

		if (idx === 'BlacklistedProjects') {
			//project_blacklist
		}

		if (idx === 'BlacklistedSites') {
			//site_blacklist
		}

		if (idx === 'UserDetails') {
			const {employee} = this.state;
			if (!employee && !form.isValid('fname')) {
				infoDialog.open('First Name is required');
				return;
			}
			if (!employee && !form.isValid('lname')) {
				infoDialog.open('Last Name is required');
				return;
			}

			if (this.isLoggedUser) {
				const data_test = {};
				ShouldUpdate.check(data_test, old_data, this.phoneNumberNew, 'phone');

				if (!Object.values(data_test).isEmpty()) {
					if (form.isValid('country') && !form.isValid('phone')) {
						infoDialog.open('Phone Number required');
						return;
					}
					if (!form.isValid('country') && form.isValid('phone')) {
						infoDialog.open('Phone Code required');
						return;
					}
					if (form.isValid('country') && form.isValid('phone')) {
						const isValid = isValidPhoneNumber(String(form.get('phone')), form.get('country').data.iso2);
						if (!isValid) {
							infoDialog.open('Phone Number is not valid');
							return;
						} else {
							const res = await this.refs.setupPhoneNumDialog.extraProp('isoCode', form.get('country').data.iso2).extraProp('phoneNumber', form.get('phone')).open(storage.loggedUser).then(res => {
								console.log('setupPhoneNumDialog res', res);
								return res;
							});
							if (!res) {
								return;
							}
						}
					}
				}
			}

			const {
				fname, lname,
			} = form.data;

			const data = {};
			ShouldUpdate.check(data, old_data, fname, 'fname');
			ShouldUpdate.check(data, old_data, lname, 'lname');

			return await onSubmit(data);
		}

		if (idx === 'LoginDetails') {
			if (!form.isValid('username')) {
				infoDialog.open('Email Address is required');
				return;
			} else if (!form.get('username').isEmailAddress()) {
				infoDialog.open('Email Address is not valid');
				return;
			}
			if (!form.isValid('auth_type')) {
				infoDialog.open('Authentication Type is required');
				return;
			}

			const {
				username, auth_type,
			} = form.data;
			const data = {};
			ShouldUpdate.check(data, old_data, username, 'username');
			ShouldUpdate.check(data, old_data, auth_type, 'auth_type');

			return await onSubmit(data);
		}

		if (idx === 'NotificationsSettings') {
			const {notifications_settings} = old_data;

			const {
				receive_asset_management_notifs,
				receive_chemicals_management_notifs,
				receive_contractor_management_notifs,
				receive_employees_expired_docs_medicals,
				receive_employees_profile_notifs,
				receive_incident_management_notifs,
				receive_non_conformance_management_notifs,
				receive_training_management_notifs,
				receive_expired_docs_notifs,
			} = form.data;
			let data = {};
			if (!notifications_settings) {
				data.notifications_settings = {
					data: {
						receive_asset_management_notifs,
						receive_chemicals_management_notifs,
						receive_contractor_management_notifs,
						receive_employees_expired_docs_medicals,
						receive_employees_profile_notifs,
						receive_incident_management_notifs,
						receive_non_conformance_management_notifs,
						receive_training_management_notifs,
						receive_expired_docs_notifs,
					}
				};
			} else {
				ShouldUpdate.checkBox(data, notifications_settings, receive_asset_management_notifs, 'receive_asset_management_notifs');
				ShouldUpdate.checkBox(data, notifications_settings, receive_chemicals_management_notifs, 'receive_chemicals_management_notifs');
				ShouldUpdate.checkBox(data, notifications_settings, receive_contractor_management_notifs, 'receive_contractor_management_notifs');
				ShouldUpdate.checkBox(data, notifications_settings, receive_employees_expired_docs_medicals, 'receive_employees_expired_docs_medicals');
				ShouldUpdate.checkBox(data, notifications_settings, receive_employees_profile_notifs, 'receive_employees_profile_notifs');
				ShouldUpdate.checkBox(data, notifications_settings, receive_incident_management_notifs, 'receive_incident_management_notifs');
				ShouldUpdate.checkBox(data, notifications_settings, receive_non_conformance_management_notifs, 'receive_non_conformance_management_notifs');
				ShouldUpdate.checkBox(data, notifications_settings, receive_training_management_notifs, 'receive_training_management_notifs');
				ShouldUpdate.checkBox(data, notifications_settings, receive_expired_docs_notifs, 'receive_expired_docs_notifs');

				if (Object.values(data).isNotEmpty()) {
					data = {
						notifications_settings: {
							...notifications_settings,
							...data,
						}
					};
				}
			}

			return await onSubmit(data);
		}

		switch (idx) {
			case 'SHEQManagementModulePermissions':
			case 'HRManagementModulePermissions':
			case 'ClaimManagementModulePermissions':
			case 'ExtraModulePermissions':
			case 'OtherPermissions':
				return true;
		}

		return true;
	}

	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	async onSubmit(e, btn, onSaved) {
		const {form, item: {data: old_data}} = this;
		const {shouldSetupPermissions} = storage.is;

		let phoneUpdated, passwordVerified, password_conf;
		if (!shouldSetupPermissions) {
			//2
			if (!form.isValid('fname')) {
				infoDialog.open('First Name is required');
				return;
			}
			if (!form.isValid('lname')) {
				infoDialog.open('Last Name is required');
				return;
			}
			if (this.isLoggedUser) {
				const data_test = {};
				ShouldUpdate.check(data_test, old_data, this.phoneNumberNew, 'phone');

				if (Object.values(data_test).isNotEmpty()) {
					if (form.isValid('country') && !form.isValid('phone')) {
						infoDialog.open('Phone Number required');
						return;
					}
					if (!form.isValid('country') && form.isValid('phone')) {
						infoDialog.open('Phone Code required');
						return;
					}
					if (form.isValid('country') && form.isValid('phone')) {
						const isValid = isValidPhoneNumber(String(form.get('phone')), form.get('country').data.iso2);
						if (!isValid) {
							infoDialog.open('Phone Number is not valid');
							return;
						} else {
							const text = await inputDialog.password().open("Enter Password");
							if (!text) {
								infoDialog.open('Password is required');
								return;
							}

							password_conf = text;
							passwordVerified = true;

							const res = await this.refs.setupPhoneNumDialog.extraProp('isoCode', form.get('country').data.iso2).extraProp('phoneNumber', form.get('phone')).open(storage.loggedUser).then(res => {
								console.log('setupPhoneNumDialog res', res);
								return res;
							});
							if (!res) {
								return;
							}
							phoneUpdated = res;
						}
					}
				}
			}

			//3
			if (!form.isValid('username')) {
				infoDialog.open('Email Address is required');
				return;
			} else if (!form.get('username').isEmailAddress()) {
				infoDialog.open('Email Address is not valid');
				return;
			}

			if (!form.isValid('auth_type')) {
				infoDialog.open('Authentication Type is required');
				return;
			}
		}

		const {
			fname,
			lname,
			phone,
			username,
			auth_type,
			receive_modules_notifs,
			receive_expired_docs_notifs,
			site,
			project,
			client,
			client_blacklist,
			project_blacklist,
			site_blacklist,
			permissions_modules_sheq,
			permissions_modules_hr,
			permissions_modules_claims,
			permissions_modules_extra,
			permissions_other_list
		} = form.data;
		const data = {};

		if (!shouldSetupPermissions) {
			ShouldUpdate.check(data, old_data, fname, 'fname');
			ShouldUpdate.check(data, old_data, lname, 'lname');
			if (this.isLoggedUser) {
				ShouldUpdate.check(data, old_data, this.phoneNumberNew, 'phone');
			}
			ShouldUpdate.check(data, old_data, username, 'username');
			ShouldUpdate.check(data, old_data, auth_type, 'auth_type');
		}

		//
		ShouldUpdate.checkBoxList(data, old_data, receive_modules_notifs, 'receive_modules_notifs');
		//
		ShouldUpdate.checkBox(data, old_data, receive_expired_docs_notifs, 'receive_expired_docs_notifs');
		//

		if (!shouldSetupPermissions) {
			ShouldUpdate.checkClient(data, old_data, client);
			ShouldUpdate.checkProject(data, old_data, project);
			ShouldUpdate.checkSite(data, old_data, site);

			ShouldUpdate.checkClientBlacklist(data, old_data, client_blacklist, 'client_blacklist');
			ShouldUpdate.checkProjectBlacklist(data, old_data, project_blacklist, 'project_blacklist');
			ShouldUpdate.checkSiteBlacklist(data, old_data, site_blacklist, 'site_blacklist');
		}

		const permissions_module_list = [
			...(permissions_modules_sheq || []),
			...(permissions_modules_hr || []),
			...(permissions_modules_claims || []),
			...(permissions_modules_extra || [])
		];
		console.log("checkListPermissionsModules", permissions_module_list)
		console.log("checkListPermissionsOther", permissions_other_list)
		ShouldUpdate.checkListPermissionsModules(data, old_data, permissions_module_list);
		ShouldUpdate.checkListPermissionsOther(data, old_data, permissions_other_list);

		if (password_conf) {
			data.password_conf = password_conf;
		}

		this.updateUser({
			btn, data, phoneUpdated, passwordVerified, shouldSetupPermissions, onSaved,
			client, project, site
		});
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="phoneNumberNew">
	get phoneNumberNew() {
		const {form} = this;
		let {country, phone} = form.data;
		return getPhoneNumberNew({country, phone});
	}

	// </editor-fold>

	//<editor-fold desc="phoneCode">
	get phoneCode() {
		let {phone} = this.item.data;
		if (phone && isValidPhoneNumber(phone)) {
			const phoneNumber = parsePhoneNumber(phone);
			if (phoneNumber) {
				return phoneNumber.country;
			}
		}
		return null;
	}

	//</editor-fold>

	//<editor-fold desc="phoneNumber">
	get phoneNumber() {
		let {phone} = this.item.data;
		if (phone && isValidPhoneNumber(phone)) {
			const phoneNumber = parsePhoneNumber(phone);
			if (phoneNumber) {
				return phoneNumber.nationalNumber;
			}
		}
		return null;
	}

	//</editor-fold>

	@computed get item() {
		return this.state.item;
	}

	get isLoggedUser() {
		const {user} = storage.loggedUser;
		return this.item.id === user.id;
	}

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		if (!this.item) {
			return <CircularProgress className="fixed-center"/>;
		}

		let {
			props: {
				onFormNext, onFormBack, onFormOpen,
				dialog: {renderProfileCover}
			},
			item, item: {
				id, data: {
					created_at,
					profile_pic,
					fname,
					lname,
					phone,
					username,
					auth_type = "MultiFactor",
					//
					notifications_settings = {},
					//
					permissions_module_list,
					permissions_other_list,
					client,
					project,
					site,
					contractor = {},
					client_blacklist = [],
					project_blacklist = [],
					site_blacklist = [],
				}
			}
		} = this;

		const {data = {}} = contractor;
		const {name: contractorName} = data;

		let {
			receive_asset_management_notifs,
			receive_chemicals_management_notifs,
			receive_contractor_management_notifs,
			receive_employees_expired_docs_medicals,
			receive_employees_profile_notifs,
			receive_incident_management_notifs,
			receive_non_conformance_management_notifs,
			receive_training_management_notifs,
			receive_expired_docs_notifs,
		} = notifications_settings || {};

		console.log(this.item)

		const {
			isConsultant,
			shouldSetupPermissions,
			isNoProjects,
			isClientBlacklisted,
			isProjectBlacklisted,
			isSiteBlacklisted
		} = storage.is;

		if (shouldSetupPermissions) {
			receive_asset_management_notifs = true;
			receive_chemicals_management_notifs = true;
			receive_contractor_management_notifs = true;
			receive_employees_expired_docs_medicals = true;
			receive_employees_profile_notifs = true;
			receive_incident_management_notifs = true;
			receive_non_conformance_management_notifs = true;
			receive_training_management_notifs = true;
			receive_expired_docs_notifs = true;
		}
		setTimeout(() => {
			this.state.lists.receive_asset_management_notifs[0].checked = !!receive_asset_management_notifs;
			this.state.lists.receive_chemicals_management_notifs[0].checked = !!receive_chemicals_management_notifs;
			this.state.lists.receive_contractor_management_notifs[0].checked = !!receive_contractor_management_notifs;
			this.state.lists.receive_employees_expired_docs_medicals[0].checked = !!receive_employees_expired_docs_medicals;
			this.state.lists.receive_employees_profile_notifs[0].checked = !!receive_employees_profile_notifs;
			this.state.lists.receive_incident_management_notifs[0].checked = !!receive_incident_management_notifs;
			this.state.lists.receive_non_conformance_management_notifs[0].checked = !!receive_non_conformance_management_notifs;
			this.state.lists.receive_training_management_notifs[0].checked = !!receive_training_management_notifs;
			this.state.lists.receive_expired_docs_notifs[0].checked = !!receive_expired_docs_notifs;
		}, 0);

		const path = this.path + "upload/profile-pic/user";

		const showBlacklisting = !isClientBlacklisted(client) && !isProjectBlacklisted(project) && !isSiteBlacklisted(site);

		let idx = 0;
		let idx_1 = 1;
		return (<FormControls>
			{!shouldSetupPermissions && <>
				{!isNoProjects && <Row
					active
					rendered
					idx={'Orgs'}
					title="Company / Project / Site"
					onFormOpen={onFormOpen}
					onFormNext={onFormNext}
					onFormSave={this.onFormSave}
				>
					{isConsultant && <SelectClientInput
						name="client"
						placeholder="Company..." showAll
						defaultValue={RenderUtils.selectedClient.call(this)}
						className="col-lg-12 form-control"
						onChange={this.form.onChange}/>
					}
					<SelectProjectInput
						name="project"
						placeholder="Project..."
						showAll
						defaultValue={RenderUtils.selectedProject.call(this)}
						className="col-lg-12 form-control" onChange={this.form.onChange}
					/>
					<SelectSiteInput
						name="site"
						placeholder="Site..."
						showAll
						defaultValue={RenderUtils.selectedSite.call(this)}
						className="col-lg-12 form-control" onChange={this.form.onChange}
					/>
				</Row>}
				{showBlacklisting && <Row
					rendered
					active={isNoProjects}
					idx={'Blacklisting'}
					title={`${idx += 1}. Blacklisting`}
					onFormOpen={onFormOpen}
					onFormNext={onFormNext}
					onFormBack={!isNoProjects && onFormBack}
				>
					<FormControls>
						{isConsultant && !isClientBlacklisted(client) && <Row
							rendered
							idx={'BlacklistedCompanies'}
							title={(idx + "." + idx_1) + ". Blacklisted Companies"}
							onFormOpen={onFormOpen}
							onFormNext={onFormNext}
							onFormSave={this.onFormSave}
						>
							<NewClientListUpdateBlacklistTable
								name="client_blacklist"
								defaultValue={[...client_blacklist, null]}
								onChange={this.form.onChange}
							/>
						</Row>}
						{!isProjectBlacklisted(project) && <Row
							rendered
							idx={'BlacklistedProjects'}
							title={(idx + "." + (idx_1++)) + ". Blacklisted Projects"}
							onFormOpen={onFormOpen}
							onFormNext={onFormNext}
							onFormBack={onFormBack}
							onFormSave={this.onFormSave}
						>
							<NewProjectListUpdateBlacklistTable
								name="project_blacklist"
								defaultValue={[...project_blacklist, null]}
								onChange={this.form.onChange}
							/>
						</Row>}
						{!isSiteBlacklisted(project) && <Row
							rendered
							idx={'BlacklistedSites'}
							title={(idx + "." + (idx_1++)) + ". Blacklisted Sites"}
							onFormOpen={onFormOpen}
							onFormBack={onFormBack}
							onFormSave={this.onFormSave}
						>
							<NewSiteListUpdateBlacklistTable
								name="site_blacklist" defaultValue={[...site_blacklist, null]}
								onChange={this.form.onChange}
							/>
						</Row>}
					</FormControls>
				</Row>}
				<Row
					rendered
					idx={'UserDetails'}
					title={`${idx += 1}. User Details`}
					onFormOpen={onFormOpen}
					onFormNext={onFormNext}
					onFormBack={onFormBack}
					onFormSave={this.onFormSave}
				>
					<ProfilePic path={path} id={item.id} profilePic={profile_pic} onUploaded={this.onUploaded}/>
					<ClearableInput name="fname" type="text" placeholder="First Name" defaultValue={fname} required
					                className="col-lg-6 form-control" onChange={this.form.onChange}/>
					<ClearableInput name="lname" type="text" placeholder="Last Name" defaultValue={lname} required
					                className="col-lg-6 form-control" onChange={this.form.onChange}/>
					<div
						className="row row-input flex w-full-calc-subtract-10 pull-left margin-l-0 margin-t-10 margin-r-10">
						<SelectCountryCodeInput name="country" type="select" placeholder="Code..."
						                        defaultValue={this.phoneCode} isEditable={this.isLoggedUser}
						                        className="fixed-flex form-control" onChange={this.form.onChange}/>
						<ClearableInput name="phone" type="number" placeholder="Phone Number"
						                defaultValue={this.phoneNumber} isEditable={this.isLoggedUser}
						                footerDesc="Don't enter a leading zero" className="-margin-l-10 form-control"
						                onChange={this.form.onChange}/>
					</div>
				</Row>
				<Row
					rendered
					idx={'LoginDetails'}
					title={`${idx += 1}. Login Details`}
					onFormOpen={onFormOpen}
					onFormNext={onFormNext}
					onFormBack={onFormBack}
					onFormSave={this.onFormSave}
				>
					<ClearableInput name="username" type="email" placeholder="Username / Email Address"
					                defaultValue={username} isEditable={this.isLoggedUser} required
					                className="col-lg-12 form-control"
					                onChange={this.form.onChange}/>
					<ClearableInput name="auth_type" type="radio" placeholder="Authentication Type"
					                defaultValue={auth_type} required vertical className="col-lg-12 form-control"
					                onChange={this.form.onChange} values={this.state.lists.auth_type}/>
					{this.isLoggedUser && <hr/>}
					{this.isLoggedUser &&
						<div className="row sec-group pos-relative padding-0 margin-0 min-h-50 margin-t-10">
							<div className="fixed-center margin-t-5">
								<Button className="btn btn-primary w-140" text="Change Password"
								        onClick={this.onChangePassword}/>
							</div>
						</div>}
				</Row>
			</>}
			<Row
				rendered
				idx={'NotificationsSettings'}
				title={`${idx += 1}. Notifications Settings`}
				className="NotificationsSettings-row"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={!shouldSetupPermissions && onFormBack}
				onFormSave={this.onFormSave}
			>
				<ClearableInput name="receive_asset_management_notifs" type="checkbox"
				                defaultValue={receive_asset_management_notifs} required
				                className="col-lg-12 form-control margin-b-0" vertical onChange={this.form.onChange}
				                values={this.state.lists.receive_asset_management_notifs}/>
				<ClearableInput name="receive_chemicals_management_notifs" type="checkbox"
				                defaultValue={receive_chemicals_management_notifs} required
				                className="col-lg-12 form-control margin-t-5 margin-b-0" vertical onChange={this.form.onChange}
				                values={this.state.lists.receive_chemicals_management_notifs}/>
				<ClearableInput name="receive_contractor_management_notifs" type="checkbox"
				                defaultValue={receive_contractor_management_notifs} required
				                className="col-lg-12 form-control margin-t-5 margin-b-0" vertical onChange={this.form.onChange}
				                values={this.state.lists.receive_contractor_management_notifs}/>
				<ClearableInput name="receive_employees_expired_docs_medicals" type="checkbox"
				                defaultValue={receive_employees_expired_docs_medicals} required
				                className="col-lg-12 form-control margin-t-5 margin-b-0" vertical onChange={this.form.onChange}
				                values={this.state.lists.receive_employees_expired_docs_medicals}/>
				<ClearableInput name="receive_employees_profile_notifs" type="checkbox"
				                defaultValue={receive_employees_profile_notifs} required
				                className="col-lg-12 form-control margin-t-5 margin-b-0" vertical onChange={this.form.onChange}
				                values={this.state.lists.receive_employees_profile_notifs}/>
				<ClearableInput name="receive_incident_management_notifs" type="checkbox"
				                defaultValue={receive_incident_management_notifs} required
				                className="col-lg-12 form-control margin-t-5 margin-b-0" vertical onChange={this.form.onChange}
				                values={this.state.lists.receive_incident_management_notifs}/>
				<ClearableInput name="receive_non_conformance_management_notifs" type="checkbox"
				                defaultValue={receive_non_conformance_management_notifs} required
				                className="col-lg-12 form-control margin-t-5 margin-b-0" vertical onChange={this.form.onChange}
				                values={this.state.lists.receive_non_conformance_management_notifs}/>
				<ClearableInput name="receive_training_management_notifs" type="checkbox"
				                defaultValue={receive_training_management_notifs} required
				                className="col-lg-12 form-control margin-t-5 margin-b-10" vertical onChange={this.form.onChange}
				                values={this.state.lists.receive_training_management_notifs}/>

				<hr className="margin-v-10"/>

				<ClearableInput name="receive_expired_docs_notifs" type="checkbox"
				                defaultValue={receive_expired_docs_notifs} required
				                className="col-lg-12 form-control margin-b-10" onChange={this.form.onChange}
				                values={this.state.lists.receive_expired_docs_notifs} returnValue/>
			</Row>
			<Row
				rendered
				idx={'Permissions'}
				title={`${idx += 1}. Permissions`}
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				<FormControls>
					<Row
						rendered
						idx={'SHEQManagementModulePermissions'}
						title={idx + ".1. SHEQ Management Module Permissions"}
						onFormOpen={onFormOpen}
						onFormNext={onFormNext}
						onFormSave={this.onFormSave}
					>
						<Button className="btn btn-primary pull-right margin-l-10 margin-r-10 padding-5"
						        text="Select All"
						        actionRef="NewUserModulePermissionsBySHEQ" onClick={this.onSelectAllModulePermissions}/>
						<Button className="btn btn-primary pull-right padding-5" text="Clear All"
						        actionRef="NewUserModulePermissionsBySHEQ" onClick={this.onClearAllModulePermissions}/>
						<hr className="pull-left"/>
						<NewUserModulePermissionsBySHEQ
							ref="NewUserModulePermissionsBySHEQ"
							name="permissions_modules_sheq"
							selectedList={permissions_module_list}
							onChange={this.form.onChange}
						/>
					</Row>
					<Row
						rendered
						idx={'HRManagementModulePermissions'}
						title={idx + ".2. HR Management Module Permissions"}
						onFormOpen={onFormOpen}
						onFormNext={onFormNext}
						onFormBack={onFormBack}
						onFormSave={this.onFormSave}
					>
						<Button className="btn btn-primary pull-right margin-l-10 margin-r-10 padding-5"
						        text="Select All"
						        actionRef="NewUserModulePermissionsByHR" onClick={this.onSelectAllModulePermissions}/>
						<Button className="btn btn-primary pull-right padding-5" text="Clear All"
						        actionRef="NewUserModulePermissionsByHR" onClick={this.onClearAllModulePermissions}/>
						<hr className="pull-left"/>
						<NewUserModulePermissionsByHR ref="NewUserModulePermissionsByHR" name="permissions_modules_hr"
						                              selectedList={permissions_module_list} onChange={this.form.onChange}/>
					</Row>
					<Row
						rendered
						idx={'ClaimManagementModulePermissions'}
						title={idx + ".3. Claims Management Module Permissions"}
						onFormOpen={onFormOpen}
						onFormNext={onFormNext}
						onFormBack={onFormBack}
						onFormSave={this.onFormSave}
					>
						<Button className="btn btn-primary pull-right margin-l-10 margin-r-10 padding-5"
						        text="Select All"
						        actionRef="NewUserModulePermissionsByClaim"
						        onClick={this.onSelectAllModulePermissions}/>
						<Button className="btn btn-primary pull-right padding-5" text="Clear All"
						        actionRef="NewUserModulePermissionsByClaim" onClick={this.onClearAllModulePermissions}/>
						<hr className="pull-left"/>
						<NewUserModulePermissionsByClaim ref="NewUserModulePermissionsByClaim"
						                                 name="permissions_modules_claims"
						                                 selectedList={permissions_module_list}
						                                 onChange={this.form.onChange}/>
					</Row>
					<Row
						rendered
						idx={'ExtraModulePermissions'}
						title={idx + ".4. Extra Module Permissions"}
						onFormOpen={onFormOpen}
						onFormNext={onFormNext}
						onFormBack={onFormBack}
						onFormSave={this.onFormSave}
					>
						<Button className="btn btn-primary pull-right margin-l-10 margin-r-10 padding-5"
						        text="Select All"
						        actionRef="NewUserModulePermissionsByExtra"
						        onClick={this.onSelectAllModulePermissions}/>
						<Button className="btn btn-primary pull-right padding-5" text="Clear All"
						        actionRef="NewUserModulePermissionsByExtra" onClick={this.onClearAllModulePermissions}/>
						<hr className="pull-left"/>
						<NewUserModulePermissionsByExtra ref="NewUserModulePermissionsByExtra"
						                                 name="permissions_modules_extra"
						                                 selectedList={permissions_module_list}
						                                 onChange={this.form.onChange}/>
					</Row>
					<Row
						rendered
						idx={'OtherPermissions'}
						title={idx + ".5. Other Permissions"}
						onFormOpen={onFormOpen}
						onFormBack={onFormBack}
						onFormSave={this.onFormSave}
					>
						<Button className="btn btn-primary pull-right margin-l-10 margin-r-10 padding-5"
						        text="Select All"
						        onClick={this.onSelectAllOtherPermissions}/>
						<Button className="btn btn-primary pull-right padding-5" text="Clear All"
						        onClick={this.onClearAllOtherPermissions}/>
						<hr className="pull-left"/>
						<NewUserOtherPermissions ref="otherPermissionsRef"
						                         name="permissions_other_list"
						                         selectedList={permissions_other_list}
						                         onChange={this.form.onChange}/>
					</Row>
				</FormControls>
			</Row>
			{this.isLoggedUser && <EditPasswordDialog ref="editPasswordDialog" item={item}/>}
			{this.isLoggedUser && <SetupPhoneNumDialog ref="setupPhoneNumDialog" isReauth/>}
		</FormControls>);
	}

	// </editor-fold>
}

export default Controls;
