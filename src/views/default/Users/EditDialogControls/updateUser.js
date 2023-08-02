import React from "react";
import {extendObservable} from "mobx";
import updateUser from "mutations/all/User/updateUser";

function onUpdated({data, onSaved}) {
	// if (data.lname || data.fname) {
	// 	data.full_name = `${data.lname} ${data.fname}`;
	// }

	onSaved && onSaved(data);
	const {loggedUser} = storage;
	if (this.isLoggedUser) {
		extendObservable(loggedUser.user.data, data);
		storage.update.updateDBUser(loggedUser);
	}
	infoDialog.open("Record successfully updated.");
	infoDialog.close(2000);
	this.props.close();
}

function onProceed({btn, data, shouldSetupPermissions, onSaved, client, project, site}) {
	console.log(data)

	btn.text("Saving...").disabled();
	updateUser({id: this.item.id, ...data}).then(res => {
		console.log("res", res)

		if (res === 'PASSWORD_CONF_REQUIRED') {
			infoDialog.open("Password Confirmation is required in order to change Email Address or Phone Number.");
			return;
		}
		if (res === 'CANT_UPDATE_OTHER_USER_EMAIL_OR_PHONE') {
			infoDialog.open("You are not allowed to change other user Email Address or Phone Number. This is for security reasons.");
			return;
		}
		if (res === 'EMAIL_DUP') {
			infoDialog.open("Another user is using the Email Address provided.");
			return;
		}
		if (res === 'PHONE_DUP') {
			infoDialog.open("Another user is using the Phone Number provided.");
			return;
		}

		if (!shouldSetupPermissions) {
			site && (data.site_id = site.id);
			project && (data.project_id = project.id);
			client && (data.client_id = client.id);
			if (site === 'All') {
				delete data.site;
			}
			if (project === 'All') {
				delete data.project;
			}
			if (client === 'All') {
				delete data.client;
			}
		}

		onUpdated.call(this, {data, onSaved});
	}).catch(e => {
		console.error(e);
		if (!e) {
			infoDialog.open("An unexpected error occurred. Please try again.");
		} else {
			switch (e.code) {
				case 'auth/requires-recent-login':
					infoDialog.open("This operation is sensitive and requires recent authentication. Log in again before retrying this request.");
					break;
				case 'auth/wrong-password':
					infoDialog.open("The password is invalid.");
					break;
				default:
					infoDialog.open("An unexpected error occurred. Please try again.");
					break;
			}
		}
	}).finally(() => {
		btn.text("Save").enabled();
	});
}

export default async function (
	{
		btn,
		data,
		phoneUpdated,
		passwordVerified,
		shouldSetupPermissions,
		onSaved,
		client,
		project,
		site
	}
) {
	if (Object.keys(data).isEmpty()) {
		if (phoneUpdated) {
			onUpdated.call(this, {data, onSaved});
		} else {
			infoDialog.open("Nothing changed!");
		}
		return;
	}

	if (data.username || data.phone) {
		if (this.isLoggedUser) {
			if (!passwordVerified) {
				const text = await inputDialog.password().open("Enter Password");
				if (!text) {
					infoDialog.open('Password is required');
					return;
				}

				data.password_conf = text;
			}

			onProceed.call(this, {
				btn, data, shouldSetupPermissions, onSaved,
				client, project, site
			});
		} else {
			infoDialog.open("You are not allowed to change other user Email Address or Phone Number. This is for security reasons.");
		}
	} else {
		onProceed.call(this, {
			btn, data, shouldSetupPermissions, onSaved,
			client, project, site
		});
	}
}