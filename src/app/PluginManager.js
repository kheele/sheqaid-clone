import {computed, observable} from 'mobx';
import {computedFn} from "mobx-utils";
import {listPlugins} from "mutations/list";

class Manager {

    @observable
    state = {
        selectedPlugin: null,
        isGlobal: false
    };
    @observable
    dataState = {
        list: [],
        listState: 'action',
        dataError: false,
        dataLoaded: false
    };
    listAllBy = computedFn(() => {
        const {list} = this.dataState;
        return list.filter(val => val.data.key !== 'plugin_admin');
    }, true);

    constructor() {
        this.onLoadList = this.onLoadList.bind(this);
        this.getPluginsByModules = this.getPluginsByModules.bind(this);
        this.updateModules = this.updateModules.bind(this);

        workers.on("plugin_manager/onCreated", item => {
            let {modules = []} = item.data;
            modules.sort(onSortModule);
            const {list} = this.dataState;
            list.push(item);
            console.log('plugin_manager/onCreated', item)
        });
        workers.on("plugin_manager/onUpdated", item => {
            const {modules = []} = item.data;
            modules.sort(onSortModule);
            const {list} = this.dataState;
            list.replaceIf(item, v => v.id === item.id);
            console.log('plugin_manager/onUpdated', item)
        });
        workers.on("plugin_manager/onRemoved", item => {
            const {list} = this.dataState;
            list.removeIf(v => v.id === item.id);
            console.log('plugin_manager/onRemoved', item)
        });
    }

    @computed
    get isLoadError() {
        return this.dataState.dataError;
    }

    @computed
    get isLoaded() {
        return this.dataState.dataLoaded;
    }

    @computed
    get listAll() {
        return this.listAllBy();
    }

    @computed
    get listInstalled() {
        return this.listAll.filter(val => val.data.status === 'Installed');
    }

    @computed
    get selected() {
        return this._selected ? this._selected : this._selected = new Selected(this);
    }

    start() {
        this.onLoadList();
    }

    onLoadList() {
        this.dataState.dataLoaded = false;
        this.dataState.dataError = false;

        return listPlugins().then(res => {
            //Dashboard decide what to enter
            // console.log('listAllPlugin', res)
            this.dataState.list = res;

            this.dataState.listState = 'initial';
            this.dataState.dataError = false;
            this.dataState.dataLoaded = true;

            if (this.listInstalled.length === 1) {
                this.selected.selectedPluginGlobal = this.listInstalled[0];
            }
            return res;
        }).catch(e => {
            console.log(e)
            this.dataState.listState = 'initial';
            this.dataState.dataError = true;
            this.dataState.dataLoaded = true;
            return e;
        });
    }

    getPluginsByModules(__module_list) {
        const {list} = this.dataState;
        return list.filter(plugin => {
            const {data: {module_list}} = plugin;
            return module_list.anyMatch(({module: {key}}) => __module_list.anyMatch(({module: {key: __key}}) => __key === key));
        });
    }

    updateModules(plugin_list) {
        setTimeout(() => {
            const {list} = this.dataState;
            list.forEach(plugin => {
                const newPlugin = plugin_list.find(v => v.id === plugin.id);
                if (newPlugin) {
                    plugin.data = newPlugin.data;
                }
            });
        });
    }

}

class Selected {
    manager;

    constructor(manager) {
        this.manager = manager;
    }

    //
    @computed
    get get() {
        return this.manager.state.selectedPlugin;
    }

    set set(val) {
        const {state} = this.manager;
        state.selectedPlugin = val;
        state.isGlobal = false;
    }

    set global(val) {
        const {state} = this.manager;
        state.isGlobal = !!val;
        state.selectedPlugin = val;
    }

    @computed
    get title() {
        const {get: _get} = this;
        return _get && _get.data.title;
    }

    @computed
    get key() {
        const {get: _get} = this;
        return _get && _get.data.key;
    }
}

function onSortModule(a, b) {
    if (a.sort > b.sort)
        return 1;
    if (a.sort < b.sort)
        return -1;
    return 0;
}

const manager = new Manager();
export default manager;