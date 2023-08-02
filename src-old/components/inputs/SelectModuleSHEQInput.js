import React from "react";
import {observer} from 'mobx-react';

import ASelectModuleInput from './ASelectModuleInput';

@observer
class SelectInput extends ASelectModuleInput {

    key = 'listSHEQ';
    includedList = [
        //Templates
        '_01_Project_Plan',
        '_02_IMS_Policies',
        //Non-Templates
        // '_09_HIRA_And_Opportunities',Later
        // '_16_Emergency_Preparedness',Later
        '_17_Incident_Investigation',
        '_18_Nonconformance_Management',
        '_19_Maintenance',//Parts
    ];

    constructor(props) {
        super(props);
    }

}

export default SelectInput;
