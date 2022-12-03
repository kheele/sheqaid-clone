import {computed, observable} from 'mobx';
import {computedFn} from "mobx-utils";

class Store {

    @observable
    state = {
        list: []
    };

    constructor() {
    }

    load() {
        neonBinding.events.emit("notifications/list/unread").then(list => {
//            console.log("emit = notifications/list/unread", list)
            this.state.list = list;
        });
        neonBinding.events.on("notifications/onCreated", item => {
            const {data: {_group, name}} = item;
            let itemGroup = this.list.find(v => v._group === _group);
            if (itemGroup) {
                const {_group, list} = itemGroup;
                const itemSubGroup = list.find(({name_group, list}) => name_group === name.plural);
                if (itemSubGroup) {
                    itemSubGroup.list.push(item);
                }
            } else {
                const itemSubGroup = {name_group: name.plural, list: [item]};
                itemGroup = {_group, list: [itemSubGroup]};
                this.list.push(itemGroup);
            }
        });
        neonBinding.events.on("notifications/onRemoved", item => {
            const {data: {_group, name}} = item;
            const itemGroup = this.list.find(v => v._group === _group);
            if (itemGroup) {
                const {_group, list} = itemGroup;
                const itemSubGroup = list.find(({name_group, list}) => name_group === name.plural);
                if (itemSubGroup) {
                    itemSubGroup.list.removeIf(v => v.id === item.id);
                }
            }
        });
    }

    @computed
    get list() {
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        return this.listBy(selectedClient, selectedProject, selectedSite);
    }

    @computed
    get count() {
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        return this.countBy(selectedClient, selectedProject, selectedSite);
    }

    listBy = computedFn((selectedClient, selectedProject, selectedSite) => {
        return this.state.list.filter(({_group, list}) => {
            return list.anyMatch(item => {
                return !this.filterList(item, selectedClient, selectedProject, selectedSite).isEmpty();
            });
        });
    }, true);

    countBy = computedFn((selectedClient, selectedProject, selectedSite) => {
        return this.listBy(selectedClient, selectedProject, selectedSite).map(({_group, list}) => {
            return list.filter(({name_group, list}) => {
                return list.filter(({data: {removed, is_read}}) => !removed && !is_read).anyMatch(this.filterByOrg(selectedClient, selectedProject, selectedSite));
            }).map(item => {
                return this.filterList(item, selectedClient, selectedProject, selectedSite).filter(({data: {removed, is_read}}) => !removed && !is_read).length;
            }).reduce((n1, n2) => n1 + n2, 0);
        }).reduce((n1, n2) => n1 + n2, 0);
    }, true);

    filterList(item, selectedClient, selectedProject, selectedSite) {
        const {name_group, list} = item;
        if(selectedClient) {
        console.log('name_group', name_group, list.length, selectedClient.name)
    } else {
        console.log('name_group not logged', name_group, list.length, list.distinct('id').length)
    }
        return list.distinct('id').filter(({data}) => !data.removed).filter(this.filterByOrg(selectedClient, selectedProject, selectedSite));
    }

    filterByOrg(selectedClient, selectedProject, selectedSite) {
        return ({id, data: {client, project, site, client_id, project_id, site_id}}) => {
            if (selectedSite) {
                const {id: org_id} = selectedSite;
                if (site) {
                    return site.id === org_id;
                }
                if (site_id) {
                    return site_id === org_id;
                }
                return false;
            }
            if (selectedProject) {
                const {id: org_id} = selectedProject;
                if (project) {
                    return project.id === org_id;
                }
                if (project_id) {
                    return project_id === org_id;
                }
                return false;
            }
            if (selectedClient) {
                const {id: org_id} = selectedClient;
                if (client) {
                    return client.id === org_id;
                }
                if (client_id) {
                    return client_id === org_id;
                }
                return false;
            }
            return false;
        };
    }

}

const store = new Store();
export default store;
