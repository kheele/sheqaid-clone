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

    includedOHSDocList = [
        '_01_Project_Plan',
        '_02_IMS_Policies',
        'Trainings',
        '_09_HIRA_And_Opportunities',
        '_13_2_3_Hazardous_Chemical_Substances',
        // '_16_Emergency_Preparedness',
        '_17_Incident_Investigation',
        '_18_Nonconformance_Management',
        '_19_Maintenance',
        '_21_Internal_Audit',
        'Inspections',
        'SafetyFiles',
    ];

    constructor(props) {
        super(props);
    }

}

export default SelectInput;
