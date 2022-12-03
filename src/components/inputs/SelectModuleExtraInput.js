import React from "react";
import {observer} from 'mobx-react';

import ASelectModuleInput from './ASelectModuleInput';

@observer
class SelectInput extends ASelectModuleInput {

    key = 'listExtra';
    includedList = [
        //Templates
        '__C_Structure_And_Responsibility',//Job Appointments
        //Non-Templates
        // '__B_Contractors',Later
    ];

    constructor(props) {
        super(props);
    }

}

export default SelectInput;
