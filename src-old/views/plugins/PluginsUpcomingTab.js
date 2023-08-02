import React from "react";
import {observer} from 'mobx-react';

import APluginsTab from './APluginsTab.js';

import style from "./PluginsUpcomingTab.lazy.css";

@observer
class PluginsUpcomingTab extends APluginsTab {
    path;
    pageKey = "PluginsUpcomingTab";

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
        return list.filter(item => item.key !== 'Dashboard' && item.status === 'Upcoming');
    }
    
}

export default PluginsUpcomingTab;
