import {computed} from 'mobx';
import {computedFn} from "mobx-utils";

import {list, selected, find} from './';

class Is {

    @computed
    get isLoadedCountries() {
        const {attrs} = this.storage;
        return attrs.has("countries");
    }

    @computed
    get isLoadedSignatureSettings() {
        const {attrs} = this.storage;
        return attrs.has("signature-settings");
    }

    @computed
    get isLoggedUserAuthChecked() {
        return this.storage.attrs.has("loggedUserAuthChecked");
    }

    @computed
    get isLoggedInAuth() {
        return this.storage.attrs.has("loggedUserAuth");
    }

    @computed
    get isLoggedIn() {
        return this.storage.attrs.has("loggedUser");
    }

    @computed
    get isLoadedContacts() {
        const {attrs} = this.storage;
        return attrs.has("emergency-numbers-external") && attrs.has("emergency-numbers-internal");
    }

    @computed
    get isLoadedPermissionOtherKeys() {
        const {attrs} = this.storage;
        return attrs.has("permissionOtherKeys");
    }

    @computed
    get isTrial() {
        if (isAdminApp || !this.isLoggedIn) return false;
        if(this.isContractor) {
            const {selectedContractorSite} = selected;
            if(selectedContractorSite) {
                const {account_type} = selectedContractorSite.site.company;
                return !account_type || account_type === 'Trial';
            }
            return false;
        }
        const {account_type} = storage.loggedUser.company.data;
//        return false;
        return !account_type || account_type === 'Trial';
    }

    @computed
    get isClient() {
        if (isAdminApp || !this.isLoggedIn) return false;
        return !this.isConsultant;
    }

    @computed
    get isConsultant() {
        if (isAdminApp || !this.isLoggedIn) return false;
        if(this.isContractor) {
            const {selectedContractorSite} = selected;
            if(selectedContractorSite) {
                const {consultant} = selectedContractorSite.site.company;
                return consultant;
            }
            return false;
        }
        const {loggedUser} = this.storage;
        return loggedUser.company.data.consultant;
    }

    @computed
    get isNoProjectsUndefined() {
        if (isAdminApp || !this.isLoggedIn || this.isConsultant) return false;
        if(this.isContractor) {
            const {selectedContractorSite} = selected;
            if(selectedContractorSite) {
                const {no_projects} = selectedContractorSite.site.company;
                return no_projects === null || no_projects === undefined;
            }
            return false;
        }
        const {loggedUser: {company: {data: {no_projects}}}} = this.storage;
        return no_projects === null || no_projects === undefined;
    }

    @computed
    get isNoProjects() {
        if (isAdminApp || !this.isLoggedIn || this.isConsultant) return false;
        if(this.isContractor) {
            const {selectedContractorSite} = selected;
            if(selectedContractorSite) {
                const {no_projects} = selectedContractorSite.site.company;
                return no_projects;
            }
            return false;
        }
        const {loggedUser} = this.storage;
        return loggedUser.company.data.no_projects;
    }

    @computed
    get hasProjects() {
        if (isAdminApp || !this.isLoggedIn) return false;
        if(this.isContractor) {
            const {selectedContractorSite} = selected;
            if(selectedContractorSite) {
                const {no_projects} = selectedContractorSite.site.company;
                return this.isConsultant || !no_projects;
            }
            return false;
        }
        const {loggedUser} = this.storage;
        return this.isConsultant || !loggedUser.company.data.no_projects;
    }

    @computed
    get shouldSetupPermissions() {
        if (isAdminApp || !this.isLoggedIn) return false;
        const {selectedClientModules: {list}} = selected;
        if (this.isContractor || this.isEmployee || list.isEmpty()) {
            return false;
        }

        const {loggedUser} = this.storage;
        // const {permissions_modules, permissions_other} = loggedUser.user.data;
        const {permissions_module_list, permissions_other_list} = loggedUser.user.data;

        if (!permissions_module_list && !permissions_other_list) {
            return true;
        }
        if (permissions_module_list.isEmpty() && permissions_other_list.isEmpty()) {
            return true;
        }

        return false;
    }

    @computed
    get isLoggedClient() {
        if (isAdminApp || !this.isLoggedIn) return false;
        if(this.isContractor) {
            const {selectedContractorSite} = selected;
            if(selectedContractorSite) {
                return !!selectedContractorSite.client;
            }
            return false;
        }

        if (!this.isConsultant) {
            return true;
        }

        const {loggedUser} = this.storage;
        const {client: my_client} = loggedUser.user.data;

        return !!my_client;
    }

    @computed
    get isLoggedProject() {
        if (isAdminApp || !this.isLoggedIn) return false;
        if(this.isContractor) {
            const {selectedContractorSite} = selected;
            if(selectedContractorSite) {
                return !!selectedContractorSite.project;
            }
            return false;
        }
        const {loggedUser} = this.storage;
        const {project: my_project} = loggedUser.user.data;
        return !!my_project;
    }

    @computed
    get isLoggedSite() {
        if (isAdminApp || !this.isLoggedIn) return false;
        if(this.isContractor) {
            const {selectedContractorSite} = selected;
            if(selectedContractorSite) {
                return !!selectedContractorSite.site;
            }
            return false;
        }
        const {loggedUser} = this.storage;
        const {site: my_site} = loggedUser.user.data;
        return !!my_site;
    }

    @computed
    get isLoggedContractorClient() {
        return this.storage.attrs.has("loggedContractorClient");
    }

    @computed
    get isLoggedContractorSite() {
        return this.storage.attrs.has("loggedContractorSite");
    }

    @computed
    get isContractor() {
        if (isAdminApp || !this.isLoggedInAuth) return false;
        if (!this.storage.attrs.has("idTokenResult"))
            return false;
        const {claims: {access_type}} = this.storage.idTokenResult;
        return access_type === 'ContractorUser';
    }

    @computed
    get isContractorView() {
        if (isAdminApp || !this.isLoggedIn) return false;
        return this.storage.attrs.has("contractor");
    }

    @computed
    get isContractorViewVisited() {
        if (isAdminApp || !this.isLoggedIn) return false;
        return this.isContractorView && !this.isContractor;
    }

    @computed
    get isContractorViewIncContractorPack() {
        if (!this.isContractorView) return false;
        console.log('isContractorViewIncContractorPack', this.storage.attrs.get("contractor"))
        return this.storage.attrs.get("contractor").data.inc_contractor_pack === 'Yes';
    }

    @computed
    get isUser() {
        if (isAdminApp || !this.isLoggedInAuth) return false;
        if (!this.storage.attrs.has("idTokenResult"))
            return false;
        const {claims: {access_type}} = this.storage.idTokenResult;
        return access_type === 'User';
    }

    @computed
    get isSupervisor() {
        if (isAdminApp || !this.isLoggedIn) return false;
        if (!this.isEmployee)
            return false;

        const {current_team} = this.storage.loggedUser.user.data;
        return !!current_team;
    }

    @computed
    get isEmployee() {
        if (isAdminApp || !this.isLoggedInAuth) return false;
        if (!this.storage.attrs.has("idTokenResult"))
            return false;
        const {claims: {access_type}} = this.storage.idTokenResult;
        return access_type === 'Staff';
    }

    @computed
    get hasPaymentInterval() {
        if (isAdminApp || !this.isLoggedIn) return false;
        if(this.isContractor) {
            return false;
        }
        if (this.isConsultant) {
            const {selectedClient} = selected;
            if (selectedClient && selectedClient.data) {
                const {payment_interval} = selectedClient.data;
                return !!payment_interval;
            }
            return false;
        } else {
            const {payment_interval} = this.storage.loggedUser.company.data;
            return !!payment_interval;
        }
    }

    isClientBlacklisted = computedFn((val) => {
        if (!val) return false;
        const {isLoggedClient} = is;
        if (isLoggedClient) {
            return false;
        }
        const {client_blacklist = []} = this.storage.loggedUser.user.data;
        return client_blacklist.map(v => v.id || v).contains(val.id);
    }, true);

    isProjectBlacklisted = computedFn((val) => {
        if (!val) return false;
        const {isLoggedProject} = is;
        if (isLoggedProject) {
            return false;
        }
        const {project_blacklist = []} = this.storage.loggedUser.user.data;
        return project_blacklist.map(v => v.id || v).contains(val.id);
    }, true);

    isSiteBlacklisted = computedFn((val) => {
        if (!val) return false;
        const {isLoggedSite} = is;
        if (isLoggedSite) {
            return false;
        }
        const {site_blacklist = []} = this.storage.loggedUser.user.data;
        return site_blacklist.map(v => v.id || v).contains(val.id);
    }, true);

    isSiteInProject(val, projectVal) {
        if (!projectVal || projectVal === 'All') {
            return false;
        }
        for (let n = 0; n < list.clients.length; n++) {
            const client = list.clients[n];
            const {projects} = client.data;
            for (let n2 = 0; n2 < projects.length; n2++) {
                const project = projects[n2];
                if (projectVal.id === project.id) {
                    const site = project.data.sites.find(v => v.id === val.id);
                    if (site) {
                        return true;
                    }
                }
            }
        }
    }

    hasModuleSignatureSettings = computedFn((plugin, module) => !!find.findModuleSignatureSettings(plugin, module), true);

    hasModuleSignatureSettingsSHEQ = computedFn((module) => this.hasModuleSignatureSettings('plugin_sheq_assist', module), true);

    hasModuleSignatureSettingsHR = computedFn((module) => this.hasModuleSignatureSettings('plugin_hr_management', module), true);

    hasModuleSignatureSettingsExtra = computedFn((module) => this.hasModuleSignatureSettings('plugin_extra', module), true);

    hasModuleSignatureSettingsClaims = computedFn((module) => this.hasModuleSignatureSettings('plugin_claim_management', module), true);

    hasModuleSignatureSettingsEmployeeOwning = computedFn((plugin, module) => {
        const signatureSettings = find.findModuleSignatureSettings(plugin, module);
        if (!signatureSettings) return false;
        const {data: {is_employee_owning}} = signatureSettings;
        return is_employee_owning;
    }, true);

    hasModuleSignatureSettingsEmployeeOwningSHEQ = computedFn((module) => this.hasModuleSignatureSettingsEmployeeOwning('plugin_sheq_assist', module), true);

    hasModuleSignatureSettingsEmployeeOwningHR = computedFn((module) => this.hasModuleSignatureSettingsEmployeeOwning('plugin_hr_management', module), true);

    hasModuleSignatureSettingsEmployeeOwningExtra = computedFn((module) => this.hasModuleSignatureSettingsEmployeeOwning('plugin_extra', module), true);

    hasModuleSignatureSettingsEmployeeOwningClaims = computedFn((module) => this.hasModuleSignatureSettingsEmployeeOwning('plugin_claim_management', module), true);

    hasModuleSignatureSettingsNotEmployeeOwning = computedFn((plugin, module) => {
        const signatureSettings = find.findModuleSignatureSettings(plugin, module);
        if (!signatureSettings) return false;
        const {data: {is_employee_owning}} = signatureSettings;
        return !is_employee_owning;
    }, true);

    hasModuleSignatureSettingsNotEmployeeOwningSHEQ = computedFn((module) => this.hasModuleSignatureSettingsNotEmployeeOwning('plugin_sheq_assist', module), true);

    hasModuleSignatureSettingsNotEmployeeOwningHR = computedFn((module) => this.hasModuleSignatureSettingsNotEmployeeOwning('plugin_hr_management', module), true);

    hasModuleSignatureSettingsNotEmployeeOwningExtra = computedFn((module) => this.hasModuleSignatureSettingsNotEmployeeOwning('plugin_extra', module), true);

    hasModuleSignatureSettingsNotEmployeeOwningClaims = computedFn((module) => this.hasModuleSignatureSettingsNotEmployeeOwning('plugin_claim_management', module), true);

}

const is = new Is();
export default is;
