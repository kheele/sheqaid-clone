import React from "react";
import {observer} from 'mobx-react';

import ADashboardTab from './ADashboardTab';

import style from "./DashboardUserTab.lazy.css";

@observer
class DashboardUserTab extends ADashboardTab {
//    path;
    className = "DashboardUserTab";

    constructor(props) {
        super(props, style);
        
        this.path = props.path + 'dashboard/user/';
    }
}

export default DashboardUserTab;
