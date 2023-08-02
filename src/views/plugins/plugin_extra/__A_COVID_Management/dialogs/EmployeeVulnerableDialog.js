import React from "react";
import {observer} from 'mobx-react';
import {AProfileDialog} from 'components/dialogs';
import {ProfilePic} from 'components/inputs';

import {EmployeeVulnerabilityCaseList} from './EmployeeLists';

import style from "./EmployeeVulnerableDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "EmployeeVulnerableDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Employee Vulnerability Case(s)";
    }

    get topButtonsHiddenDelete() {
        return true;
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {

    constructor(props) {
        super(props);
    }
    
    get item() {
        return this.props.state.item;
    }
    
    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog: {renderProfileCover}},
            item: {_group: group, list}
        } = this;
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <ProfilePic profilePic="employees" id={group.id} readonly className="x60 hor-center margin-b-5"/>
                    <h3>{group.lname + " " + group.fname}</h3>
                </React.Fragment>)}
                <EmployeeVulnerabilityCaseList list={list}/>
            </div>
        </div>;
    }

}

export default ProfileDialog;
