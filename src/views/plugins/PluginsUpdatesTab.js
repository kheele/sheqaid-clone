import React from "react";
import {observer} from 'mobx-react';

import APluginsTab from './APluginsTab.js';

import style from "./PluginsUpdatesTab.lazy.css";

@observer
class PluginsUpdatesTab extends APluginsTab {
    path;
    pageKey = "PluginsUpdatesTab";

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
        return list.filter(item => item.key !== 'Dashboard' && item.status !== 'Upcoming' && item.has_update);
    }

}

export default PluginsUpdatesTab;
