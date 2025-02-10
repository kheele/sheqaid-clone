import React from "react";
import {observer} from 'mobx-react';

import ADashboardTab from './ADashboardTab';

import style from "./DashboardEmployeeTab.lazy.css";

@observer
class DashboardEmployeeTab extends ADashboardTab {
//    path;
    className = "DashboardEmployeeTab";

    constructor(props) {
        super(props, style);

        this.path = props.path + 'dashboard/employee/';
    }
}

export default DashboardEmployeeTab;
