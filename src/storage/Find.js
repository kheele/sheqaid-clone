import {is, list, selected} from './';
import {computedFn} from "mobx-utils";

class Find {

	findClientBySite(val) {
		if (!is.isConsultant) {
			const {loggedUser: {company}} = this.storage;
			return company;
		}

		const {clients} = list;
		for (let n = 0; n < clients.length; n++) {
			const client = clients[n];
			const {project_list} = client.data || client;
			for (let n2 = 0; n2 < project_list.length; n2++) {
				const project = project_list[n2];
				const {site_list} = project.data || project;
				const site = site_list.find(v => v.id === val.id);
				if (site) {
					return client;
				}
			}
		}
	}

	findProjectBySite(val) {
		if (!is.isConsultant) {
			const {projects} = list;
			for (let n = 0; n < projects.length; n++) {
				const project = projects[n];
				const {site_list} = project.data || project;
				const site = site_list.find(v => v.id === val.id);
				if (site) {
					return project;
				}
			}
		}

		const {clients} = list;
		for (let n = 0; n < clients.length; n++) {
			const client = clients[n];
			const {project_list} = client.data || client;
			for (let n2 = 0; n2 < project_list.length; n2++) {
				const project = project_list[n2];
				const {site_list} = project.data || project;
				const site = site_list.find(v => v.id === val.id);
				if (site) {
					return project;
				}
			}
		}
	}

	findClientById(id) {
		if (!is.isConsultant) {
			const {loggedUser: {company}} = this.storage;
			if (company.id === id) {
				return company;
			}
		}

		const {clients} = list;
		for (let n = 0; n < clients.length; n++) {
			const client = clients[n];
			console.log('findClientById client', client)
			if (client.id === id) {
				return client;
			}
		}
	}

	findProjectById(id) {
		if (!is.isConsultant) {
			const {projects} = list;
			for (let n = 0; n < projects.length; n++) {
				const project = projects[n];
				if (project.id === id) {
					return project;
				}
			}
		}

		const {clients} = list;
		for (let n = 0; n < clients.length; n++) {
			const client = clients[n];
			console.log('findProjectById client', client)
			const {project_list = []} = client.data || client;
			for (let n2 = 0; n2 < project_list.length; n2++) {
				const project = project_list[n2];
				if (project.id === id) {
					return project;
				}
			}
		}
	}

	findModuleSignatureSettings = computedFn((_plugin, _module) => {
		const {selectedClientSignatureSettings: {list}} = selected;
		if (list.isEmpty()) {
			return null;
		}
		return list.find((
			{
				data: {
					plugin, module,
					is_employee_owning,
					signature_settings_list,
				},
			}
		) => plugin === _plugin && module === _module);
	}, true);

	findModuleSignatureSettingsSHEQ = computedFn((module) => this.findModuleSignatureSettings('plugin_sheq_assist', module), true);
	findModuleSignatureSettingsHR = computedFn((module) => this.findModuleSignatureSettings('plugin_hr_management', module), true);
	findModuleSignatureSettingsExtra = computedFn((module) => this.findModuleSignatureSettings('plugin_extra', module), true);
	findModuleSignatureSettingsClaims = computedFn((module) => this.findModuleSignatureSettings('plugin_claim_management', module), true);

}

const find = new Find();
export default find;