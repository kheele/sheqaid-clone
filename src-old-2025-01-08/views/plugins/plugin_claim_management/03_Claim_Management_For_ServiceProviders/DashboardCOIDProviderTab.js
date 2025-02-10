import React from "react";
import {observer} from 'mobx-react';

import ADashboardTab from './ADashboardTab';

import style from "./DashboardCOIDProviderTab.lazy.css";

@observer
class DashboardCOIDProviderTab extends ADashboardTab {
//    path;
    className = "DashboardCOIDProviderTab";

    constructor(props) {
        super(props, style);

        this.path = props.path + 'dashboard/coid-provider/';
    }
}

export default DashboardCOIDProviderTab;
