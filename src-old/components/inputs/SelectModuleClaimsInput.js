import React from "react";
import {observer} from 'mobx-react';

import ASelectModuleInput from './ASelectModuleInput';

@observer
class SelectInput extends ASelectModuleInput {

    key = 'listClaim';
    includedList = [];

    constructor(props) {
        super(props);
    }

}

export default SelectInput;
