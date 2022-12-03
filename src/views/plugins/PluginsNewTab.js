import React from "react";
import {observer} from 'mobx-react';

import APluginsTab from './APluginsTab.js';

import style from "./PluginsNewTab.lazy.css";

@observer
class PluginsNewTab extends APluginsTab {
    path;
    pageKey = "PluginsNewTab";
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
        return list.filter(item => item.key !== 'Dashboard' && item.status === 'New');
    }

}

export default PluginsNewTab;
