import {computed} from 'mobx';

import * as default_pages from '../views/default';
import * as plugins_pages from '../views/plugins';

const staticPlugins = {default: default_pages, plugins: plugins_pages};

class Manager {

    get defaultPluginModules() {
        return staticPlugins.default.modules;
    }

    @computed
    get selectedPluginModules() {
        const {plugins} = staticPlugins;
        const keys = Object.keys(plugins);
//        console.log('selectedPluginModules', keys)
        const o = {};
        for (let n = 0; n < keys.length; n++) {
            const key = keys[n];
            $.extend(o, {...plugins[key].modules});
        }
        return o;
    }

}

const manager = new Manager();
export default manager;