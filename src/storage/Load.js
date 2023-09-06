import {execWhen} from '../utils/Utils';

import {is, login} from './';
import signatureSettingStore from "mutations/all/SignatureSetting";
import clientStore from "../mutations/all/Client";
import projectStore from "../mutations/all/Project";
import siteStore from "../mutations/all/Site";
import listAllPermissionOtherKey from "../mutations/all/PermissionOtherKey/listAllPermissionOtherKey";
import listAllCountry from "../mutations/all/Country/listAllCountry";

const stores = {
	clients: clientStore,
	projects: projectStore,
	sites: siteStore,
};

class Load {

	loadCountries() {
		if (!is.isLoadingCountries) {
			is.isLoadingCountries = true;
			return listAllCountry().then(res => {
//                console.log("countries/list", res)
				this.storage.attrs.set("countries", res);
			}).catch(err => {
				this.storage.attrs.set("countries", []);
			}).finally(() => {
				setTimeout(() => {
					is.isLoadingCountries = false;
				});
			});
		} else {
			return Promise.resolve();
		}
	}

	loadImpl(path, title, loginFN, reload) {
		const store = stores[path];
		return store.listAllByLogged().then(res => {
			console.log(path + "/list", res)
			this.storage.attrs.set(path, res);
			if (res.isEmpty()) {
				// return confirmDialog.open("There are currently no " + title + " created. Would you like to create a " + path.replace("ts", "t").replace("es", "e") + "?").then(res => {
				//     if (res === 1) {
				//         return defaultView.navigate(title, 'New').then(item => {
				//             return login[loginFN](item.id).then(res => {
				//                 return execWhen(() => !!selectedItems && selectedItems.refs[path]).then(ref => {
				//                     ref.select(item);
				//                     return true;
				//                 });
				//             });
				//         });
				//     } else if (path === "clients") {
				//         return true;
				//     }
				// });
			} else {
				if (!reload) {
					return execWhen(() => !!window.selectedItems).then(() => {
//                        alert('reload')
						return new Promise((resolve, reject) => {
							setTimeout(() => {
								selectedItems.open(path).then(item => {
									return login[loginFN](item.id).then(res => {
										return execWhen(() => !!selectedItems && selectedItems.refs[path]).then(ref => {
											ref.select(item);
											return true;
										});
									});
								}).then(resolve, reject);
							}, 0);
						});
					});
				} else {
					return true;
				}
			}
		}).catch(e => {
			console.log(e)
		});
	}

	loadClients(reload) {
		if (!is.isConsultant) {
			return;
		}
		return this.loadImpl("clients", "Clients", "loginClient", reload).then(res => {
			res && this.loadProjects(reload);
		});
	}

	loadProjects(reload) {
		return this.loadImpl("projects", "Projects", "loginProject", reload).then(res => {
			res && this.loadSites(reload);
		});
	}

	loadSites(reload) {
		return this.loadImpl("sites", "Sites", "loginSite", reload).finally(() => {
			this.storage.isLoaded = false;
		});
	}

	loadEmergencyContacts(type) {
		const key = 'isLoadingEmergencyContacts' + type;
		if (!this[key]) {
			this[key] = true;
			return neonBinding.events.emit("plugin_sheq_assist/16_Emergency_Preparedness/emergency-numbers/" + type + "/list").then(res => {
				this.storage.attrs.set("emergency-numbers-" + type, res);
				setTimeout(() => {
					this[key] = false;
				});
			});
		} else {
			return Promise.resolve();
		}
	}

	loadSignatureSettings() {
		// signatureSettingStore
		return neonBinding.events.emit("plugin_sheq_assist/signature-settings/list").then(res => {
			this.storage.attrs.set("signature-settings", res);
			console.log("signature-settings", res)
		});
	}

	loadPermissionOtherKeys() {
		return listAllPermissionOtherKey().then(res => {
			// console.log('loadPermissionOtherKeys:', res)
			this.storage.attrs.set("permissionOtherKeys", res.map(({id, data}) => ({id, ...data})));
		});
	}
}

const load = new Load();
export default load;
