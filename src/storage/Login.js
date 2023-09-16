import React from "react";
import {execWhen} from '../utils/Utils';

import {is, load, logout, update} from './';

class Login {

	get currApp() {
		const {isLoggedInAuth, isEmployee, isUser, isContractor} = is;
		if (!isLoggedInAuth) {
			return null;
		}

		if (isContractor) {
			return firebase_app_2;
		} else {
			return firebase_app_1;
		}
	}

	get currAuth() {
		const {isLoggedInAuth, isEmployee, isUser, isContractor} = is;
		if (!isLoggedInAuth) {
			return null;
		}

		if (isContractor) {
			return auth2;
		} else {
			return auth;
		}
	}

	createPhoneAuthVerifier(recaptchaContainerId) {
		return new firebase.auth.RecaptchaVerifier(recaptchaContainerId, {
			size: "normal",
			callback: (response) => {
				progressDialog.open();
			},
			'expired-callback': () => {
				infoDialog.open('Security Verification has expired. Please try again.');
			}
		}, this.currApp);
	}

	onVerifyPhoneAuth(phoneNum, appVerifier, onVerified, onFormGotoNext, onFormGotoPrev) {
		const provider = new firebase.auth.PhoneAuthProvider(this.currAuth);
		provider.verifyPhoneNumber(phoneNum, appVerifier).then(verificationId => {
			onVerified && onVerified(verificationId);
			infoDialog.open(<div>Verification code sent.<br/>Please check the verification code on your phone.</div>);
			onFormGotoNext && onFormGotoNext();
		}).catch(err => {
			onFormGotoPrev && onFormGotoPrev();
			console.error(err);
			switch (err.code) {
				case 'auth/network-request-failed':
					infoDialog.open(<div>Your internet connection is too slow<br/>or you are not connected to the internet.
					</div>);
					break;
				case 'auth/invalid-phone-number':
					infoDialog.open("Sorry, the phone number you entered is incorrect.");
					break;
				case 'auth/user-disabled':
					infoDialog.open("Sorry, this phone number account is disabled.");
					break;
				case 'auth/captcha-check-failed':
					infoDialog.open(<div>Sorry, the capture verification failed.<br/>Please try again.</div>);
					break;
				case 'auth/maximum-second-factor-count-exceeded':
				case 'auth/second-factor-already-in-use':
				case 'auth/unsupported-first-factor':
				case 'auth/unverified-email':
				case 'auth/missing-phone-number':
				case 'auth/quota-exceeded':
				case 'auth/internal-error':
				default:
					infoDialog.open(<div>Sorry, we couldn't verify your phone number at the moment.<br/>Please try again
						later.<br/>If the issue persists, please contact support.</div>);
					break;
			}
		}).finally(() => {
			progressDialog.close();
		});
	}

	loginClient(id) {
		return execWhen(() => !!window.selectedItems && !!selectedItems.refs.clients).then(() => {
			// return neonBinding.events.emit("plugin_sheq_assist/clients/login", id).then(res => {
			// 	res && this.storage.attrs.set("loggedClient", id);
				this.storage.attrs.set("loggedClient", id);
			// }).catch(e => {
			// 	console.log(e)
			// });
		});
	}

	loginProject(id) {
		return execWhen(() => !!window.selectedItems && !!selectedItems.refs.projects).then(() => {
			// return neonBinding.events.emit("plugin_sheq_assist/projects/login", id).then(res => {
				// res && this.storage.attrs.set("loggedProject", id);
				this.storage.attrs.set("loggedProject", id);
			// }).catch(e => {
			// 	console.log(e);
			// });
		});
	}

	loginSite(id) {
		return execWhen(() => !!window.selectedItems && !!selectedItems.refs.sites).then(() => {
			// return neonBinding.events.emit("plugin_sheq_assist/sites/login", id).then(res => {
			// 	res && this.storage.attrs.set("loggedSite", id);
				this.storage.attrs.set("loggedSite", id);
			// }).catch(e => {
			// 	console.log(e)
			// });
		});
	}

	async loginContractor(item) {
		// return neonBinding.events.emit("plugin_sheq_assist/contractors/active/login", item.id).then(res => {
		// 	res && this.storage.attrs.set('contractor', item);
			this.storage.attrs.set('contractor', item);
			if (!is.isContractorViewIncContractorPack) {
				defaultView.navigate('__B_Contractors');
			}
		// }).catch(e => {
		// 	console.log(e)
		// });
	}

	loginContractorClient(item) {
		return execWhen(() => !!window.selectedContractorItems && !!selectedContractorItems.refs.clients).then(() => {
				this.storage.attrs.set("loggedContractorClient", item);
		});
	}

	loginContractorSite(item) {
		return execWhen(() => !!window.selectedContractorItems && !!selectedContractorItems.refs.sites).then(() => {
			this.storage.attrs.set("loggedContractorSite", item);
		});
	}

//    company_id, contractor_id, client_id, project_id, site_id, 
//    optional_info.department.id, optional_info.job_position.id,
//    removed, lname, id_num, keywords: ARRAY,
//    employee_job_appointment_list, employee_competency_list, employee_contract_list, employee_medical_list, employee_warning_list,
//    sub_collection_keys.employee_competency_list.competency_type: ARRAY, 

	async loginUser(user) {
		// user = convertMutations(user);

		this.storage.attrs.set("loggedUser", user);

		const {loggedUser} = this.storage;

		if (isAdminApp) {
			update.updateDBUser(user);
			return Promise.resolve();
		}

		try {
			await Promise.all([
				// load.loadSignatureSettings(),
				// load.loadEmergencyContacts("external"),
				// load.loadEmergencyContacts("internal"),
			]);
		} catch (e) {

		}

		if (is.isContractor) {
			let {contractor} = loggedUser.user.data;
			if(!contractor.data) {
				contractor = {id: contractor.id, data: contractor};
			}
			this.loginContractor(contractor);
			update.updateDBUser(user);
		} else {
			await logout.logoutContractor();

			const {client: my_client, project: my_project, site: my_site} = loggedUser.user.data;
			const loginClients = () => {
				if (my_site) {
					this.loginSite(my_site.id).then(res => {
						execWhen(() => window.selectedItems).then(selectedItems => {
							selectedItems.refs.sites.select(my_site);
							this.storage.isLoaded = false;
						});
					});
					return;
				}
				if (my_project) {
					this.loginProject(my_project.id).then(res => {
						execWhen(() => window.selectedItems).then(selectedItems => {
							selectedItems.refs.projects.select(my_project);
							load.loadSites();
						});
					});
					return;
				}
				return true;
			};
//        setTimeout(() => {
			if (is.isConsultant) {
				const continue_ = loginClients();
				if (continue_) {
					if (my_client) {
						this.loginClient(my_client.id).then(res => {
							execWhen(() => window.selectedItems).then(selectedItems => {
								selectedItems.refs.clients.select(my_client);
								load.loadProjects();
							});
						});
						return;
					}

					load.loadClients();
				}

				update.updateDBUser(user);
			} else {
				const onIsNoProjectsFn = (isNoProjects) => {
					if (!isNoProjects) {
						const continue_ = loginClients();
						if (continue_) {
							load.loadProjects();
						}
					} else if (isNoProjects) {
						this.storage.isLoaded = false;
					}

					update.updateDBUser(user);
				};

				if (is.isNoProjectsUndefined) {
					noProjectsDialog.open().then(onIsNoProjectsFn);
				} else {
					onIsNoProjectsFn(is.isNoProjects);
				}
			}
		}
//        }, 0);
	}

}

const login = new Login();
export default login;