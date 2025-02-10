import React from "react";
import {observer} from 'mobx-react';

import ASelectModuleInput from './ASelectModuleInput';

@observer
class SelectInput extends ASelectModuleInput {

    key = 'listExtra';
    includedList = [
        //Templates
        'Job Appointments',//Job Appointments
        //Non-Templates
        // '__B_Contractors',Later
    ];

    includedOHSDocList = [
        'Job Appointments',
        '__B_Contractors',
    ];

    constructor(props) {
        super(props);
    }

}

export default SelectInput;
