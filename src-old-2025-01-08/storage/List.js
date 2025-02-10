import {computed} from 'mobx';

import {is, selected} from './';

class List {

    @computed
    get countries() {
        const {attrs} = this.storage;
        return attrs.has("countries") ? attrs.get("countries") : [];
    }

    @computed
    get countryNames() {
        return this.countries.map((val, n) => {
            return val.data.name;
        });
    }

    @computed
    get permissionOtherKeys() {
        const {attrs} = this.storage;
        return attrs.has("permissionOtherKeys") ? attrs.get("permissionOtherKeys") : [];
    }

    @computed
    get signatureSettings() {
        const {attrs} = this.storage;
        return attrs.has("signature-settings") ? attrs.get("signature-settings") : [];
    }

    @computed
    get emergencyContactsExternal() {
        const {attrs} = this.storage;
        const key = "emergency-numbers-external";
        return attrs.has(key) ? attrs.get(key) : [];
    }

    @computed
    get emergencyContactsInternal() {
        const {attrs} = this.storage;
        const key = "emergency-numbers-internal";
        return attrs.has(key) ? attrs.get(key) : [];
    }

    @computed
    get clientsBlacklisted() {
        const {isLoggedClient} = is;
        if (isLoggedClient) {
            return [];
        }
        const {client_blacklist = []} = this.storage.loggedUser.user.data;
        const l = client_blacklist.map(v => v.id || v);
        return this.clients.filter(v => l.contains(v.id));
    }

    @computed
    get projectsBlacklisted() {
        const {isLoggedProject} = is;
        if (isLoggedProject) {
            return [];
        }
        const {project_blacklist = []} = this.storage.loggedUser.user.data;
        const l = project_blacklist.map(v => v.id || v);
        return this.projects.filter(v => l.contains(v.id));
    }

    @computed
    get sitesBlacklisted() {
        const {isLoggedSite} = is;
        if (isLoggedSite) {
            return [];
        }
        const {site_blacklist = []} = this.storage.loggedUser.user.data;
        const l = site_blacklist.map(v => v.id || v);
        return this.sites.filter(v => l.contains(v.id));
    }

    @computed
    get clients() {
        const {attrs} = this.storage;
        const {isLoggedClient, isLoggedProject} = is;
        const {projects} = this;
        if (isLoggedClient) {
            const {client: my_client} = this.storage.loggedUser.user.data;
            console.log('clients my_client', my_client)
            if (isLoggedProject) {
                setTimeout(() => {
                    if(my_client.data) {
                        my_client.data.project_list = projects;
                    } else {
                        my_client.project_list = projects;
                    }
                });
            }
            return [my_client];
        }
        if (!attrs.has("clients"))
            attrs.set("clients", []);
        return attrs.get("clients");
    }

    set clients(val) {
        const {attrs} = this.storage;
        attrs.set("clients", val);
    }

    @computed
    get projects() {
        const {attrs} = this.storage;
        const {isLoggedProject, isLoggedSite} = is;
        const {sites} = this;

        if (isLoggedProject) {
            const {project: my_project} = this.storage.loggedUser.user.data;
            console.log('projects my_project', my_project)
            if (isLoggedSite) {
                setTimeout(() => {
                    if(my_project.data) {
                        my_project.data.site_list = sites;
                    } else {
                        my_project.site_list = sites;
                    }
                });
            }
            return [my_project];
        }
        if (!attrs.has("projects"))
            attrs.set("projects", []);
        return attrs.get("projects");
    }

    @computed
    get projectsFiltered() {
        const {isLoggedProject} = is;
        const {selectedClient} = selected;
        const {projects} = this;

        if (isLoggedProject) {
            return projects;
        }
        if (selectedClient) {
            const {data, project_list} = selectedClient;
            if (project_list) return project_list;
            if (data && data.project_list) return data.project_list;
//            return projects.filter(({data: {client}}) => !!client).filter(({data: {client}}) => client.id === selectedClient.id);
        }
        return projects;
    }

    set projects(val) {
        const {attrs} = this.storage;
        attrs.set("projects", val);
    }

    @computed
    get sites() {
        const {attrs} = this.storage;
        const {isLoggedSite} = is;

        if (isLoggedSite) {
            const {site: my_site} = this.storage.loggedUser.user.data;
            return [my_site];
        }
        if (!attrs.has("sites"))
            attrs.set("sites", []);
        return attrs.get("sites");
    }

    @computed
    get sitesFiltered() {
        const {selectedProject, selectedClient} = selected;
        const {isLoggedSite} = is;
        const {sites} = this;
        if (isLoggedSite) {
            return sites;
        }
        if (selectedProject) {
            const {data, site_list} = selectedProject;
            if (site_list) return site_list;
            if (data && data.site_list) return data.site_list;
//            return sites.filter(({data: {project}}) => !!project).filter(({data: {project}}) => project.id === selectedProject.id);
        }
        if (selectedClient) {
            const {data, site_list} = selectedClient;
            if (site_list) return site_list;
            if (data && data.site_list) return data.site_list;
//            return sites.filter(({data: {client}}) => !!client).filter(({data: {client}}) => client.id === selectedClient.id);
        }
        return sites;
    }

    set sites(val) {
        const {attrs} = this.storage;
        attrs.set("sites", val);
    }

}

const list = new List();
export default list;
