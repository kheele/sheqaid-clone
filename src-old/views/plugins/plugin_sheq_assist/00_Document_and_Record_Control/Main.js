import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {ClearableInput} from '../../../../components/inputs';

import AMain from '../../common/documents/AMain';

@observer
class Main extends AMain {
    static key = 'Documents';
    static title = 'Documents';
    static faIconLeft = 'users';

    path = "plugin_sheq_assist/Documents/";
    pageKey = "Documents";

    notHasWritePermission = true;
    pageTitle = "List of Documents";
    pageTitleSingular = "document";
    permissionKey = "Documents";
    noAnimation = false;

    @observable
    state = {
        lists: {
            groups: [
                {label: 'Project Plan', value: '_01_Project_Plan'},
                {label: 'Project Plan (Documents)', value: '_01_Project_Plan_documents'},
                {label: 'IMS Policies', value: '_02_IMS_Policies'},
                {label: 'Training (Toolbox Talks)', value: '_05_Training_toolbox_talks'},
                {label: 'Environmental Aspects (Checklist)', value: '_08_Environmental_Aspects_checklist'},
                {label: 'Environmental Aspects (Quality Assurance Plans)', value: '_08_Environmental_Aspects_qap'},
                {label: 'Environmental Aspects (Environmental Management Plan)', value: '_08_Environmental_Aspects_emp'},
                {label: 'Emergency Preparedness (Emergency Procedure)', value: '_16_Emergency_Preparedness_emergency_procedure'},
                {label: 'COVID Management (Documents)', value: 'COVID_Management_documents'}
            ]
        }
    };

    constructor(props) {
        super(props);
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="group" type="select" placeholder="Document Group" className="form-control" onChange={onChange} values={this.state.lists.groups}/>
            <ClearableInput name="title" type="text" placeholder="Name of Document" className="form-control" onChange={onChange}/>
            <ClearableInput name="owner" type="text" placeholder="Owner" className="form-control" onChange={onChange}/>
        </div>;
    }

}

export default Main;
