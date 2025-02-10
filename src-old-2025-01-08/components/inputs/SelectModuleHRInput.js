import {observer} from 'mobx-react';

import ASelectModuleInput from './ASelectModuleInput';

@observer
class SelectInput extends ASelectModuleInput {

    key = 'listHR';
    includedList = [
        //Templates
        'Contracts',
        //Non-Templates
        'Warnings',
        'Counseling',
        'Leaves',
        'PPE',
        'Meetings',
    ];

    includedOHSDocList = [
        'Employees',
        'Contracts',
        'Warnings',
        'Counseling',
        'Leaves',
        'PPE',
        'Meetings',
    ];

    constructor(props) {
        super(props);
    }

}

export default SelectInput;
