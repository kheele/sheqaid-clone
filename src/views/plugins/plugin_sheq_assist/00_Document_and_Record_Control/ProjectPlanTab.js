import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {ClearableInput} from 'components/inputs';

import AMain from '../../common/documents/AMain';

@observer
class ProjectPlanTab extends AMain {

    pageKey = "_01_Project_Plan";
    type = "Project Plan";

    createBtnTitle="Upload New";
    pageTitle = "Project Plans";
    pageTitleSingular = "Project Plan";
    permissionKey = "_01_Project_Plan";

    @observable
    state = {
        lists: {
            types: [{value: "Upload", text: "PDF", checked: false}, {value: "Type", text: "Typed", checked: false}]
        }
    };

    constructor(props) {
        super(props);
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="type" type="radio" placeholder="Document Type" className="form-control fixed-flex min-w-355" onChange={onChange} values={this.state.lists.types}/>
            <ClearableInput name="title" type="text" placeholder="Name of Document" className="form-control" onChange={onChange}/>
            <ClearableInput name="owner" type="text" placeholder="Owner" className="form-control" onChange={onChange}/>
        </div>;
    }
}

export default ProjectPlanTab;
