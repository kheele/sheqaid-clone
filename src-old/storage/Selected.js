import {computed} from 'mobx';

import {is, list} from './';

class Selected {
    //<editor-fold desc="loggedClientName">
    @computed
    get loggedClientName() {
        let name;
        if (is.isConsultant) {
            const {selectedClient} = this;
            name = selectedClient && selectedClient.data.name;
        } else {
            const {loggedUser} = this.storage;
            name = loggedUser.company.data.company_name;
        }
        return name;
    }
    //</editor-fold>

    //<editor-fold desc="selectedClient">
    @computed
    get selectedClient() {
        const {loggedUser} = this.storage;
        if (!is.isConsultant) {
            return loggedUser.company;
        }
        //nicolene@kwikbulk.co.za, Nicolene, Erasmus
        //Rainy Mmotong, 0659703417

        if (!loggedUser) {
            return null;
        }

        const {user} = loggedUser;
        const {client, project, site} = user.data;
        if (client) {
            return client;
        }
        if (list.clients.isEmpty() || !this.storage.attrs.has("loggedClient"))
            return null;
        const id = this.storage.attrs.get("loggedClient");
        return list.clients.find(val => val.id === id);
    }

    //</editor-fold>

    //<editor-fold desc="selectedProject">
    @computed
    get selectedProject() {
        const {client, project, site} = this.storage.loggedUser.user.data;
        if (project) {
            return project;
        }
        if (list.projectsFiltered.isEmpty() || !this.storage.attrs.has("loggedProject"))
            return null;
        const id = this.storage.attrs.get("loggedProject");
        return list.projectsFiltered.find(val => val.id === id);
    }
    //</editor-fold>

    //<editor-fold desc="selectedSite">
    @computed
    get selectedSite() {
        const {client, project, site} = this.storage.loggedUser.user.data;
        if (site) {
            return site;
        }
        if (list.sitesFiltered.isEmpty() || !this.storage.attrs.has("loggedSite"))
            return null;
        const id = this.storage.attrs.get("loggedSite");
        return list.sitesFiltered.find(val => val.id === id);
    }
    //</editor-fold>

    //<editor-fold desc="selectedContractorSite">
    @computed
    get selectedContractorSite() {
        const {loggedContractor} = this.storage;
        if (!loggedContractor)
            return null;
        const {id, data: {name, username, site_list = []}} = loggedContractor;
        const site_id = this.storage.attrs.get("loggedContractorSite");
        return site_list.find(val => val.id === site_id);
    }
    //</editor-fold>

    @computed
    get selectedClientInput() {
        let {selectedClient} = this;
        if (selectedClient) {
            const {name, data} = selectedClient;
            return {value: selectedClient, label: name || data.name};
        }
    }

    @computed
    get selectedProjectInput() {
        let {selectedProject} = this;
        if (selectedProject) {
            const {name, data} = selectedProject;
            return {value: selectedProject, label: name || data.name};
        }
    }

    @computed
    get selectedSiteInput() {
        let {selectedSite} = this;
        if (selectedSite) {
            const {name, data} = selectedSite;
            return {value: selectedSite, label: name || data.name};
        }
    }

    @computed
    get selectedContractorSiteInput() {
        let {selectedContractorSite} = this;
        if (selectedContractorSite) {
            const {name, client} = selectedContractorSite.data;
            const clientName = (client.name || client.data.name);
            const label = (clientName + " - " + name);
            return {value: selectedContractorSite, label};
        }
    }

    get selectedClientModules() {
        if (this.moduleList) {
            return this.moduleList;
        }
        return this.moduleList = new ModuleList(this);
    }

    get selectedClientSignatureSettings() {
        if (this.signatureList) {
            return this.signatureList;
        }
        return this.signatureList = new SignatureSettings(this);
    }

    @computed
    get selectedClientCovidBusinessId() {
        let business_id;
        if (is.isConsultant) {
            const {selectedClient} = this;
            business_id = selectedClient && selectedClient.data.business_id;
        } else {
            const {loggedUser} = this.storage;
            business_id = loggedUser.company.data.business_id;
        }
        return business_id;
    }

}

class ModuleList {
    constructor(selected) {
        this.selected = selected;
    }

    @computed
    get listNew() {
        const {moduleListInstalledAll} = moduleManager;
        return moduleListInstalledAll;
    }

    //<editor-fold desc="list">
    @computed
    get list() {
        const {moduleListInstalledAll} = moduleManager;
        if (isAdminApp) {
            return moduleListInstalledAll;
        }
        if (is.isContractorView) {
            return moduleListInstalledAll;
        }
        const {selectedClient} = this.selected;
        const id = selectedClient && selectedClient.id;
        if (!id)
            return [];
        return moduleListInstalledAll.filter(({company_list = []}) => company_list.anyMatch(v => v.id === id));
    }

    //</editor-fold>

    //<editor-fold desc="listDashboard">
    @computed
    get listDashboard() {
        const {moduleListInstalledDashboard} = moduleManager;
        if (isAdminApp) {
            return moduleListInstalledDashboard;
        }
        if (is.isContractorView) {
            return moduleListInstalledDashboard;
        }
        const {selectedClient} = this.selected;
        const id = selectedClient && selectedClient.id;
        if (!id)
            return [];
        return moduleListInstalledDashboard.filter(({company_list = []}) => company_list.anyMatch(v => v.id === id));
    }

    //</editor-fold>

    @computed
    get listSHEQ() {
        return this.list.filter(v => v.group === "plugin_sheq_assist");
    }

    @computed
    get listHR() {
        return this.list.filter(v => v.group === "plugin_hr_management");
    }

    @computed
    get listClaim() {
        return this.list.filter(v => v.group === "plugin_claim_management");
    }

    @computed
    get listExtra() {
        return this.list.filter(v => v.group === "plugin_extra");
    }

    @computed
    get navs() {
        return this.listDashboard.filter(({key}) => key !== 'Dashboard')/*.sort((mod1, mod2) => {
         return mod1.title < mod2.title;
         })*/.map(mod => {
            return {key: mod.key, faIconLeft: mod.faIconLeft, faIconRight: mod.faIconRight, title: mod.title};
        });
    }

    @computed
    get permissions() {
        return this.list.map(({key, title}) => {
            return {key, desc: title, actions: {create: false, edit: false, view: false, remove: false, share: false}};
        });
    }

    @computed
    get permissionsSHEQ() {
        return this.listSHEQ.map(({key, title}) => {
            return {key, desc: title, actions: {create: false, edit: false, view: false, remove: false, share: false}};
        });
    }

    @computed
    get permissionsHR() {
        return this.listHR.map(({key, title}) => {
            return {key, desc: title, actions: {create: false, edit: false, view: false, remove: false, share: false}};
        });
    }

    @computed
    get permissionsClaim() {
        return this.listClaim.map(({key, title}) => {
            return {key, desc: title, actions: {create: false, edit: false, view: false, remove: false, share: false}};
        });
    }

    @computed
    get permissionsExtra() {
        return this.listExtra.map(({key, title}) => {
            return {key, desc: title, actions: {create: false, edit: false, view: false, remove: false, share: false}};
        });
    }

    @computed
    get permissionsSelected() {
        return this.list.map(({key, title}) => {
            return {key, desc: title, actions: {create: true, view: true, edit: true, remove: true, share: true}};
        });
    }
}

class SignatureSettings {
    constructor(selected) {
        this.selected = selected;
    }

    //<editor-fold desc="list">
    @computed
    get list() {
        const {signatureSettings} = list;
        if (is.isContractorView) {
            const {loggedContractor} = this.storage;
            if (!loggedContractor)
                return [];
            return signatureSettings.filter(({id, data: {contractor_id}}) => contractor_id === loggedContractor.id);
        }
        const {selectedClient} = this.selected;
        const clientId = selectedClient && selectedClient.id;
        if (!clientId)
            return [];
        return signatureSettings.filter(({id, data: {client_id}}) => client_id === clientId);
    }

    //</editor-fold>

}

const selected = new Selected();
export default selected;