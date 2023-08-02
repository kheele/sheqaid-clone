import React from "react";
import {observer} from 'mobx-react';

import ADashboardTab from './ADashboardTab';

import style from "./DashboardMedicalPractitionerTab.lazy.css";

@observer
class DashboardMedicalPractitionerTab extends ADashboardTab {
//    path;
    className = "DashboardMedicalPractitionerTab";

    constructor(props) {
        super(props, style);
        
        this.path = props.path + 'dashboard/medical-practitioner/';
    }
}

export default DashboardMedicalPractitionerTab;
