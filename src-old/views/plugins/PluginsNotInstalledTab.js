import React from "react";
import {observer} from 'mobx-react';

import APluginsTab from './APluginsTab.js';

import style from "./PluginsNotInstalledTab.lazy.css";

@observer
class PluginsNotInstalledTab extends APluginsTab {
    path;
    pageKey = "PluginsNotInstalledTab";
    isInstallable = true;

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    
    onFilter(list) {
        return list.filter(item => item.key !== 'Dashboard' && item.status === 'NotInstalled');
    }

}

export default PluginsNotInstalledTab;
