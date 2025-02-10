import React from "react";
import {observer} from 'mobx-react';

import ADashboardTab from './ADashboardTab';

import style from "./DashboardContractorTab.lazy.css";

@observer
class DashboardContractorTab extends ADashboardTab {
//    path;
    className = "DashboardContractorTab";

    constructor(props) {
        super(props, style);

        this.path = props.path + 'dashboard/contractor/';
    }
}

export default DashboardContractorTab;
